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

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
          Dashboard
        </h1>
        <p className="text-[var(--color-muted)] text-sm mt-1">Welcome back, {currentUser?.displayName?.split(' ')[0] || 'User'}.</p>
      </header>

      <TodoStatistics todos={todos} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <TodoForm />
          
          <div className="clean-panel p-4 sm:p-6 rounded-md">
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
          <div className="sticky top-24">
            <UpcomingDeadlines todos={todos} />
          </div>
        </div>
      </div>
    </div>
  );
}
