"use client";
import Link from "next/link";
import { ThemeSwitch } from "../theme/theme-switch";
import { useTask } from "@/context/task-context";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const { tasks } = useTask() || { tasks: [] };
  const overdueCount = (tasks || []).filter((t: any) => t?.status === "overdue").length;
  return (
    <header className="bg-background border-b text-foreground py-2">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <Link
              href="/"
              className="font-bold text-slate-800 dark:text-slate-50"
            >
              iTasks
            </Link>
          </div>
          <nav>
            <ul className="flex gap-3">
              <li>
                <Link
                  href="/"
                  className={`${pathname === "/" ? "text-blue-500 font-semibold" : ""}`}
                >
                  Home
                  {overdueCount > 0 && (
                    <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-red-600 text-white font-semibold">
                      {overdueCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className={`${pathname === "/tasks" ? "text-blue-500 font-semibold" : ""
                    }`}
                >
                  Tasks
                </Link>
              </li>
              <li>
                <Link
                  href="/challenges"
                  className={`${pathname === "/challenges"
                    ? "text-blue-500 font-semibold"
                    : ""
                    }`}
                >
                  Challenges
                </Link>
              </li>
            </ul>
          </nav>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
};

export default Header;
