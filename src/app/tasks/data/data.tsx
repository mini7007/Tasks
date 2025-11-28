import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const types = [
  { value: "story", label: "Story" },
  { value: "task", label: "Task" },
  { value: "bug", label: "Bug" },
  { value: "improvement", label: "Improvement" },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "overdue",
    label: "Overdue",
    icon: CrossCircledIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: "Urgent",
    value: "urgent",
    icon: ArrowUpIcon,
  },
  {
    label: "Not Urgent",
    value: "not-urgent",
    icon: ArrowLeftIcon,
  },
  {
    label: "Important",
    value: "important",
    icon: ArrowRightIcon,
  },
  {
    label: "Not Important",
    value: "not-important",
    icon: ArrowDownIcon,
  },
];

export const categories = [
  { value: "work", label: "Work", color: "bg-blue-500" },
  { value: "personal", label: "Personal", color: "bg-amber-500" },
  { value: "study", label: "Study", color: "bg-violet-500" },
  { value: "fitness", label: "Fitness", color: "bg-emerald-500" },
];

export const templates = [
  {
    id: "morning-routine",
    name: "Morning Routine",
    description: "A short set of habits to start your day.",
    tasks: [
      { title: "Wake up and make the bed", status: "todo", priority: "not-important", label: "", type: "task", category: "personal" },
      { title: "Drink water & quick stretch", status: "todo", priority: "not-important", label: "", type: "task", category: "fitness" },
      { title: "Review today's top 3 tasks", status: "todo", priority: "important", label: "", type: "task", category: "work" },
    ],
  },
  {
    id: "exam-study",
    name: "Exam Study Plan",
    description: "Study checklist to prepare for exams (spread across sessions).",
    tasks: [
      { title: "Review syllabus and set topics", status: "todo", priority: "important", label: "", type: "task", category: "study" },
      { title: "Create 50 practice flashcards", status: "todo", priority: "urgent", label: "", type: "task", category: "study" },
      { title: "Practice past paper (2 hours)", status: "todo", priority: "important", label: "", type: "task", category: "study" },
    ],
  },
  {
    id: "job-search",
    name: "Job Search Checklist",
    description: "Key items for an effective job search.",
    tasks: [
      { title: "Update resume and portfolio", status: "todo", priority: "important", label: "", type: "task", category: "work" },
      { title: "Apply to 5 jobs from target list", status: "todo", priority: "urgent", label: "", type: "task", category: "work" },
      { title: "Prepare 3 interview answers", status: "todo", priority: "important", label: "", type: "task", category: "work" },
    ],
  },
  {
    id: "fitness-tracker",
    name: "Fitness Tracker",
    description: "Simple daily fitness checklist.",
    tasks: [
      { title: "10 min warm-up", status: "todo", priority: "not-important", label: "", type: "task", category: "fitness" },
      { title: "30 min workout", status: "todo", priority: "important", label: "", type: "task", category: "fitness" },
      { title: "Log calories & water intake", status: "todo", priority: "not-important", label: "", type: "task", category: "fitness" },
    ],
  },
];
