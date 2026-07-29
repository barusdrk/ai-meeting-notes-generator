import Meeting from "../models/Meeting.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

export async function getOrganizationAnalytics(
  organizationId:string
){

  const [
    users,
    meetings,
    tasks,
    completedTasks,
    overdueTasks,
  ]=await Promise.all([

    User.countDocuments({
      organizationId,
    }),

    Meeting.countDocuments({
      organizationId,
    }),

    Task.countDocuments({
      organizationId,
    }),

    Task.countDocuments({
      organizationId,
      status:"completed",
    }),

    Task.countDocuments({
      organizationId,
      status:{
        $ne:"completed",
      },
      dueDate:{
        $lt:new Date(),
      },
    }),

  ]);

  return {
    users,
    meetings,
    tasks,
    completedTasks,
    overdueTasks,
    completionRate:
      tasks===0
        ? 0
        : Math.round(
            completedTasks/tasks*100
          ),
  };
}


export async function getUserActivity(
  organizationId:string
){

  return Meeting.aggregate([
    {
      $match:{
        organizationId,
      },
    },
    {
      $group:{
        _id:"$userId",
        meetings:{
          $sum:1,
        },
      },
    },
    {
      $sort:{
        meetings:-1,
      },
    },
  ]);
}
