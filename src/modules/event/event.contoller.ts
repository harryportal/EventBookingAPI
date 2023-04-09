import {Response} from "express";
import { AuthRequest } from "../auth/auth.interface";
import { prisma } from "../../utils/db/prisma";
import { BadRequestError } from "../../common/error";
import MailService from "../mail/mail.service";
import logger from "../../utils/logging/winston";
import EventRepository from "./event.repository";


export default class EventController {
    private static eventRepository = new EventRepository();
    private static mailServie = new MailService();
    
    static createEvent = async (req:AuthRequest,  res:Response) => {
        const eventPayload = req.body;
        eventPayload.date = new Date(eventPayload.date);
        eventPayload.totalCapacity = Number(eventPayload.totalCapacity)
        
        const event = await this.eventRepository.addEvent(eventPayload, req.user.id)
        this.sendMail(req.user.email, req);  // update: make this a background task
        res.status(201).json({success:true, event})
    }

    private static sendMail = (email:string, req:AuthRequest)=>{
        try{
            this.mailServie.sendMail(req.headers['X-Request-Id'], {to:email, subject: "Event Created", html:"Email Sent"})
        }catch(err){
                logger.error(err) 
        }
    };
    
    static addAttendee = async (req:AuthRequest,  res:Response) => {
        const eventId = req.params.id;
        const attendee = this.eventRepository.addAttendee(eventId, req.user.id);

        res.status(201).json({success:true, data: attendee});
    }

    static getAttendees =async (req:AuthRequest,  res:Response) => {
        const evenId = req.params.id;
        const userId = req.user.id;
        const attendees = this.eventRepository.getAttendees(evenId, userId)
        res.status(200).json({success:true, data:attendees})
    }

    static getEvent =async (req:AuthRequest, res:Response) => {
        const event = await prisma.event.findFirst({
            where:{ 
                id: req.params.id,
                creatorId: req.user.id
            }, include:{
                _count: {select: {attendees: true}}
            }
        })

        if(!event) { throw new BadRequestError("No event with Id!") };
        res.status(200).json({success:true, data: event})
    }

    static udpateEvent = async (req:AuthRequest,  res:Response) => {
        const eventPayload = req.body;
        const eventId = req.params.id;
        
        eventPayload.date = new Date(eventPayload.date);
        eventPayload.totalCapacity = Number(eventPayload.totalCapacity);

        const event = await this.eventRepository.updateEvent(eventId, req.user.id, eventPayload)

        res.status(200).json({sucess:true, data:event});
    }
      
    static addImage = async (req: AuthRequest,  res: Response) => {
        const eventId = req.params.id;
        const filePath = req.file?.path || "";
        const event = await this.eventRepository.addImage(eventId, req.user.id, filePath)
        res.status(200).json({success:true, data:event})
    }
}


