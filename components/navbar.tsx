"use client";

import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { Bell, LogOut, User as UserIcon, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NotificationCenter } from "./notification/notification-center";

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const { unreadCount, requestPermission } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentUser) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)] px-6 py-3 flex items-center justify-between mb-8">
      <div className="font-semibold text-lg text-[var(--color-primary)]">
        Todo List
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              requestPermission();
              setShowNotifs(!showNotifs);
              setShowDropdown(false);
            }} 
            className="relative p-1.5 rounded-md hover:bg-gray-100 text-[var(--color-muted)] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-[var(--color-primary)] text-white text-[9px] font-medium h-3.5 w-3.5 rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifs && <NotificationCenter onClose={() => setShowNotifs(false)} />}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotifs(false);
            }}
            className="flex items-center gap-2 hover:bg-gray-100 p-1 pr-2 rounded-md transition-colors"
          >
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" className="w-6 h-6 rounded-md" />
            ) : (
              <div className="w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center">
                <UserIcon size={14} className="text-gray-500" />
              </div>
            )}
            <span className="text-sm font-medium hidden sm:block text-[var(--color-primary)]">
              {currentUser.displayName?.split(' ')[0] || 'User'}
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 clean-panel rounded-md py-1 overflow-hidden z-50">
              <div className="px-3 py-2 border-b border-[var(--color-border)] bg-gray-50">
                <p className="text-sm font-medium text-[var(--color-primary)] truncate">{currentUser.displayName}</p>
                <p className="text-xs text-[var(--color-muted)] truncate">{currentUser.email}</p>
              </div>
              <div className="py-1">
                <button 
                  className="w-full text-left px-3 py-1.5 text-sm text-[var(--color-primary)] hover:bg-gray-100 flex items-center gap-2"
                >
                  <Settings size={14} className="text-[var(--color-muted)]" />
                  Settings
                </button>
                <button 
                  onClick={logout}
                  className="w-full text-left px-3 py-1.5 text-sm text-[var(--color-danger)] hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
