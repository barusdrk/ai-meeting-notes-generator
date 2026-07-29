import api from "../services/api";

const plans=[
  {
    name:"Free",
    price:"$0",
    plan:"free",
  },
  {
    name:"Pro",
    price:"$19/month",
    plan:"pro",
  },
  {
    name:"Enterprise",
    price:"Custom",
    plan:"enterprise",
  },
];


export default function PricingPage(){

  async function subscribe(plan:string){

    await api.post(
      "/billing/subscribe",
      {
        plan,
        priceId:
          "stripe_price_id",
      }
    );

    alert(
      "Subscription started"
    );
  }


  return(
    <main className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900 dark:text-white">

      <h1 className="mb-8 text-4xl font-bold">
        Pricing
      </h1>

      <div className="grid gap-6 md:grid-cols-3">

        {plans.map(item=>(

          <div
            key={item.plan}
            className="rounded-xl bg-white p-6 shadow dark:bg-gray-800"
          >

            <h2 className="text-2xl font-bold">
              {item.name}
            </h2>

            <p className="my-5 text-3xl">
              {item.price}
            </p>

            <button
              onClick={()=>
                subscribe(item.plan)
              }
              className="rounded bg-blue-600 px-5 py-2 text-white"
            >
              Choose
            </button>

          </div>

        ))}

      </div>

    </main>
  );
}
