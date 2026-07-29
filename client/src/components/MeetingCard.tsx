import { Link } from "react-router-dom";

interface MeetingCardProps{
  id:string;
  title:string;
  createdAt:string;
  summary:string[];
}

export default function MeetingCard({id,title,createdAt,summary}:MeetingCardProps){
  return(
    <Link to={`/meetings/${id}`} className="block rounded-xl bg-white p-6 shadow transition hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
        {new Date(createdAt).toLocaleDateString()}
      </p>
      <ul className="mt-4 list-disc pl-5">
        {summary.slice(0,3).map(item=><li key={item}>{item}</li>)}
      </ul>
    </Link>
  );
}
