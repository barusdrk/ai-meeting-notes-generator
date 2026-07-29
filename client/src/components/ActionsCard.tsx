interface ActionsCardProps {
  actionItems: string[];
}

export default function ActionsCard({
  actionItems,
}: ActionsCardProps) {
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
        Action Items
      </h2>

      {actionItems.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No action items detected.
        </p>
      ) : (
        <ul
          className="
            list-disc
            space-y-2
            pl-6
            text-gray-700
            dark:text-gray-200
          "
        >
          {actionItems.map(
            (item, index) => (
              <li key={index}>
                {item}
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}
