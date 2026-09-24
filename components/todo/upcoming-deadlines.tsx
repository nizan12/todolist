import { Todo } from "../../types/todo";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

export function UpcomingDeadlines({ todos }: { todos: Todo[] }) {
  const activeTodosWithDeadline = todos.filter(t => !t.completed && t.dueDate);
  
  // Sort by closest deadline
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

  // Group by category
  const grouped: Record<string, Todo[]> = {};
  activeTodosWithDeadline.forEach(t => {
    const cat = getDayCategory(t.dueDate!.toDate());
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(t);
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-border)] h-full sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <CalendarIcon size={20} />
        </div>
        <h2 className="text-xl font-bold text-[var(--color-primary)]">Upcoming Deadlines</h2>
      </div>

      {activeTodosWithDeadline.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[var(--color-muted)] text-sm">No upcoming deadlines.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).slice(0, 4).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
                {category}
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{items.length}</span>
              </h3>
              <div className="flex flex-col gap-3">
                {items.slice(0, 3).map(todo => (
                  <div key={todo.id} className="group cursor-pointer">
                    <p className="font-medium text-sm text-[var(--color-primary)] truncate group-hover:text-blue-600 transition-colors mb-1">
                      {todo.title}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {todo.dueTime && (
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock size={12} /> {todo.dueTime}
                        </span>
                      )}
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        todo.priority === 'high' ? 'bg-red-50 text-red-600' :
                        todo.priority === 'medium' ? 'bg-orange-50 text-orange-600' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {todo.priority}
                      </span>
                    </div>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-blue-600 font-medium cursor-pointer">+ {items.length - 3} more</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
