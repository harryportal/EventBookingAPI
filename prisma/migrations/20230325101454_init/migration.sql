-- DropForeignKey
ALTER TABLE "AttendeeToEvent" DROP CONSTRAINT "AttendeeToEvent_attendeeId_fkey";

-- DropForeignKey
ALTER TABLE "AttendeeToEvent" DROP CONSTRAINT "AttendeeToEvent_eventId_fkey";

-- AddForeignKey
ALTER TABLE "AttendeeToEvent" ADD CONSTRAINT "AttendeeToEvent_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendeeToEvent" ADD CONSTRAINT "AttendeeToEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
