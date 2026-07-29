interface CalendarEventInput {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  userId: string;
}


export async function createCalendarEvent(
  data: CalendarEventInput
) {
  console.log(
    "Creating calendar event:",
    {
      title: data.title,
      start: data.start,
      end: data.end,
    }
  );

  return {
    id: crypto.randomUUID(),
    title: data.title,
    start: data.start,
    end: data.end,
    status: "created",
  };
}


export async function createFollowUpEvent(
  title: string,
  date: Date,
  userId: string
) {
  return createCalendarEvent({
    userId,
    title,
    start: date,
    end: new Date(
      date.getTime() + 60 * 60 * 1000
    ),
  });
}
