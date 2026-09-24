"use client";

import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { Bell, LogOut, User as UserIcon, Settings, ChevronDown } from "lucide-react";
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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)] px-6 py-3 flex items-center justify-between mb-8">
      <div className="font-semibold text-lg text-[var(--color-primary)] tracking-tight flex items-center gap-2">
        <div className="w-6 h-6 bg-black text-white rounded-md flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        NovaTasks
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              requestPermission();
              setShowNotifs(!showNotifs);
              setShowDropdown(false);
            }} 
            className={`relative p-2 rounded-md transition-colors duration-200 ${showNotifs ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 text-[var(--color-muted)] hover:text-black'}`}
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#0070F3] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 mt-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
              <NotificationCenter onClose={() => setShowNotifs(false)} />
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotifs(false);
            }}
            className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-md transition-colors duration-200 ${showDropdown ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          >
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" className="w-6 h-6 rounded-md border border-gray-200" />
            ) : (
              <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                <UserIcon size={14} className="text-gray-500" />
              </div>
            )}
            <span className="text-[13px] font-medium hidden sm:block text-[var(--color-primary)]">
              {currentUser.displayName?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 clean-panel py-1.5 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2.5 mb-1 border-b border-[var(--color-border)]">
                <p className="text-[13px] font-semibold text-[var(--color-primary)] truncate">{currentUser.displayName}</p>
                <p className="text-[11px] text-[var(--color-muted)] truncate mt-0.5">{currentUser.email}</p>
              </div>
              <div className="px-1.5 pb-1">
                <button 
                  className="w-full text-left px-2.5 py-1.5 text-[13px] font-medium text-[var(--color-primary)] hover:bg-[#F4F4F5] rounded-md flex items-center gap-2.5 transition-colors mb-0.5"
                >
                  <Settings size={14} className="text-[var(--color-muted)]" />
                  Account Settings
                </button>
                <button 
                  onClick={logout}
                  className="w-full text-left px-2.5 py-1.5 text-[13px] font-medium text-[#DC2626] hover:bg-[#FEF2F2] rounded-md flex items-center gap-2.5 transition-colors"
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
