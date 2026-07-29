interface AnalyticsChartProps{
  title:string;
  data:{
    label:string;
    value:number;
  }[];
}

export default function AnalyticsChart({
  title,
  data,
}:AnalyticsChartProps){

  const max=
    Math.max(
      ...data.map(
        item=>item.value
      ),
      1
    );

  return(
    <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800 dark:text-white">
      <h2 className="mb-6 text-xl font-bold">
        {title}
      </h2>

      <div className="space-y-4">
        {data.map(item=>(
          <div key={item.label}>
            <div className="mb-1 flex justify-between">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>

            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700">
              <div
                className="h-4 rounded bg-blue-600"
                style={{
                  width:
                    `${(
                      item.value/max
                    )*100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
