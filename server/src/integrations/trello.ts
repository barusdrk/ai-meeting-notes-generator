import axios from "axios";

interface TrelloTask{
  title:string;
  description?:string;
}

function getConfig(){
  const key=process.env.TRELLO_KEY;
  const token=process.env.TRELLO_TOKEN;
  const listId=process.env.TRELLO_LIST_ID;

  if(!key||!token||!listId){
    throw new Error(
      "Trello configuration is not complete."
    );
  }

  return{
    key,
    token,
    listId,
  };
}

export async function createTrelloCard(
  task:TrelloTask
){
  const{
    key,
    token,
    listId,
  }=getConfig();

  const response=await axios.post(
    "https://api.trello.com/1/cards",
    {
      idList:listId,
      name:task.title,
      desc:task.description??"",
      key,
      token,
    }
  );

  return response.data;
}
