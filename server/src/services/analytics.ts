import Meeting from "../models/Meeting.js";
import Task from "../models/Task.js";
import Organization from "../models/Organization.js";

export async function getOrganizationAnalytics(
  organizationId:string
){
  const organization=await Organization.findById(
    organizationId
  ).lean();

  const memberIds=
    organization?.members.map(
      member=>member.userId
    ) ?? [];

  const [
    meetings,
    tasks,
    completedTasks,
    overdueTasks,
  ]=await Promise.all([
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

  return{
    users:memberIds.length,
    meetings,
    tasks,
    completedTasks,
    overdueTasks,
    completionRate:
      tasks===0
        ?0
        :Math.round(
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
