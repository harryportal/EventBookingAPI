import { createJWT } from "../../utils/jwtAuth/jwt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { userPayload } from "../../modules/auth/auth.interface";


describe("Test the JWT Function", ()=>{
    it("should return payload that matches user object", ()=>{
        const payload: userPayload = {email:"testemail@mail.com", id:randomUUID()}
        const token = createJWT(payload);
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        expect(decode).toMatchObject(payload)
    })
})