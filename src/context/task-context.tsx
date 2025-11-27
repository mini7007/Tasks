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
}

interface TaskContextProps {
  tasks: Task[];
  addTask: (newTask: Partial<Task> & { title: string }) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  duplicateTask: (task: Task) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

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

    if (Array.isArray(tasks)) {
      const updatedTasks = [
        ...tasks,
        createTask(
          newTask.title,
          newTask.status || "",
          newTask.priority || "",
          newTask.label || "",
          newTask.type || "",
          newTask.assignee || "",
          newTask.dueDate || "",
          newTask.estimate,
          newTask.description || ""
        ),
      ];
      saveTasks(updatedTasks);
      setTasks(updatedTasks);
    } else {
      console.error("Existing tasks is not an array:", tasks);
      // Handle the situation where tasks is not an array
      const updatedTasks = [
        createTask(
          newTask.title,
          newTask.status || "",
          newTask.priority || "",
          newTask.label || "",
          newTask.type || "",
          newTask.assignee || "",
          newTask.dueDate || "",
          newTask.estimate,
          newTask.description || ""
        ),
      ];
      saveTasks(updatedTasks);
      setTasks(updatedTasks);
    }

  };

  const updateTask = (taskId: string, updatedTask: Partial<Task>) => {
    const tasks = getTasks();

    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updatedTask } : task
    );
    saveTasks(updatedTasks);

    setTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const taskId = id;
    const tasks = getTasks();
    const updatedTasks = tasks.filter((task: any) => task.id !== taskId);
    saveTasks(updatedTasks);
    setTasks(updatedTasks);
  };

  const duplicateTask = (task: Task) => {
    const duplicatedTask = { ...task, id: uuidv4() };
    // addTask expects a partial task with title; pass everything except id
    const { id, ...rest } = duplicatedTask;
    addTask(rest as Partial<Task> & { title: string });
  };

  useEffect(() => {
    const initialTasks = getTasks();
    setTasks(initialTasks);
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <TaskContext.Provider
      value={{ tasks, duplicateTask, addTask, updateTask, deleteTask }}
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

const createTask = (
  title: string,
  status: string,
  priority: string,
  label: string,
  type?: string,
  assignee?: string,
  dueDate?: string,
  estimate?: number
  ,
  description?: string
): Task => {
  return {
    id: uuidv4(),
    title,
    status,
    priority,
    label,
    type,
    assignee,
    dueDate,
    estimate,
    description,
  };
};
