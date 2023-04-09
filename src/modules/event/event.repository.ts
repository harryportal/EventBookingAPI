import { BadRequestError, NotAuthorizedError } from "../../common/error";
import { prisma } from "../../utils/db/prisma";
import Cloudinary from "../cloud/cloudinary.service";
import IEvent from "./event.interface";


export default class EventRepository{
    private event;
    private attendee;
    private cloudinaryService = new Cloudinary();
    constructor(){
        this.event = prisma.event; 
        this.attendee = prisma.attendee;
    }

    public addEvent = async(eventData:IEvent, userId:string)=>{
        let {name, description, date, startTime, endTime,  location, totalCapacity, timezone} = eventData;
        const event = await this.event.create({
            data: {
                name, description, date, startTime, endTime, location, totalCapacity,timezone,
                creator: {
                    connect: {id: userId}
                }
            }   
        });
        return event;
    }

    private createAttendee = async(userId:string)=>{
        // check if user has registered for an event before and create attendee if false
        let attendee = await this.attendee.findUnique({
            where: {userId: userId}
        })

        if(!attendee){
            attendee = await prisma.attendee.create({
                data:{
                    user: {connect: {id: userId}}
                }
            })
        }
        return attendee;
    }

    private getEvent = async(eventId)=>{
        const event = await this.event.findUnique({
            where:{ id: eventId }  });
           
        if(!event) { throw new BadRequestError("No event with Id!") }
        return event;
    }

    public addAttendee = async(eventId:string, userId:string)=>{
        const attendee = await this.createAttendee(userId);
        const event =  await this.getEvent(eventId);
        
        // Check if event is at capacity before adding the new attendee
        if(event.capacity == event.totalCapacity){ throw new BadRequestError("Event at Capacity") }

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
          })]);
        
        const [newAttendee, _] = addAttendee;
        return newAttendee;
    }

    public getAttendees = async(eventId:string, userId:string)=>{
        await this.getEvent(eventId);  // checks if an event and throw an error
        
        const eventAttendees = await this.event.findFirst({
            where:{ 
                id: eventId,
                creatorId: userId
            },include:{
                attendees: {select:{ attendee : {select: {user: {
                    select:{firstname: true, lastname: true, email: true, contact: true}
                }}} }}
            }
        });

        return eventAttendees;
    }

    private verifyEvent = async(eventId:string, userId:string)=>{
        // check if event belongs to the current signed in user.
        const event = await this.getEvent(eventId);
        if(event.creatorId != userId) throw new NotAuthorizedError();
    }

    public updateEvent = async(eventId:string, userId:string, eventData:IEvent)=>{
        await this.verifyEvent(eventId, userId);
        let {name, description, date, startTime, endTime,  location, totalCapacity, timezone} = eventData;
        const updatedEvent = await this.event.update({
            where:{ id: eventId },
            data:{
                name, description, date, startTime, endTime, location, totalCapacity, timezone
            }});
        return updatedEvent;
    }

    public addImage = async(eventId:string, userId:string, filePath: string | null)=>{
        await this.verifyEvent(eventId, userId);
        if (!filePath) { throw new BadRequestError("No file provided")}
        const { imageUrl } = await this.cloudinaryService.uploadImage(filePath); 

        //set the image for the current event
        const event = await prisma.event.update({
            where:{ id: eventId }, 
            data:{ imageUrl }
        }); 
        return event;
     }

}