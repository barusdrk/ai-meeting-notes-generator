import axios from "axios";

interface NotionTask{
  title:string;
  description?:string;
}

function getConfig(){
  const token=
    process.env.NOTION_TOKEN;

  const databaseId=
    process.env.NOTION_DATABASE_ID;

  if(!token||!databaseId){
    throw new Error(
      "Notion configuration is not complete."
    );
  }

  return{
    token,
    databaseId,
  };
}

export async function createNotionTask(
  task:NotionTask
){
  const{
    token,
    databaseId,
  }=getConfig();

  const response=await axios.post(
    "https://api.notion.com/v1/pages",
    {
      parent:{
        database_id:databaseId,
      },
      properties:{
        Name:{
          title:[
            {
              text:{
                content:task.title,
              },
            },
          ],
        },
      },
      children:task.description?[
        {
          object:"block",
          type:"paragraph",
          paragraph:{
            rich_text:[
              {
                type:"text",
                text:{
                  content:task.description,
                },
              },
            ],
          },
        },
      ]:[],
    },
    {
      headers:{
        Authorization:`Bearer ${token}`,
        "Notion-Version":"2022-06-28",
        "Content-Type":"application/json",
      },
    }
  );

  return response.data;
}
