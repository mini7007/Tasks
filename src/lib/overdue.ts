export type OverdueLevel = "urgent" | "critical";

// Decide level based on how long a task is overdue (ms)
export function levelFromDelay(ms: number): OverdueLevel {
  const hours = ms / (1000 * 60 * 60);
  if (hours >= 72) return "critical"; // 3+ days
  return "urgent"; // default urgent
}

// Human readable delta: "Delayed by 1 day 4 hours" etc.
export function humanDelay(ms: number): string {
  if (ms <= 0) return "On time";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts: string[] = [];
  if (days) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (!days && minutes) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);

  return `Delayed by ${parts.join(" ")}`;
}

// Given a timestamp string (ISO) return ms overdue (positive if past)
export function msOverdue(iso?: string | null): number {
  if (!iso) return 0;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return 0;
  return Date.now() - t;
}
