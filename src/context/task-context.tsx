// TaskContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  label: string;
  // optional Jira-like fields
  type?: string;
  assignee?: string;
  dueDate?: string; // ISO date string
  estimate?: number;
  description?: string;
  category?: string;
  reminder?: string; // ISO datetime string for a reminder (optional)
  // overdue tracking
  overdue?: boolean;
  overdueLevel?: "urgent" | "critical";
  previousStatus?: string; // stored when we auto-mark overdue
}

interface TaskContextProps {
  tasks: Task[];
  addTask: (newTask: Partial<Task> & { title: string }) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  duplicateTask: (task: Task) => void;
  importTemplate?: (items: Array<Partial<Task>>) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  // keep scheduled reminder timers so we can clear/reschedule
  const reminderTimers = React.useRef<Record<string, number>>({});

  const getTasks = () => {
    try {
      const taskJson = localStorage.getItem("tasks");

      if (!taskJson) {
        return [];
      }

      const parsedTasks = JSON.parse(taskJson);

      if (Array.isArray(parsedTasks)) {
        return parsedTasks;
      } else if (typeof parsedTasks === "object") {
        // If the existing data is an object, treat it as a single task
        return [parsedTasks];
      } else {
        console.error("Invalid format for existing tasks:", parsedTasks);
        return [];
      }
    } catch (error) {
      console.error("Error parsing tasks from local storage:", error);
      return [];
    }
  };

  const saveTasks = (data: any) => {
    const tasksJson = JSON.stringify(data);
    localStorage.setItem("tasks", tasksJson);
  };

  const addTask = (newTask: Partial<Task> & { title: string }) => {
    const tasks = getTasks();

    const created = createTask(newTask);

    if (Array.isArray(tasks)) {
      const updatedTasks = [...tasks, created];
      saveTasks(updatedTasks);
      setTasks(updatedTasks);
    } else {
      console.error("Existing tasks is not an array:", tasks);
      const updatedTasks = [created];
      saveTasks(updatedTasks);
      setTasks(updatedTasks);
    }
    // schedule reminder for newly created task
    scheduleReminder(created);
    // check immediately for overdue state
    try {
      if (typeof window !== "undefined") {
        // small safety check: if created has a past due/reminder mark it as overdue
        // we'll allow the periodic checker in effect to normalize, but do a one-off here
        // (if reminder/dueDate exist and are in the past)
        // do not import msOverdue here to avoid circular import — handled by effect
      }
    } catch (e) {
      // ignore
    }

  };

  const updateTask = (taskId: string, updatedTask: Partial<Task>) => {
    const tasks = getTasks();

    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updatedTask } : task
    );
    saveTasks(updatedTasks);

    setTasks(updatedTasks);
    // reschedule reminders for updated task
    const changed = updatedTasks.find((t: any) => t.id === taskId);
    if (changed) {
      cancelReminder(taskId);
      scheduleReminder(changed as Task);
    }
  };

  const deleteTask = (id: string) => {
    const taskId = id;
    const tasks = getTasks();
    const updatedTasks = tasks.filter((task: any) => task.id !== taskId);
    saveTasks(updatedTasks);
    setTasks(updatedTasks);
    // cancel reminder if any
    cancelReminder(id);
  };

  const duplicateTask = (task: Task) => {
    const duplicatedTask = { ...task, id: uuidv4() };
    // addTask expects a partial task with title; pass everything except id
    const { id, ...rest } = duplicatedTask;
    addTask(rest as Partial<Task> & { title: string });
  };

  // Import a template (array of task-like objects)
  const importTemplate = (items: Array<Partial<Task>>) => {
    const tasks = getTasks();
    const created = items.map((it) => createTask(it as Partial<Task> & { title: string }));
    const updatedTasks = [...tasks, ...created];
    saveTasks(updatedTasks);
    setTasks(updatedTasks);
    created.forEach((t) => scheduleReminder(t));
  };

  function scheduleReminder(task: Task) {
    try {
      if (!task || !task.reminder) return;
      const when = new Date(task.reminder).getTime();
      const now = Date.now();
      const ms = when - now;
      if (ms <= 0 || ms > 1000 * 60 * 60 * 24 * 365) return; // ignore past or ridiculous dates

      // schedule in browser only
      if (typeof window === "undefined") return;

      // convert to number handle for clearing
      const handle = window.setTimeout(() => {
        try {
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("EyeTasks reminder", {
              body: `${task.title}${task.description ? ": " + task.description.slice(0, 100) : ""}`,
            });
          }
        } catch (e) {
          console.error("reminder notify fail", e);
        }
      }, ms);

      reminderTimers.current[task.id] = handle;
    } catch (e) {
      // ignore
    }
  }

  function cancelReminder(taskId: string) {
    try {
      const handle = reminderTimers.current[taskId];
      if (handle) {
        clearTimeout(handle as any);
        delete reminderTimers.current[taskId];
      }
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    const initialTasks = getTasks();
    setTasks(initialTasks);
    // schedule any reminders on load
    if (typeof window !== "undefined") {
      if (Notification && Notification.permission !== "granted") {
        // request permission lazily - do not spam user
        // Only request when user performs an action; for now we won't auto-request here.
      }
      initialTasks.forEach((t: any) => scheduleReminder(t as Task));
    }
  }, []); // Empty dependency array ensures it runs only once on mount

  // periodically check for overdue tasks and mark them; runs in browser only
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkOverdue = () => {
      try {
        const current = getTasks();
        let changed = false;
        const updated = current.map((t: any) => {
          // skip done/canceled
          if (!t) return t;
          if (t.status === "done" || t.status === "canceled") return t;

          const dueMs = t.dueDate ? Date.now() - Date.parse(t.dueDate) : -1;
          const remMs = t.reminder ? Date.now() - Date.parse(t.reminder) : -1;
          const overdueMs = Math.max(dueMs, remMs);

          // only consider overdue if > 0 and we actually have a date
          if (overdueMs > 0) {
            // already overdue
            const newLevel = overdueMs >= 1000 * 60 * 60 * 24 * 3 ? "critical" : "urgent";
            if (t.status !== "overdue" || t.overdueLevel !== newLevel) {
              changed = true;
              return { ...t, previousStatus: t.status !== "overdue" ? t.status : t.previousStatus, status: "overdue", overdue: true, overdueLevel: newLevel };
            }
            return t;
          } else {
            // not overdue — if previously flagged overdue, restore previous
            if (t.status === "overdue") {
              changed = true;
              const prev = t.previousStatus || "todo";
              return { ...t, status: prev, overdue: false, overdueLevel: undefined, previousStatus: undefined };
            }
            return t;
          }
        });

        if (changed) {
          saveTasks(updated);
          setTasks(updated);
        }
      } catch (e) {
        // ignore
      }
    };

    // run once then every minute
    checkOverdue();
    const id = window.setInterval(checkOverdue, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <TaskContext.Provider
      value={{ tasks, duplicateTask, addTask, updateTask, deleteTask, importTemplate }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

const createTask = (input: Partial<Task> & { title: string }): Task => {
  return {
    id: uuidv4(),
    title: input.title,
    status: input.status || "todo",
    priority: input.priority || "not-important",
    label: input.label || "",
    type: input.type || "task",
    assignee: input.assignee || "",
    dueDate: input.dueDate || "",
    estimate: input.estimate ?? undefined,
    description: input.description || "",
    category: input.category || "",
    reminder: input.reminder || undefined,
  };
};
