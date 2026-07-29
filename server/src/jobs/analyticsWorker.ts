import {Worker} from "bullmq";
import Organization from "../models/Organization.js";
import Report from "../models/Report.js";
import {getOrganizationAnalytics} from "../services/analytics.js";

export const analyticsWorker=
new Worker(
  "analytics",
  async (job: any)=>{
    const organizations=
      await Organization.find();

    for(const organization of organizations){

      const analytics=
        await getOrganizationAnalytics(
          organization._id.toString()
        );

      await Report.create({
        organizationId:
          organization._id,
        type:"monthly",
        data:{
          users:
            analytics.users,
          meetings:
            analytics.meetings,
          completedTasks:
            analytics.completedTasks,
          pendingTasks:
            analytics.tasks-
            analytics.completedTasks,
          overdueTasks:
            analytics.overdueTasks,
          completionRate:
            analytics.completionRate,
        },
      });
    }
  },
  {
    connection:{
      url:process.env.REDIS_URL,
    },
  }
);
