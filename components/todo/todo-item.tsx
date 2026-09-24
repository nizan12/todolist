import { Todo } from "../../types/todo";
import { Check, Trash2, Pencil, Calendar, Bell, Clock } from "lucide-react";
import { useTodos } from "../../hooks/use-todos";
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

  const priorityColor = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-orange-100 text-orange-700",
    high: "bg-red-100 text-red-700"
  }[todo.priority];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <div className={`p-5 rounded-2xl border transition-all ${
        todo.completed 
          ? "bg-gray-50 border-gray-100 opacity-75" 
          : isOverdue 
            ? "bg-white border-red-200 shadow-sm"
            : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
      }`}>
        <div className="flex items-start gap-4">
          <button
            onClick={() => toggle(todo.id, todo.completed)}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
              todo.completed 
                ? "bg-[var(--color-success)] border-[var(--color-success)]" 
                : "border-gray-300 hover:border-[var(--color-success)]"
            }`}
          >
            {todo.completed && <Check size={14} className="text-white" />}
          </button>

          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className={`font-semibold text-lg truncate ${
                todo.completed ? "text-gray-400 line-through" : "text-[var(--color-primary)]"
              }`}>
                {todo.title}
              </h3>
              <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${priorityColor}`}>
                {todo.priority}
              </span>
            </div>
            
            {todo.description && (
              <p className={`text-sm mb-3 line-clamp-2 ${todo.completed ? "text-gray-400" : "text-gray-600"}`}>
                {todo.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3">
              {todo.dueDate && (
                <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue && !todo.completed ? 'text-[var(--color-danger)]' : 'text-gray-500'}`}>
                  <Calendar size={14} />
                  <span>{formatDate(todo.dueDate.toDate())}</span>
                  {todo.dueTime && (
                    <>
                      <Clock size={14} className="ml-1" />
                      <span>{todo.dueTime}</span>
                    </>
                  )}
                  {isOverdue && !todo.completed && <span className="ml-1 uppercase text-[10px] bg-red-100 px-1.5 py-0.5 rounded font-bold">Overdue</span>}
                </div>
              )}
              
              {todo.reminder?.enabled && todo.reminder.reminders.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600">
                  <Bell size={14} />
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

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 flex-shrink-0">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" aria-label="Edit todo"
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this task?\nThis action cannot be undone.")) {
                  remove(todo.id);
                }
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" aria-label="Delete todo"
            >
              <Trash2 size={18} />
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
