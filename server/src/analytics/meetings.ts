import Meeting from "../models/Meeting.js";

export async function getMeetingAnalytics(
  organizationId:string
){
  const total=
    await Meeting.countDocuments({
      organizationId,
    });

  const completed=
    await Meeting.countDocuments({
      organizationId,
      status:"completed",
    });

  const upcoming=
    await Meeting.countDocuments({
      organizationId,
      status:"scheduled",
    });

  const durations=
    await Meeting.aggregate([
      {
        $match:{
          organizationId,
        },
      },
      {
        $group:{
          _id:null,
          averageDuration:{
            $avg:"$duration",
          },
        },
      },
    ]);

  return {
    totalMeetings:total,
    completedMeetings:completed,
    upcomingMeetings:upcoming,
    averageDuration:
      durations[0]?.averageDuration||0,
  };
}
