import Router from "express"
import EventController from "../controllers/Events";
import { protect } from "../middleware/auth";
import RequestValidator from "../middleware/validation";
import { AddEvent, AddAttendee } from "../serializers/events";
import { multerUpload } from "../utils/multer";

const eventRouter = Router();

eventRouter.post("/", protect, RequestValidator.validate(AddEvent), multerUpload.single("image"), EventController.createEvent);
eventRouter.post("/:id/attendees", protect, RequestValidator.validate(AddAttendee), EventController.addAttendee);
eventRouter.get('/:id', protect, EventController.getAttendees);

export default eventRouter;