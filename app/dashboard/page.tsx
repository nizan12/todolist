"use client";

import { useAuth } from "@/hooks/use-auth";
import { useTodos } from "@/hooks/use-todos";
import { TodoList } from "@/components/todo/todo-list";
import { TodoForm } from "@/components/todo/todo-form";
import { TodoStatistics } from "@/components/todo/todo-statistics";
import { TodoFilter } from "@/components/todo/todo-filter";
import { UpcomingDeadlines } from "@/components/todo/upcoming-deadlines";
import { useState } from "react";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { todos, loading } = useTodos();
  
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All Priority");
  const [sortBy, setSortBy] = useState("Newest");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="mb-2">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">
          {getGreeting()}, {currentUser?.displayName?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-[var(--color-muted)] mt-1">Manage your tasks and stay productive.</p>
      </header>

      <TodoStatistics todos={todos} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <TodoForm />
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
            <TodoFilter 
              filterStatus={filterStatus} setFilterStatus={setFilterStatus}
              filterPriority={filterPriority} setFilterPriority={setFilterPriority}
              sortBy={sortBy} setSortBy={setSortBy}
            />
            <div className="mt-6">
              <TodoList 
                todos={todos} loading={loading}
                filterStatus={filterStatus} filterPriority={filterPriority} sortBy={sortBy}
              />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <UpcomingDeadlines todos={todos} />
        </div>
      </div>
    </div>
  );
}
