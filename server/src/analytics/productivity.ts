import Task from "../models/Task.js";

export async function getProductivityAnalytics(
  organizationId:string
){
  const total=
    await Task.countDocuments({
      organizationId,
    });

  const completed=
    await Task.countDocuments({
      organizationId,
      status:"completed",
    });

  const pending=
    await Task.countDocuments({
      organizationId,
      status:"pending",
    });

  const overdue=
    await Task.countDocuments({
      organizationId,
      dueDate:{
        $lt:new Date(),
      },
      status:{
        $ne:"completed",
      },
    });

  return {
    totalTasks:total,
    completedTasks:completed,
    pendingTasks:pending,
    overdueTasks:overdue,
    completionRate:
      total===0
        ? 0
        : Math.round(
            (completed/total)*100
          ),
  };
}
