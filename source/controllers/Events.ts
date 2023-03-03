import { PrismaClient } from "@prisma/client";
import {Request, Response} from "express";
import { AuthRequest } from "../utils/interface";
import { prisma } from "../utils/db";


export default class EventController {

    static createEvent = async (req:AuthRequest,  res:Response) => {
        const {name, description, date, startTime, endTime, capacity, location} = req.body;
        const event = await prisma.event.create({
            data: {
                name, description, date, startTime, endTime, capacity, location, 
                creator: {
                    connect: {id: req.user.id}
                }
            }
        })
        res.json({sucess:true, data:event});
        };


    static attendEvent =async (req:Request,  res:Response) => {
        const {email, firstname, lastname, contact, address} = req.body;
        const eventId = req.params.id;

        // check if the event exist
        const event = await prisma.event.findUnique({
            where:{ id: eventId }  })
           

        if(!event) { return res.status(400).json({success:false, message: "No event with Id provided"})}

        const attendee = await prisma.attendee.create({
            data:{
                email, firstname, lastname, contact, address, 
                event: {connect: { id: req.params.id }}
            },
            include: {event: true} // returns the attendee and the event details to the front end
        })

        // work on a logic to check the capacity of the event before adding a new attendee

        res.json({success:true, data: attendee});
    }

    static getAttendees =async (req:Request,  res:Response) => {
        const eventId = req.params.id;
        const eventAttendees = await prisma.event.findUnique({
            where:{
                id: eventId
            },
            include: {attendees: true}
        });

        if(!event) { return res.status(400).json({success:false, message: "No event with Id provided"})};

        res.json({success:true, data: eventAttendees})
    }
}


