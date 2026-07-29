import axios from "axios";

interface TrelloTask{
  title:string;
  description?:string;
}

export async function createTrelloCard(task:TrelloTask){
  const key=process.env.TRELLO_KEY;
  const token=process.env.TRELLO_TOKEN;
  const listId=process.env.TRELLO_LIST_ID;

  if(!key||!token||!listId){
    throw new Error("Trello configuration missing.");
  }

  const response=await axios.post(
    "https://api.trello.com/1/cards",
    {
      idList:listId,
      name:task.title,
      desc:task.description||"",
      key,
      token,
    }
  );

  return response.data;
}
