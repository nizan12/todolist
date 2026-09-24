import { Filter } from "lucide-react";

export function TodoFilter({ filterStatus, setFilterStatus, filterPriority, setFilterPriority, sortBy, setSortBy }: any) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-4 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
        <Filter size={16} className="text-[var(--color-muted)] mr-1" />
        
        {['All', 'Active', 'Completed', 'Overdue'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}

        <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium outline-none cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <option>All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="w-full sm:w-auto">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-auto border border-gray-200 text-[var(--color-primary)] px-4 py-2 rounded-xl text-sm font-medium outline-none cursor-pointer hover:bg-gray-50 transition-colors focus:border-[var(--color-primary)]"
        >
          <option>Newest</option>
          <option>Oldest</option>
          <option>Due Date</option>
          <option>Priority</option>
        </select>
      </div>
    </div>
  );
}
