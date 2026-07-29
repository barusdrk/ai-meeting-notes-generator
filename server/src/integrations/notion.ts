import axios from "axios";

interface NotionTask{
  title:string;
  description?:string;
}

export async function createNotionTask(task:NotionTask){
  const token=process.env.NOTION_TOKEN;
  const databaseId=process.env.NOTION_DATABASE_ID;

  if(!token||!databaseId){
    throw new Error("Notion configuration missing.");
  }

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
    },
    {
      headers:{
        Authorization:`Bearer ${token}`,
        "Notion-Version":"2022-06-28",
      },
    }
  );

  return response.data;
}
