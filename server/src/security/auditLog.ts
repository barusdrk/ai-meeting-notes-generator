import AuditLog from "../models/AuditLog.js";


export async function createAuditLog(
  data:{
    organizationId:string;
    userId:string;
    action:string;
    resource:string;
    resourceId?:string;
    metadata?:Record<string,unknown>;
    ip?:string;
  }
){

  return AuditLog.create({
    organizationId:
      data.organizationId,

    userId:
      data.userId,

    action:
      data.action,

    resource:
      data.resource,

    resourceId:
      data.resourceId,

    metadata:
      data.metadata,

    ip:
      data.ip,
  });
}


export async function getAuditLogs(
  organizationId:string,
  limit:number=50
){

  return AuditLog.find({
    organizationId,
  })
  .sort({
    createdAt:-1,
  })
  .limit(limit);
}


export async function logUserAction(
  req:any,
  action:string,
  resource:string
){

  return createAuditLog({
    organizationId:
      req.organizationId,

    userId:
      req.userId,

    action,

    resource,

    ip:
      req.ip,
  });
}
