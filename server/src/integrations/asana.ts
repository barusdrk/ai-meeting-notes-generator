import axios from "axios";

interface AsanaTask{
  title:string;
  description?:string;
}

function getConfig(){
  const token=process.env.ASANA_TOKEN;
  const projectId=process.env.ASANA_PROJECT_ID;

  if(!token||!projectId){
    throw new Error(
      "Asana configuration is not complete."
    );
  }

  return{token,projectId};
}

export async function createAsanaTask(
  task:AsanaTask
){
  const{token,projectId}=getConfig();

  const response=await axios.post(
    "https://app.asana.com/api/1.0/tasks",
    {
      data:{
        name:task.title,
        notes:task.description??"",
        projects:[projectId],
      },
    },
    {
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"application/json",
      },
    }
  );

  return response.data;
}
