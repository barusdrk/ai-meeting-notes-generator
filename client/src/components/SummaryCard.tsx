interface SummaryCardProps {
  summary: string;
}

export default function SummaryCard({
  summary,
}: SummaryCardProps) {
  if (!summary) {
    return null;
  }

  return (
    <section className="text-gray-700 dark:text-gray-200">
      <h2 className="mb-4 text-xl font-bold">
        Meeting Summary
      </h2>

      <p className="whitespace-pre-wrap leading-7 text-gray-700">
        {summary}
      </p>
    </section>
  );
}
