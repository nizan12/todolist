import { Filter } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";

export function TodoFilter({ filterStatus, setFilterStatus, filterPriority, setFilterPriority, sortBy, setSortBy }: any) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between pb-3 border-b border-[var(--color-border)] w-full">
      <div className="flex items-center gap-1.5 sm:gap-2 w-full lg:w-auto overflow-hidden">
        <Filter size={14} className="text-[var(--color-muted)] mr-1 hidden sm:block flex-shrink-0" strokeWidth={2} />
        
        {['All', 'Active', 'Completed', 'Overdue'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors duration-200 flex-shrink-0 ${
              filterStatus === status
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-white text-[var(--color-muted)] hover:bg-[#F4F4F5] hover:text-black'
            }`}
          >
            {status}
          </button>
        ))}

        <div className="w-px h-4 bg-[#EAEAEA] mx-1 hidden sm:block flex-shrink-0"></div>

        <div className="w-24 sm:w-28 flex-shrink-0 hidden sm:block">
          <CustomSelect
            value={filterPriority}
            onChange={setFilterPriority}
            options={['All Priority', 'Low', 'Medium', 'High']}
            className="bg-white text-[12px] font-medium text-[var(--color-muted)] hover:bg-[#F4F4F5] hover:text-black px-2 py-1 rounded-md w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:flex-shrink-0 ml-auto lg:ml-0 mt-2 lg:mt-0">
        <span className="text-[12px] font-medium text-[var(--color-muted)] hidden sm:block">Sort by:</span>
        <div className="w-24 sm:w-28 flex-shrink-0">
          <CustomSelect
            value={sortBy}
            onChange={setSortBy}
            options={['Newest', 'Oldest', 'Due Date', 'Priority']}
            className="bg-white border border-[var(--color-border)] text-[12px] font-medium px-2 py-1 rounded-md hover:bg-[#FAFAFA] w-full"
          />
        </div>
      </div>
    </div>
  );
}
