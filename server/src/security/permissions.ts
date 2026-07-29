export type Permission=
  | "organization.read"
  | "organization.update"
  | "member.invite"
  | "member.remove"
  | "meeting.read"
  | "meeting.delete"
  | "task.create"
  | "task.update"
  | "billing.manage"
  | "analytics.read";


export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner:[
    "organization.read",
    "organization.update",
    "member.invite",
    "member.remove",
    "meeting.read",
    "meeting.delete",
    "task.create",
    "task.update",
    "billing.manage",
    "analytics.read",
  ],

  admin:[
    "organization.read",
    "member.invite",
    "meeting.read",
    "task.create",
    "task.update",
    "analytics.read",
  ],

  member:[
    "meeting.read",
    "task.create",
    "task.update",
  ],

} satisfies Record<string,Permission[]>;


export function hasPermission(
  role:string,
  permission:Permission | string
){

  const permissions=
    ROLE_PERMISSIONS[
      role as keyof typeof ROLE_PERMISSIONS
    ] || [];

  return permissions.includes(
    permission as Permission
  );
}


export function requirePermission(
  role:string,
  permission:Permission | string
){

  if(
    !hasPermission(
      role,
      permission
    )
  ){
    throw new Error(
      "Permission denied."
    );
  }

  return true;
}
