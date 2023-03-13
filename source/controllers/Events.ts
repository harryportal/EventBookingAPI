import {Request, Response} from "express";
import { AuthRequest } from "../interfaces/userAuth";
import { prisma } from "../utils/db";
import { BadRequestError } from "../middleware/error";
import MailService from "../service/mailing";
import logger from "../utils/winston";


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
        // Work on templates later
        const mailing =  new MailService();
        try{
        mailing.sendMail(req.headers['X-Request-Id'], {to:req.user.email, subject: "Event Created", html:"Email Sent"})
        res.json({sucess:true, data:event});}
        catch(err){
            logger.error(err) }
        };


    static addAttendee = async (req:Request,  res:Response) => {
        const {email, firstname, lastname, contact, address} = req.body;
        const eventId = req.params.id;

        // check if the event exist
        const event = await prisma.event.findUnique({
            where:{ id: eventId }  })
           

        if(!event) { throw new BadRequestError("No event with Id!") }
        
        // Check if event is at capacity before adding the new attendee

        if(event.capacity == event.totalCapacity){ throw new BadRequestError("Event at Capacity") }
        
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

        if(!eventAttendees) { throw new BadRequestError("No event with Id!") };

        res.json({success:true, data: eventAttendees})
    }
}


