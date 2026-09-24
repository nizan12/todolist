import { useNotifications } from "@/hooks/use-notifications";
import { CheckCheck, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function NotificationCenter({ onClose }: { onClose: () => void }) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="w-80 sm:w-[360px] clean-panel overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between bg-[#FAFAFA]">
        <h3 className="text-[13px] font-semibold text-[var(--color-primary)]">
          Notifications
        </h3>
        {notifications.length > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-[11px] font-medium text-[#0070F3] hover:text-black transition-colors flex items-center gap-1"
          >
            <CheckCheck size={12} /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center">
            <Bell size={24} className="mb-2 text-gray-300" strokeWidth={1.5} />
            <p className="text-[13px] font-medium text-[var(--color-primary)]">You're all caught up</p>
            <p className="text-[11px] text-[var(--color-muted)] mt-0.5">No new notifications</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => {
                  if (!notif.read) markAsRead(notif.id);
                }}
                className={`p-4 border-b border-[var(--color-border)] cursor-pointer hover:bg-[#FAFAFA] transition-colors relative ${notif.read ? 'opacity-70' : 'bg-white'}`}
              >
                {!notif.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#0070F3]"></div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="pl-1">
                    <h4 className={`text-[13px] font-medium mb-1 ${
                      notif.type === 'overdue' ? 'text-[#DC2626]' : 
                      notif.type === 'deadline' ? 'text-[#D97706]' : 
                      'text-[var(--color-primary)]'
                    }`}>
                      {notif.title}
                    </h4>
                    <p className="text-[12px] text-[var(--color-muted)] leading-relaxed mb-1.5">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {notif.createdAt ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true }) : 'just now'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-2 border-t border-[var(--color-border)] bg-[#FAFAFA] text-center">
          <button onClick={onClose} className="text-[11px] font-medium text-[var(--color-muted)] hover:text-black transition-colors py-1 px-3">
            Close
          </button>
        </div>
      )}
    </div>
  );
}
