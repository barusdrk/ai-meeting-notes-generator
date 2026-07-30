import axios from "axios";

interface ClickUpTask{
  title:string;
  description?:string;
}

function getConfig(){
  const token=process.env.CLICKUP_TOKEN;
  const listId=process.env.CLICKUP_LIST_ID;

  if(!token||!listId){
    throw new Error(
      "ClickUp configuration is not complete."
    );
  }

  return{token,listId};
}

export async function createClickUpTask(
  task:ClickUpTask
){
  const{token,listId}=getConfig();

  const response=await axios.post(
    `https://api.clickup.com/api/v2/list/${listId}/task`,
    {
      name:task.title,
      description:task.description??"",
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
