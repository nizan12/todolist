import { useState } from "react";
import { Todo } from "../../types/todo";
import { useTodos } from "../../hooks/use-todos";
import { X, Calendar, Clock, Bell, ChevronDown } from "lucide-react";
import { Timestamp } from "firebase/firestore";

export function TodoEditModal({ todo, onClose }: { todo: Todo; onClose: () => void }) {
  const { update } = useTodos();
  
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [priority, setPriority] = useState(todo.priority);
  
  // Format date for input type="date"
  const formatDateForInput = (timestamp?: Timestamp | null) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toISOString().split('T')[0];
  };

  const [dueDate, setDueDate] = useState(formatDateForInput(todo.dueDate));
  const [dueTime, setDueTime] = useState(todo.dueTime || "");
  
  const initialReminder = todo.reminder?.enabled && todo.reminder.reminders.length > 0 
    ? (todo.reminder.reminders[0].minutesBefore === 0 ? "At deadline" :
       todo.reminder.reminders[0].minutesBefore === 5 ? "5 minutes before" :
       todo.reminder.reminders[0].minutesBefore === 15 ? "15 minutes before" :
       todo.reminder.reminders[0].minutesBefore === 30 ? "30 minutes before" :
       todo.reminder.reminders[0].minutesBefore === 60 ? "1 hour before" :
       todo.reminder.reminders[0].minutesBefore === 1440 ? "1 day before" : "No reminder")
    : "No reminder";
    
  const [reminder, setReminder] = useState(initialReminder);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let reminderData = { enabled: false, reminders: [] as { minutesBefore: number; sent: boolean }[] };
    if (reminder !== "No reminder") {
      let minutesBefore = 0;
      if (reminder === "At deadline") minutesBefore = 0;
      else if (reminder === "5 minutes before") minutesBefore = 5;
      else if (reminder === "15 minutes before") minutesBefore = 15;
      else if (reminder === "30 minutes before") minutesBefore = 30;
      else if (reminder === "1 hour before") minutesBefore = 60;
      else if (reminder === "1 day before") minutesBefore = 1440;
      
      reminderData = {
        enabled: true,
        reminders: [{ minutesBefore, sent: false }]
      };
    }

    try {
      await update(todo.id, {
        title,
        description,
        priority,
        dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : null,
        dueTime: dueTime || null,
        reminder: reminderData,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-primary)]">Edit Todo</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="edit-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[var(--color-primary)] bg-gray-50/50"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[var(--color-primary)] bg-gray-50/50 min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Priority</label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full border border-gray-200 rounded-xl p-3 appearance-none outline-none focus:border-[var(--color-primary)] bg-gray-50/50 cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-1"><Calendar size={12}/> Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[var(--color-primary)] bg-gray-50/50 cursor-pointer text-sm"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-1"><Clock size={12}/> Due Time</label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[var(--color-primary)] bg-gray-50/50 cursor-pointer text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-1"><Bell size={12}/> Reminder</label>
                <div className="relative">
                  <select
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 appearance-none outline-none focus:border-[var(--color-primary)] bg-gray-50/50 cursor-pointer text-sm"
                  >
                    <option>No reminder</option>
                    <option>At deadline</option>
                    <option>5 minutes before</option>
                    <option>15 minutes before</option>
                    <option>30 minutes before</option>
                    <option>1 hour before</option>
                    <option>1 day before</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-[var(--color-border)] flex items-center justify-end gap-3 bg-gray-50">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="edit-form"
            disabled={!title.trim()}
            className="px-5 py-2.5 text-sm font-medium bg-[var(--color-primary)] text-white hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
