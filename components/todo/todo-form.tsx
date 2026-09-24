import { useState } from "react";
import { useTodos } from "../../hooks/use-todos";
import { Plus, Calendar, Clock, Bell, ChevronDown } from "lucide-react";
import { Timestamp } from "firebase/firestore";

export function TodoForm() {
  const { add } = useTodos();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [reminder, setReminder] = useState("No reminder");
  const [isExpanded, setIsExpanded] = useState(false);

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
      await add({
        title,
        description,
        priority,
        completed: false,
        dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : null,
        dueTime: dueTime || null,
        reminder: reminderData,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setDueTime("");
      setReminder("No reminder");
      setIsExpanded(false);
      
      // Here you would add toast.success("Todo created successfully")
    } catch (error) {
      // toast.error("Failed to create todo")
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-lg font-medium border-b border-transparent hover:border-gray-200 focus:border-[var(--color-primary)] outline-none py-2 transition-colors bg-transparent placeholder-gray-400"
          required
        />
        
        {isExpanded && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all resize-none bg-gray-50/50 min-h-[80px] text-sm"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--color-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-current"></span> Priority
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full border border-gray-200 rounded-xl p-2.5 appearance-none outline-none focus:border-[var(--color-primary)] bg-gray-50/50 text-sm cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--color-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar size={12} /> Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[var(--color-primary)] bg-gray-50/50 text-sm cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--color-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock size={12} /> Due Time
                </label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[var(--color-primary)] bg-gray-50/50 text-sm cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--color-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                  <Bell size={12} /> Reminder
                </label>
                <div className="relative">
                  <select
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-2.5 appearance-none outline-none focus:border-[var(--color-primary)] bg-gray-50/50 text-sm cursor-pointer"
                  >
                    <option>No reminder</option>
                    <option>At deadline</option>
                    <option>5 minutes before</option>
                    <option>15 minutes before</option>
                    <option>30 minutes before</option>
                    <option>1 hour before</option>
                    <option>1 day before</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
          <button 
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors px-2 py-1 rounded-md hover:bg-gray-50"
          >
            {isExpanded ? "Hide Details" : "Add Details"}
          </button>
          
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Plus size={18} />
            Add Todo
          </button>
        </div>
      </form>
    </div>
  );
}
