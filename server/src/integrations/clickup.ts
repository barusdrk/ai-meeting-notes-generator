import axios from "axios";

interface ClickUpTask{
  title:string;
  description?:string;
}

export async function createClickUpTask(task:ClickUpTask){
  const token=process.env.CLICKUP_TOKEN;
  const listId=process.env.CLICKUP_LIST_ID;

  if(!token||!listId){
    throw new Error("ClickUp configuration missing.");
  }

  const response=await axios.post(
    `https://api.clickup.com/api/v2/list/${listId}/task`,
    {
      name:task.title,
      description:task.description||"",
    },
    {
      headers:{
        Authorization:token,
        "Content-Type":"application/json",
      },
    }
  );

  return response.data;
}
