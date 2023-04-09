import { AuthError, ConflictError } from "../../common/error";
import { prisma } from "../../utils/db/prisma";
import { comparePassword, createJWT, hashPassword } from "../../utils/jwtAuth/jwt";
import { User } from "./auth.interface";

export default class AuthRepository{
    private user ;
    constructor(){
        this.user = prisma.user;
    }
    public async addUser(userData: User){
        let { firstname, lastname, email, password, contact } = userData;

        let user = await this.user.findUnique({  // check if user with email already exist
          where: { email },
        });
    
        if (user) throw new ConflictError();
    
        user = await this.user.create({
          data: {
            firstname, 
            lastname,
            email,
            contact,
            password: await hashPassword(password),
          }
        });
        console.log("This is the user created", user) 
        // todo:look for a better way to send the user information without having to create a new object.
        user = { firstname, lastname, email, id: user.id, contact }; 
        return user;
    }

    public async signUser(userData: Pick<User, "email" | "password">) {
        const {email, password} = userData;

        const user = await this.user.findUnique({  // check if user exist
            where: { email },
          });
      
        if(!user) throw new AuthError("Authentication Failed!");
    
        const isValid = await comparePassword(password, user.password);
    
        if (!isValid) throw new AuthError("Authentication Failed!");
        return user;
    }
}

