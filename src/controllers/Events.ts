import {Response} from "express";
import { AuthRequest } from "../interfaces/userAuth";
import { prisma } from "../utils/db";
import { AuthError, BadRequestError, NotAuthorizedError, NotFoundError } from "../middleware/error";
import MailService from "../service/mailing";
import logger from "../utils/winston";
import cloudinaryInstance from "../service/cloudinary";




export default class EventController {

    static createEvent = async (req:AuthRequest,  res:Response) => {
        let {name, description, date, startTime, endTime,  location, totalCapacity} = req.body;
        date = new Date(date);
        totalCapacity = Number(totalCapacity);

        
        const event = await prisma.event.create({
            data: {
                name, description, date, startTime, endTime, location, totalCapacity,
                creator: {
                    connect: {id: req.user.id}
                }
            }   
        })

        // get current user email
        const { email } = await prisma.user.findUnique({
            where:{id: req.user.id},  select:{email:true}
        })

        // Work on templates later
        const mailing =  new MailService();
        try{
        mailing.sendMail(req.headers['X-Request-Id'], {to:email, subject: "Event Created", html:"Email Sent"})
        res.status(201).json({sucess:true, data:event});}
        catch(err){
            logger.error(err) }
        };


    static addAttendee = async (req:AuthRequest,  res:Response) => {
        const eventId = req.params.id;

        // check if the event exist
        const event = await prisma.event.findUnique({
            where:{ id: eventId }  });
           
        if(!event) { throw new BadRequestError("No event with Id!") }
        
        // Check if event is at capacity before adding the new attendee

        if(event.capacity == event.totalCapacity){ throw new BadRequestError("Event at Capacity") }

        // check if user has registered for an event before and create attendee if false
        let attendee = await prisma.attendee.findUnique({
            where: {userId: req.user.id}
        })

        if(!attendee){
            attendee = await prisma.attendee.create({
                data:{
                    user: {connect: {id: req.user.id}}
                }
            })
        }

        // add attendee to event and update the total number of attendees for the event
        const addAttendee = await prisma.$transaction([

            prisma.attendeeToEvent.create({
                data:{
                    attendee:{connect:{id: attendee.id}},
                    event:{connect:{id:event.id}}
                }
            }), 

            prisma.event.update({
            where: { id: eventId },
            data: { capacity: { increment: 1 } },
            include:{
                attendees: true
            }
          })

        ]);

        
        const [newAttendee, _] = addAttendee;
        res.status(201).json({success:true, data: newAttendee});
    }





    static getAttendees =async (req:AuthRequest,  res:Response) => {

        const eventAttendees = await prisma.event.findFirst({
            where:{ 
                id: req.params.id,
                creatorId: req.user.id
            },include:{
                attendees: {select:{ attendee : {select: {user: {
                    select:{firstname: true, lastname: true, email: true, contact: true}
                }}} }}
            }
        });

        if(!eventAttendees) { throw new BadRequestError("No event with Id!") };

        res.status(200).json({success:true, data:eventAttendees})
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

        // check if current event belongs to signed in User.
        let event = await prisma.event.findUnique({
            where:{
                id: req.params.id
            }
        })

        if(!event) throw new NotFoundError("No Event with Id Found!")
        if(event.creatorId != req.user.id) throw new NotAuthorizedError();

        let {name, description, date, startTime, endTime,  location, totalCapacity} = req.body;
        date = new Date(date);
        totalCapacity = Number(totalCapacity);

        event = await prisma.event.update({
            where:{
                id: req.user.id
            },
            data:{
                name, description, date, startTime, endTime, location, totalCapacity
            }
        })

        res.status(200).json({sucess:true, data:event});
    }
      


        static addImage = async (req: AuthRequest,  res: Response) => {

            // check if current event belongs to signed in User.
            let event = await prisma.event.findUnique({
                where:{
                    id: req.params.id
                }
            })

            if(!event) throw new NotFoundError("No Event with Id Found!")
            if(event.creatorId != req.user.id) throw new NotAuthorizedError();

            const localFilePath = req.file?.path || "";
        
            const { imageUrl } = await cloudinaryInstance.uploadImage(localFilePath); 
            
            //set the image for the current event
            event = await prisma.event.update({
                where:{
                    id: req.params.id,
                }, 
                data:{ imageUrl }
            })


            res.status(200).json({success:true, data:event})
            
        }
}


