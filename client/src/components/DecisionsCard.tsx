interface DecisionsCardProps {
  decisions: string[];
}

export default function DecisionsCard({
  decisions,
}: DecisionsCardProps) {
  if (!decisions.length) {
    return null;
  }

  return (
    <section className="text-gray-700 dark:text-gray-200">
      <h2 className="mb-4 text-xl font-bold">
        Decisions
      </h2>

      <ul className="list-disc space-y-2 pl-6 text-gray-700">
        {decisions.map((decision, index) => (
          <li key={index}>{decision}</li>
        ))}
      </ul>
    </section>
  );
}
