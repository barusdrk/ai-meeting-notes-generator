import {getMeetingAnalytics} from "./meetings.js";
import {getProductivityAnalytics} from "./productivity.js";
import User from "../models/User.js";
import Team from "../models/Team.js";

export async function generateOrganizationReport(
  organizationId:string
){
  const [
    meetings,
    productivity,
    users,
    teams,
  ]=await Promise.all([
    getMeetingAnalytics(
      organizationId
    ),

    getProductivityAnalytics(
      organizationId
    ),

    User.countDocuments({
      organizationId,
    }),

    Team.countDocuments({
      organizationId,
    }),
  ]);

  return {
    organizationId,
    generatedAt:new Date(),
    users,
    teams,
    meetings,
    productivity,
  };
}
