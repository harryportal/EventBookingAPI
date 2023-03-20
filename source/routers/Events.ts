import Router from "express"
import EventController from "../controllers/Events";
import { protect } from "../middleware/auth";
import RequestValidator from "../middleware/validation";
import { AddEvent } from "../serializers/events";
import { multerUpload } from "../utils/multer";

const eventRouter = Router();

eventRouter.post("/", protect, RequestValidator.validate(AddEvent),EventController.createEvent);
eventRouter.post("/:id/attendees", protect, EventController.addAttendee);
eventRouter.get('/:id/attendees', protect, EventController.getAttendees);
eventRouter.put("/:id", protect, EventController.udpateEvent);
eventRouter.post("/:id/image", protect, multerUpload.single("image"), EventController.addImage)
eventRouter.get("/:id", protect, EventController.getEvent)

export default eventRouter;