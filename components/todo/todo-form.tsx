import { useState } from "react";
import { useTodos } from "@/hooks/use-todos";
import { Timestamp } from "firebase/firestore";
import { CustomSelect } from "@/components/ui/custom-select";

export function TodoForm() {
  const { add } = useTodos();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
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
        priority: priority.toLowerCase() as "low" | "medium" | "high",
        completed: false,
        dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : null,
        dueTime: dueTime || null,
        reminder: reminderData,
      });

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");
      setDueTime("");
      setReminder("No reminder");
      setIsExpanded(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="clean-panel p-4 rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-grow clean-input p-2.5 text-[14px] w-full"
            required
          />
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[12px] font-medium text-[var(--color-muted)] hover:text-black transition-colors px-2 py-1.5 flex-shrink-0 bg-gray-50 hover:bg-gray-100 rounded-md"
          >
            {isExpanded ? "Less options" : "More options"}
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="btn-primary px-4 py-2.5 rounded-md text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 w-full sm:w-auto"
          >
            Add Task
          </button>
        </div>
        
        {isExpanded && (
          <div className="flex flex-col gap-4 pt-2">
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="clean-input p-2.5 text-[13px] min-h-[80px] resize-none"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">Priority</label>
                <CustomSelect
                  value={priority}
                  onChange={setPriority}
                  options={['Low', 'Medium', 'High']}
                  className="clean-input p-2 text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="clean-input p-2 text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">Due Time</label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="clean-input p-2 text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">Reminder</label>
                <CustomSelect
                  value={reminder}
                  onChange={setReminder}
                  options={['No reminder', 'At deadline', '5 minutes before', '15 minutes before', '30 minutes before', '1 hour before', '1 day before']}
                  className="clean-input p-2 text-[13px]"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
