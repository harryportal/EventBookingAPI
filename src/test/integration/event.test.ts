import request from "supertest";
import app from "../../app";
import { prisma } from "../../utils/db/prisma";
import { User , Event } from "@prisma/client";
import { createJWT } from "../../utils/jwtAuth/jwt";

3

const userPayload: Omit<User, "id"> = {  email: "test@email.com", firstname:"firstname", lastname:"lastname", contact:"+2348000000000", password:"password" }

const eventPayload = { name: "event", description: "new event", date: new Date(), startTime:"11:45", endTime: "16:50", location: "zoom", totalCapacity: "10", timezone: "WAT +2:00"}; 
const invalidEventPayload = { name: "event", description: "new event", date: new Date(), startTime:"11:45" }

beforeAll(async()=>{
    // createa a user that will  be used to authenticate protected routes
    const user:User = await prisma.user.create({
        data: userPayload
    })
    const token = createJWT(user);
    process.env.USER_ID = user.id;
    process.env.AUTH_TOKEN = token;
});

afterAll(async()=>{
    await prisma.user.delete({where:{email:"test@email.com"}});
    await prisma.$disconnect();
})

describe("Test the Create Event Endpoint", ()=>{
    it("should return 201 status code and event id for a successful creation", async()=>{
        const response = await request(app).post("/api/v1/events")
        .set('Authorization', `Bearer ${process.env.AUTH_TOKEN}`).send(eventPayload);

        expect(response.statusCode).toBe(201);
        
    }),

    it("should return a 401 status code for an unauthenticated User ", async()=>{
        const response = await request(app).post("/api/v1/events").send(eventPayload);
        expect(response.statusCode).toBe(401);
        

    }), 
    
    it("should return a 400 status code if event details fails input validation", async()=>{
        const response = await request(app).post("/api/v1/events")
        .set('Authorization', `Bearer ${process.env.AUTH_TOKEN}`).send(invalidEventPayload);
        expect(response.statusCode).toBe(400);
    })
})


describe("test the add Attendee endpoint", ()=>{

    it("should return 401 status code if user is not authenticated", async()=>{
        const response = await request(app).post("/api/v1/events/test_id/attendees");
        expect(response.statusCode).toBe(401);

    }), 


    it("should return a 201 status code and the attendee id", async()=>{ // change the status code to 200
        // get the id for the authenticated user
        const user = await prisma.user.findUnique({where:{email:"test@email.com"}})
        const event = await prisma.event.findFirst({where:{creatorId: user.id}})

        const response = await request(app).post(`/api/v1/events/${event.id}/attendees`)
        .set('Authorization', `Bearer ${process.env.AUTH_TOKEN}`);

        expect(response.statusCode).toBe(201);
        console.log(response.body)
        expect(response.body.data).toHaveProperty("id")


    })
})

describe("test the Update Event Endpoint", ()=>{
    beforeAll(async()=>{
        const event = await prisma.event.findFirst({where:{name:"event"}});
        process.env.EVENT_ID = event.id;
    })
    
    it("should return 401 status code for unauthenticated user", async()=>{
        const response = await request(app).put("/api/v1/events/event_id");
        expect(response.statusCode).toBe(401);
    }), 

    
    xit("should return 200 status code and the event details", async()=>{
        const response = await request(app).put(`/api/v1/events/${process.env.EVENT_ID}`)
        .set('Authorization', `Bearer ${process.env.AUTH_TOKEN}`).send(eventPayload)

        expect(response.statusCode).toBe(200)
        expect(response.body.data).toHaveProperty("id");

    })
})

