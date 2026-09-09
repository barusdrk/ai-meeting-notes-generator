import {Types} from "mongoose";
import Meeting from "../models/Meeting.js";

export async function getMeetingAnalytics(
  organizationId:string
){
  const organizationObjectId=
    new Types.ObjectId(organizationId);

  const total=
    await Meeting.countDocuments({
      organizationId:organizationObjectId,
    });

  const completed=
    await Meeting.countDocuments({
      organizationId:organizationObjectId,
      status:"completed",
    });

  const upcoming=
    await Meeting.countDocuments({
      organizationId:organizationObjectId,
      status:"scheduled",
    });

  const durations=
    await Meeting.aggregate([
      {
        $match:{
          organizationId:organizationObjectId,
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
      durations[0]?.averageDuration??0,
  };
}
