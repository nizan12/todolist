import { Todo } from "@/types/todo";

export function TodoStatistics({ todos }: { todos: Todo[] }) {
  const totalTasks = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = totalTasks - completed;
  const highPriority = todos.filter(t => t.priority === 'high' && !t.completed).length;
  
  const overdue = todos.filter(t => {
    if (t.completed || !t.dueDate) return false;
    const now = new Date();
    const dueDateTime = t.dueDate.toDate();
    if (t.dueTime) {
      const [hours, minutes] = t.dueTime.split(':');
      dueDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      dueDateTime.setHours(23, 59, 59, 999);
    }
    return now > dueDateTime;
  }).length;

  const statCards = [
    { label: "Total Tasks", value: totalTasks },
    { label: "Completed", value: completed },
    { label: "Pending", value: pending },
    { label: "High Priority", value: highPriority },
    { label: "Overdue", value: overdue },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statCards.map((stat, idx) => (
        <div key={idx} className="clean-panel p-4 rounded-md flex flex-col justify-center">
          <p className="text-2xl font-semibold text-[var(--color-primary)]">{stat.value}</p>
          <p className="text-xs text-[var(--color-muted)] mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
