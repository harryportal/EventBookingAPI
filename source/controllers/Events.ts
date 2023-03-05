import {Request, Response} from "express";
import { AuthRequest } from "../utils/interface";
import { prisma } from "../utils/db";


export default class EventController {

    static createEvent = async (req:AuthRequest,  res:Response) => {
        const {name, description, date, startTime, endTime,  location, totalCapacity} = req.body;
        
        const event = await prisma.event.create({
            data: {
                name, description, date, startTime, endTime, location, totalCapacity,
                creator: {
                    connect: {id: req.user.id}
                }
            }
        })

        res.json({sucess:true, data:event});
        };


    static attendAttendee =async (req:Request,  res:Response) => {
        const {email, firstname, lastname, contact, address} = req.body;
        const eventId = req.params.id;

        // check if the event exist
        const event = await prisma.event.findUnique({
            where:{ id: eventId }  })
           

        if(!event) { return res.status(400).json({success:false, message: "No event with Id provided"}) }
        
        // Check if event is at capacity before adding the new attendee

        if(event.capacity == event.totalCapacity){ return res.status(400).json({success:false, message:"Event at Capacity"} )}
        
        const addAttendee = await prisma.$transaction([
            prisma.attendee.create({
            data:{
                email, firstname, lastname, contact, address, 
                event: {connect: { id: req.params.id }}
            },
            include: {event: true} // returns the attendee and the event details to the front end
        }),

            prisma.event.update({
            where: { id: eventId },
            data: { capacity: { increment: 1 } }
          })
        ])

        
        const [newAttendee, _] = addAttendee;
        res.json({success:true, data: newAttendee});
    }





    static getAttendees =async (req:AuthRequest,  res:Response) => {
        const eventId = req.params.id;
        const userId = req.user.id;

        const eventAttendees = await prisma.event.findFirst({
            where:{ 
                id: eventId,
                creatorId: userId
            },
            include: {attendees: true}
        });

        if(!eventAttendees) { return res.status(400).json({success:false, message: "No event with Id provided"}) };

        res.json({success:true, data: eventAttendees})
    }
}


