interface Task {
  task: string;
  person: string | null;
  dueDate: string | null;
}

interface TasksTableProps {
  tasks: Task[];
}

export default function TasksTable({
  tasks,
}: TasksTableProps) {
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
        Tasks
      </h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No tasks detected.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="
              w-full
              border-collapse
              text-left
            "
          >
            <thead>
              <tr
                className="
                  border-b
                  dark:border-gray-700
                "
              >
                <th className="p-3">
                  Task
                </th>

                <th className="p-3">
                  Owner
                </th>

                <th className="p-3">
                  Due Date
                </th>
              </tr>
            </thead>

            <tbody>
              {tasks.map(
                (task, index) => (
                  <tr
                    key={index}
                    className="
                      border-b
                      dark:border-gray-700
                    "
                  >
                    <td className="p-3">
                      {task.task}
                    </td>

                    <td className="p-3">
                      {task.person || "-"}
                    </td>

                    <td className="p-3">
                      {task.dueDate || "-"}
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
