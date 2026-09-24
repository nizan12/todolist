import { Todo } from "../../types/todo";
import { CheckCircle2, Clock, AlertCircle, ListTodo, Zap } from "lucide-react";

export function TodoStatistics({ todos }: { todos: Todo[] }) {
  const totalTasks = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = totalTasks - completed;
  const highPriority = todos.filter(t => t.priority === 'high' && !t.completed).length;
  
  // Basic overdue detection (frontend only for display purposes)
  const overdue = todos.filter(t => {
    if (t.completed || !t.dueDate) return false;
    const now = new Date();
    
    // Combine dueDate and dueTime
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
    { label: "Total Tasks", value: totalTasks, icon: ListTodo, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "text-[var(--color-success)]", bg: "bg-green-50" },
    { label: "Pending", value: pending, icon: Clock, color: "text-[var(--color-warning)]", bg: "bg-orange-50" },
    { label: "High Priority", value: highPriority, icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Overdue", value: overdue, icon: AlertCircle, color: "text-[var(--color-danger)]", bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-[var(--color-border)] flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted)] font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-[var(--color-primary)] leading-tight">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
