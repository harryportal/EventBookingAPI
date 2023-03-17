-- CreateTable
CREATE TABLE "AttendeeToEvent" (
    "id" TEXT NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "AttendeeToEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AttendeeToEvent" ADD CONSTRAINT "AttendeeToEvent_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendeeToEvent" ADD CONSTRAINT "AttendeeToEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
