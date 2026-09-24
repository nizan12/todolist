import { Todo } from "@/types/todo";
import { Trash2, Pencil, Calendar, Bell, Clock } from "lucide-react";
import { useTodos } from "@/hooks/use-todos";
import { useState } from "react";
import { TodoEditModal } from "./todo-edit-modal";

export function TodoItem({ todo }: { todo: Todo }) {
  const { toggle, remove } = useTodos();
  const [isEditing, setIsEditing] = useState(false);

  const isOverdue = (() => {
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
  })();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <div className={`clean-panel p-4 rounded-md transition-opacity ${
        todo.completed ? "opacity-60 bg-gray-50" : ""
      }`}>
        <div className="flex items-start gap-4">
          <div className="pt-0.5">
            <input 
              type="checkbox"
              className="minimal-checkbox"
              checked={todo.completed}
              onChange={() => toggle(todo.id, todo.completed)}
            />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`font-medium text-sm ${
                todo.completed ? "text-gray-500 line-through" : "text-[var(--color-primary)]"
              }`}>
                {todo.title}
              </h3>
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                todo.priority === 'high' ? 'border-red-200 text-red-600 bg-red-50' :
                todo.priority === 'medium' ? 'border-orange-200 text-orange-600 bg-orange-50' :
                'border-gray-200 text-gray-600 bg-gray-50'
              }`}>
                {todo.priority}
              </span>
              {isOverdue && !todo.completed && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-red-200 text-red-600 bg-red-50">
                  Overdue
                </span>
              )}
            </div>
            
            {todo.description && (
              <p className="text-xs text-[var(--color-muted)] mb-3 line-clamp-2">
                {todo.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-2">
              {todo.dueDate && (
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-muted)]">
                  <Calendar size={12} />
                  <span>{formatDate(todo.dueDate.toDate())}</span>
                  {todo.dueTime && (
                    <>
                      <Clock size={12} className="ml-1" />
                      <span>{todo.dueTime}</span>
                    </>
                  )}
                </div>
              )}
              
              {todo.reminder?.enabled && todo.reminder.reminders.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-muted)]">
                  <Bell size={12} />
                  <span>
                    {todo.reminder.reminders[0].minutesBefore === 0 ? "At deadline" : 
                     todo.reminder.reminders[0].minutesBefore < 60 ? `${todo.reminder.reminders[0].minutesBefore}m before` :
                     todo.reminder.reminders[0].minutesBefore === 60 ? "1h before" :
                     todo.reminder.reminders[0].minutesBefore === 1440 ? "1d before" : "Reminder set"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-400 hover:text-[var(--color-primary)] rounded transition-colors" 
              aria-label="Edit"
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this task?")) {
                  remove(todo.id);
                }
              }}
              className="p-1.5 text-gray-400 hover:text-[var(--color-danger)] rounded transition-colors" 
              aria-label="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
      {isEditing && (
        <TodoEditModal todo={todo} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}
