import { AuthError, ConflictError } from "../../common/error";
import { prisma } from "../../utils/db/prisma";
import { comparePassword, createJWT, hashPassword } from "../../utils/jwtAuth/jwt";
import { User } from "./auth.interface";

export default class AuthRepository{
    public async addUser(userData: User){
        let { firstname, lastname, email, password, contact } = userData;

        let user = await prisma.user.findUnique({  // check if user with email already exist
          where: { email },
        });
    
        if (user) throw new ConflictError();
    
        user = await prisma.user.create({
          data: {
            firstname, 
            lastname,
            email,
            contact,
            password: await hashPassword(password),
          }
        });
        console.log("This is the user created", user)
        const User = { firstname, lastname, email, id: user.id, contact };
        const token = createJWT(user);
        return {User, token}
    }

    public async signIn(userData: Pick<User, "email" | "password">) {
        const {email, password} = userData;

        const user = await prisma.user.findUnique({  // check if user exist
            where: { email: userData.email },
          });
      
        if(!user) throw new AuthError("Authentication Failed!");
    
        const isValid = await comparePassword(password, user.password);
    
        if (!isValid) throw new AuthError("Authentication Failed!");
    
        const token = createJWT(user);

        return token;
    }
}