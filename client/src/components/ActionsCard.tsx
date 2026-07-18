interface ActionsCardProps {
  actionItems: string[];
}

export default function ActionsCard({
  actionItems,
}: ActionsCardProps) {
  return (
    <section className="rounded-xl bg-white p-6 shadow transition-colors dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-semibold">
        Action Items
      </h2>

      {actionItems.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No action items were identified.
        </p>
      ) : (
        <ul className="space-y-3">
          {actionItems.map(
            (item, index) => (
              <li
                key={index}
                className="flex items-start gap-3"
              >
                <span className="mt-1 text-green-600">
                  ✓
                </span>

                <span className="text-gray-700 dark:text-gray-200">
                  {item}
                </span>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}
