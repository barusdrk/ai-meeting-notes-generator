import {useEffect,useState} from "react";
import api from "../services/api";

interface Subscription{
  plan:string;
  status:string;
}

export default function BillingPage(){

  const [
    subscription,
    setSubscription,
  ]=useState<Subscription|null>(null);


  useEffect(()=>{

    api.get("/billing")
      .then(response=>{
        setSubscription(
          response.data
        );
      });

  },[]);


  return(
    <main className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900 dark:text-white">

      <h1 className="mb-8 text-4xl font-bold">
        Billing
      </h1>


      <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">

        {subscription ? (
          <>
            <p>
              Plan:
              {" "}
              {subscription.plan}
            </p>

            <p>
              Status:
              {" "}
              {subscription.status}
            </p>
          </>
        ):(
          <p>
            No subscription found.
          </p>
        )}

      </div>

    </main>
  );
}
