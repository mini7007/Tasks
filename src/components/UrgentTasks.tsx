"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTask } from "@/context/task-context";
import { msOverdue, humanDelay, levelFromDelay } from "@/lib/overdue";
import { Button } from "@/components/ui/button";

export default function UrgentTasks() {
    const { tasks, updateTask } = useTask();

    // only show tasks that are marked overdue by TaskProvider
    const overdueTasks = useMemo(() => (tasks || []).filter((t: any) => t?.status === "overdue"), [tasks]);

    // local state ticks every minute to recalc human deltas
    const [nowTick, setNowTick] = useState(Date.now());
    useEffect(() => {
        const id = setInterval(() => setNowTick(Date.now()), 60 * 1000);
        return () => clearInterval(id);
    }, []);

    if (!overdueTasks || !overdueTasks.length) return null;

    const urgent = overdueTasks.filter((t: any) => t.overdueLevel !== "critical");
    const critical = overdueTasks.filter((t: any) => t.overdueLevel === "critical");

    const renderList = (items: any[], title: string, emoji: string, tone = "urgent") => (
        <section className="w-full bg-white/40 dark:bg-slate-900/60 border border-gray-200 dark:border-[#2d2d2d] rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-2xl">{emoji}</span>
                    <span>{title}</span>
                </h3>
                <div className="text-sm text-muted-foreground">{items.length} item{items.length > 1 ? "s" : ""}</div>
            </div>

            <div className="grid gap-3">
                {items.map((t: any) => {
                    const pick = t.dueDate && msOverdue(t.dueDate) > 0 ? msOverdue(t.dueDate) : msOverdue(t.reminder);
                    const label = humanDelay(pick);
                    return (
                        <div key={t.id} className={`flex items-center justify-between gap-4 border rounded p-3 ${t.overdueLevel === "critical" ? "bg-red-50/40 dark:bg-red-900/20 border-red-400 dark:border-red-600" : "bg-red-50/30 dark:bg-red-900/10 border-red-200 dark:border-red-700"}`}>
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 text-red-600 dark:text-red-400 font-bold ${t.overdueLevel === "critical" ? "animate-pulse" : ""}`}>{tone === "urgent" ? "🔥" : "🚨"}</div>
                                <div>
                                    <div className="font-semibold text-sm text-foreground">{t.title}</div>
                                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-red-600 text-white text-xs">{t.overdueLevel === "critical" ? "Critical" : "Urgent"}</span>
                                        <span>{label}</span>
                                        {t.assignee ? <span className="ml-2 text-xs text-muted-foreground">• {t.assignee}</span> : null}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={() => {
                                        // mark done and clear overdue flags
                                        updateTask(t.id, { status: "done", overdue: false, overdueLevel: undefined, previousStatus: undefined });
                                    }}
                                >
                                    Resolve
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        // quick open (or postpone) - return to previous status
                                        const prev = t.previousStatus || "todo";
                                        updateTask(t.id, { status: prev, overdue: false, overdueLevel: undefined, previousStatus: undefined });
                                    }}
                                >
                                    Snooze
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );

    return (
        <div className="space-y-4">
            {critical.length ? renderList(critical, "Critical Tasks", "🚨", "critical") : null}
            {urgent.length ? renderList(urgent, "Urgent Tasks", "🔥", "urgent") : null}
        </div>
    );
}
