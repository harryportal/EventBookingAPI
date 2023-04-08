import { Router } from "express";
import EventController from "./event.contoller";
import { protect } from "../../common/auth";
import RequestValidator from "../../common/validation";
import { AddEvent } from "./event.validation";
import { multerUpload } from "../../utils/fileStorage/multer";

const eventRouter = Router();

eventRouter.post("/", protect, RequestValidator.validate(AddEvent),EventController.createEvent);
eventRouter.post("/:id/attendees", protect, EventController.addAttendee);
eventRouter.get('/:id/attendees', protect, EventController.getAttendees);
eventRouter.put("/:id", protect, EventController.udpateEvent);
eventRouter.post("/:id/image", protect, multerUpload.single("image"), EventController.addImage)
eventRouter.get("/:id", protect, EventController.getEvent)

export default eventRouter;