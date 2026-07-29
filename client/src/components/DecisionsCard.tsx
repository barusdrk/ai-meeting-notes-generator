interface DecisionsCardProps {
  decisions: string[];
}

export default function DecisionsCard({
  decisions,
}: DecisionsCardProps) {
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
        Decisions
      </h2>


      {decisions.length === 0 ? (
        <p className="text-gray-500">
          No decisions detected.
        </p>
      ) : (
        <ul
          className="
            list-disc
            space-y-2
            pl-6
          "
        >
          {decisions.map(
            (decision, index) => (
              <li key={index}>
                {decision}
              </li>
            )
          )}
        </ul>
      )}

    </section>
  );
}
