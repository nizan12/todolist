import { Todo } from "@/types/todo";
import { TodoItem } from "./todo-item";

export function TodoList({ todos, loading, filterStatus, filterPriority, sortBy }: any) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-md w-full"></div>
        ))}
      </div>
    );
  }

  const isOverdue = (todo: Todo) => {
    if (todo.completed || !todo.dueDate) return false;
    const now = new Date();
    const dueDateTime = todo.dueDate.toDate();
    if (todo.dueTime) {
      const [hours, minutes] = todo.dueTime.split(':');
      dueDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      dueDateTime.setHours(23, 59, 59, 999);
    }
    return now > dueDateTime;
  };

  let filtered = todos.filter((t: Todo) => {
    if (filterStatus === 'Active' && (t.completed || isOverdue(t))) return false;
    if (filterStatus === 'Completed' && !t.completed) return false;
    if (filterStatus === 'Overdue' && !isOverdue(t)) return false;
    if (filterPriority !== 'All Priority' && t.priority.toLowerCase() !== filterPriority.toLowerCase()) return false;
    return true;
  });

  filtered.sort((a: Todo, b: Todo) => {
    if (sortBy === 'Newest') return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
    if (sortBy === 'Oldest') return (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0);
    if (sortBy === 'Priority') {
      const p = { high: 3, medium: 2, low: 1 };
      return p[b.priority] - p[a.priority];
    }
    if (sortBy === 'Due Date') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.toMillis() - b.dueDate.toMillis();
    }
    return 0;
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-[var(--color-primary)] mb-1">
          {todos.length === 0 ? "No tasks yet" : "No matches found"}
        </p>
        <p className="text-xs text-[var(--color-muted)]">
          {todos.length === 0 
            ? "Create a task above to get started." 
            : "Adjust your filters to see more results."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 group">
      {filtered.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
