"use client";

import { useTask } from "@/context/task-context";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

const Tasks = () => {
  const { tasks } = useTask() || [];

  // Do not pass overdue tasks to the main table — they appear on Home in the Urgent / Critical section
  const visibleTasks = tasks?.filter((t: any) => t.status !== "overdue") ?? [];

  const total = tasks?.length ?? 0;
  const completed = tasks?.filter((t: any) => t.status === "done").length ?? 0;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <>
      <div className="mb-6">
        <div className="bg-white/40 dark:bg-slate-900/60 border border-gray-200 dark:border-[#2d2d2d] rounded-lg p-4 flex items-center gap-4">
          <div className="min-w-[220px]">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Tasks completed</div>
            <div className="text-xl font-semibold text-foreground mt-1">{completed}/{total} <span className="text-sm text-muted-foreground font-medium">({percent}%)</span></div>
          </div>
          <div className="flex-1">
            <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-slate-700">
              <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </div>
      <DataTable data={visibleTasks} columns={columns} />
    </>
  );
};
export default Tasks;
