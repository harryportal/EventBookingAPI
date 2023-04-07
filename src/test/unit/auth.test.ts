import { createJWT } from "../../utils/jwtAuth/jwt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

interface User {
    id: string,
    username: string
}


describe("Test the JWT Function", ()=>{
    it("should return payload that matches user object", ()=>{
        const payload: User = {username:"username", id:randomUUID()}
        const token = createJWT(payload);
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        expect(decode).toMatchObject(payload)
    })
})