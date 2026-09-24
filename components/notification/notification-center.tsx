import { useNotifications } from "../../hooks/use-notifications";
import { CheckCheck, Trash2, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function NotificationCenter({ onClose }: { onClose: () => void }) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[var(--color-border)] py-2 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 className="font-bold text-[var(--color-primary)] flex items-center gap-2">
          <Bell size={18} /> Notifications
        </h3>
        {notifications.length > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-[var(--color-muted)] text-sm">
            <Bell size={32} className="mx-auto mb-3 opacity-20" />
            No notifications yet
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => {
                  if (!notif.read) markAsRead(notif.id);
                  // Open todo logically if we had a query param handler
                  // window.location.href = `/dashboard?todo=${notif.todoId}`;
                }}
                className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${notif.read ? 'opacity-60' : 'bg-blue-50/30'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className={`text-sm font-semibold mb-1 ${
                      notif.type === 'overdue' ? 'text-[var(--color-danger)]' : 
                      notif.type === 'deadline' ? 'text-[var(--color-warning)]' : 
                      'text-blue-600'
                    }`}>
                      {notif.title}
                    </h4>
                    <p className="text-sm text-[var(--color-primary)] leading-tight mb-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-[var(--color-muted)] font-medium">
                      {notif.createdAt ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-1"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
