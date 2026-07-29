interface SummaryCardProps {
  summary: string;
}

export default function SummaryCard({
  summary,
}: SummaryCardProps) {
  return (
    <section
      className="
        rounded-xl
        bg-white
        p-6
        shadow
        dark:bg-gray-800
      "
    >
      <h2 className="mb-4 text-2xl font-bold">
        Summary
      </h2>

      <p
        className="
          whitespace-pre-line
          text-gray-700
          dark:text-gray-200
        "
      >
        {summary}
      </p>
    </section>
  );
}
