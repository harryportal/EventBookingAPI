import request from "supertest";
import app from "../../app";
import { prisma } from "../../utils/db/prisma";
import { User } from "@prisma/client";


const userPayload: Omit<User, "id"> = {  email: "testemail@email.com", firstname:"firstname", 
lastname:"lastname", contact:"+2348000000000", password:"password" }

const incompletePayload: Partial<User> = {email:"newtestemail@email", firstname:"firstname"}

const invalidUsuer:Omit<User, "id"> = {  email: "invalid@email.com", firstname:"firstname", 
        lastname:"lastname", contact:"+2348000000000", password:"password" };


afterAll(async()=>{
    await prisma.user.delete({where:{email:"testemail@email.com"}})
    await prisma.$disconnect();
})

describe("Test for Signing Up Endpoint", ()=>{
  
    it("should return a status code of 201 and id for a valid user data", async ()=>{
        const response = await request(app).post("/api/v1/auth/signup").send(userPayload)
        expect(response.statusCode).toBe(201);
        expect(response.body.data.User).toHaveProperty("id");
     }),

    it("should return a status code of 400 if payload fails input validation", async ()=>{
        const response = await request(app).post("/api/v1/auth/signup").send(incompletePayload)
        expect(response.statusCode).toBe(400);
    }),

    it("should return a status code of 409 for a duplicate email adrress", async()=>{
        const response = await request(app).post("/api/v1/auth/signup").send(userPayload);
        expect(response.statusCode).toBe(409);
    })

})

describe("Test for Signing In EndPoint", ()=>{
    it("should return valid jwt token with a 200 status code for an authenticate user", async ()=>{
        const response = await request(app).post("/api/v1/auth/login").send(userPayload)
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    }),

    it("should return a status code of 401 for an unauthentcated User", async()=>{
        const response = await request(app).post("/api/v1/auth/login").send(invalidUsuer)
        expect(response.statusCode).toBe(401);

    }), 
    
    it("should return a status code of 400 for incomplete data",async ()=>{
        const response = await request(app).post("/api/v1/auth/login").send(incompletePayload)
        expect(response.statusCode).toBe(400);
    })
})

 