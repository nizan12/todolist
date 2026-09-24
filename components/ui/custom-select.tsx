"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export function CustomSelect({ value, onChange, options, placeholder, className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full outline-none transition-colors duration-200 ${className}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[140px] bg-white border border-[var(--color-border)] rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.08)] py-1 animate-in fade-in zoom-in-95 duration-100 origin-top">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="flex items-center justify-between w-full px-3 py-1.5 text-[13px] text-left text-[var(--color-primary)] hover:bg-[#F4F4F5] transition-colors"
            >
              <span className="truncate">{option}</span>
              {value === option && <Check size={14} className="text-[var(--color-primary)] flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
