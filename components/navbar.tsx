"use client";

import { useAuth } from "../hooks/use-auth";
import { useNotifications } from "../hooks/use-notifications";
import { Bell, LogOut, User as UserIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NotificationCenter } from "./notification/notification-center";

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const { unreadCount, requestPermission } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentUser) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="font-bold text-xl text-[var(--color-primary)]">Todo App</div>
      
      <div className="flex items-center gap-6">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              requestPermission();
              setShowNotifs(!showNotifs);
              setShowDropdown(false);
            }} 
            className="relative text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors p-1"
            aria-label="Notifications"
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-[var(--color-danger)] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifs && <NotificationCenter onClose={() => setShowNotifs(false)} />}
        </div>

        <div className="relative">
          <button 
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotifs(false);
            }}
            className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full border border-transparent hover:border-gray-200 transition-all"
          >
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon size={16} className="text-gray-500" />
              </div>
            )}
            <span className="text-sm font-medium hidden sm:block text-[var(--color-primary)]">
              {currentUser.displayName?.split(' ')[0] || 'User'}
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[var(--color-border)] py-1 overflow-hidden z-50">
              <div className="px-4 py-2 border-b border-[var(--color-border)]">
                <p className="text-sm font-medium text-[var(--color-primary)] truncate">{currentUser.displayName}</p>
                <p className="text-xs text-[var(--color-muted)] truncate">{currentUser.email}</p>
              </div>
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
