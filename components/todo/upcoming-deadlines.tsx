import { Todo } from "@/types/todo";
import { Clock } from "lucide-react";

export function UpcomingDeadlines({ todos }: { todos: Todo[] }) {
  const activeTodosWithDeadline = todos.filter(t => !t.completed && t.dueDate);
  
  activeTodosWithDeadline.sort((a, b) => {
    return a.dueDate!.toMillis() - b.dueDate!.toMillis();
  });

  const getDayCategory = (dueDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const targetDate = new Date(dueDate);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate.getTime() === today.getTime()) return "Today";
    if (targetDate.getTime() === tomorrow.getTime()) return "Tomorrow";
    if (targetDate < today) return "Overdue";
    return targetDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const grouped: Record<string, Todo[]> = {};
  activeTodosWithDeadline.forEach(t => {
    const cat = getDayCategory(t.dueDate!.toDate());
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(t);
  });

  return (
    <div className="clean-panel p-6 rounded-md">
      <h2 className="text-sm font-semibold text-[var(--color-primary)] mb-6">Upcoming Deadlines</h2>

      {activeTodosWithDeadline.length === 0 ? (
        <p className="text-[var(--color-muted)] text-xs">No upcoming deadlines.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).slice(0, 4).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3 pb-1 border-b border-[var(--color-border)]">
                {category}
              </h3>
              <div className="flex flex-col gap-3">
                {items.slice(0, 3).map(todo => (
                  <div key={todo.id} className="cursor-pointer group">
                    <p className="font-medium text-xs text-[var(--color-primary)] group-hover:text-black transition-colors mb-1 truncate">
                      {todo.title}
                    </p>
                    <div className="flex gap-2 text-[10px]">
                      {todo.dueTime && (
                        <span className="flex items-center gap-1 text-[var(--color-muted)]">
                          <Clock size={10} /> {todo.dueTime}
                        </span>
                      )}
                      <span className={`px-1.5 py-0.5 rounded-sm ${
                        todo.priority === 'high' ? 'bg-red-50 text-red-600' :
                        todo.priority === 'medium' ? 'bg-orange-50 text-orange-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {todo.priority}
                      </span>
                    </div>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-[10px] text-[var(--color-muted)]">
                    + {items.length - 3} more
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
