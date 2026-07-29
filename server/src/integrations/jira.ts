import axios from "axios";

interface JiraTask{
  title:string;
  description?:string;
}

export async function createJiraIssue(task:JiraTask){
  const domain=process.env.JIRA_DOMAIN;
  const email=process.env.JIRA_EMAIL;
  const token=process.env.JIRA_TOKEN;
  const projectKey=process.env.JIRA_PROJECT_KEY;

  if(!domain||!email||!token||!projectKey){
    throw new Error("Jira configuration missing.");
  }

  const response=await axios.post(
    `${domain}/rest/api/3/issue`,
    {
      fields:{
        project:{
          key:projectKey,
        },
        summary:task.title,
        description:task.description||"",
        issuetype:{
          name:"Task",
        },
      },
    },
    {
      auth:{
        username:email,
        password:token,
      },
      headers:{
        Accept:"application/json",
        "Content-Type":"application/json",
      },
    }
  );

  return response.data;
}
