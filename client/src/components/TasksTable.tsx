import type { Task } from "../services/api";

interface TasksTableProps {
  tasks: Task[];
}

export default function TasksTable({
  tasks,
}: TasksTableProps) {
  return (
    <section className="rounded-xl bg-white p-6 shadow transition-colors dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-semibold">
        Assigned Tasks
      </h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No assigned tasks were detected.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  Person
                </th>

                <th className="px-4 py-3 text-left font-semibold">
                  Task
                </th>

                <th className="px-4 py-3 text-left font-semibold">
                  Due Date
                </th>
              </tr>
            </thead>

            <tbody>
              {tasks.map(
                (task, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3">
                      {task.person ??
                        "Unassigned"}
                    </td>

                    <td className="px-4 py-3">
                      {task.task}
                    </td>

                    <td className="px-4 py-3">
                      {task.dueDate ??
                        "-"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
