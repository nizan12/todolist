import { useState } from "react";
import { useTodos } from "@/hooks/use-todos";
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

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setDueTime("");
      setReminder("No reminder");
      setIsExpanded(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="clean-panel p-4 rounded-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-grow clean-input p-2.5 text-sm w-full"
            required
          />
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors px-2 py-1 flex-shrink-0"
          >
            {isExpanded ? "Less options" : "More options"}
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 w-full sm:w-auto"
          >
            Add Task
          </button>
        </div>
        
        {isExpanded && (
          <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-4 mt-2">
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="clean-input p-2.5 text-sm min-h-[80px] resize-none"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--color-primary)]">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="clean-input p-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--color-primary)]">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="clean-input p-2 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--color-primary)]">Due Time</label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="clean-input p-2 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--color-primary)]">Reminder</label>
                <select
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                  className="clean-input p-2 text-sm"
                >
                  <option>No reminder</option>
                  <option>At deadline</option>
                  <option>5 minutes before</option>
                  <option>15 minutes before</option>
                  <option>30 minutes before</option>
                  <option>1 hour before</option>
                  <option>1 day before</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
