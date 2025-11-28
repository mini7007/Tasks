"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTask } from "@/context/task-context";
import { labels, priorities, statuses, types, categories } from "../data/data";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Write task title (ex: SEO update) ",
  }),
  label: z.string().min(2, {
    message: "Select Label (ex: bug)",
  }),
  status: z.string().min(2, {
    message: "Task Status (ex: todo)",
  }),
  priority: z.string().min(2, {
    message: "Task Priority (ex: high)",
  }),
  // optional Jira-like fields
  type: z.string().optional(),
  category: z.string().optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  reminder: z.string().optional(),
  estimate: z.union([z.string(), z.number()]).optional(),
  description: z.string().optional(),
});

export function AddTask() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      label: "",
      title: "",
      status: "",
      priority: "",
      type: "",
      category: "",
      reminder: "",
      assignee: "",
      dueDate: "",
      estimate: "",
      description: "",
    },
  });

  const { addTask } = useTask();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Normalize estimate to number before adding
    const normalized: any = { ...data };
    if (data.estimate !== undefined && data.estimate !== "") {
      const parsed = typeof data.estimate === "string" ? parseInt(data.estimate, 10) : data.estimate;
      normalized.estimate = Number.isFinite(parsed) ? parsed : undefined;
    } else {
      normalized.estimate = undefined;
    }

    // normalize reminder (datetime-local -> ISO)
    if (data.reminder) {
      try {
        const d = new Date(data.reminder);
        normalized.reminder = isNaN(d.getTime()) ? undefined : d.toISOString();
      } catch (e) {
        normalized.reminder = undefined;
      }
    }

    // if user set a reminder, ask for notification permission so scheduling works
    if (normalized.reminder && typeof window !== "undefined" && "Notification" in window) {
      try {
        if (Notification.permission !== "granted") {
          const p = await Notification.requestPermission();
          if (p !== "granted") {
            toast({
              title: "Notifications not enabled",
              description:
                "You denied or blocked browser notifications. Reminders only work when notifications are allowed and the app/tab is open.",
            });
          }
        }
      } catch (e) {
        // ignore permission errors
      }
    }

    addTask(normalized);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full bg-white/40 dark:bg-slate-900/60 border border-gray-200 dark:border-[#2d2d2d] rounded-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3 items-end"
      >
        <div className="col-span-12 md:col-span-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Task title" {...field} className="h-11 px-3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-6 md:col-span-2">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 px-3">
                      <SelectValue placeholder="Label" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="min-w-[12rem]">
                    {/* <SelectLabel>Status</SelectLabel> */}
                    {labels.map((label: any, index: number) => (
                      <SelectItem key={index} value={label.value}>
                        {label.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-6 md:col-span-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 px-3">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="min-w-[12rem]">
                    {statuses.map((status: any, index: number) => (
                      <SelectItem key={index} value={status.value}>
                        <div className="flex justify-center items-center gap-3">
                          <status.icon /> {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-6 md:col-span-2">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 px-3">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="min-w-[12rem]">
                    {priorities.map((priority: any, index: number) => (
                      <SelectItem key={index} value={priority.value}>
                        <div className="flex justify-center items-center gap-3">
                          <priority.icon /> {priority.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Type */}
        <div className="col-span-6 md:col-span-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="h-11 px-3">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[12rem]">
                      {types.map((t: any, index: number) => (
                        <SelectItem key={index} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Assignee */}
        <div className="col-span-6 md:col-span-2">
          <FormField
            control={form.control}
            name="assignee"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Assignee (name)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Due date */}
        <div className="col-span-6 md:col-span-2">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="date" placeholder="Due Date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Estimate / Story points */}
        <div className="col-span-6 md:col-span-2">
          <FormField
            control={form.control}
            name="estimate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="number" min={0} placeholder="Weightage" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category */}
        <div className="col-span-6 md:col-span-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 px-3">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="min-w-[12rem]">
                    {categories.map((c: any, index: number) => (
                      <SelectItem key={index} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Reminder */}
        <div className="col-span-12 md:col-span-6">
          <FormField
            control={form.control}
            name="reminder"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="datetime-local" placeholder="Reminder" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        <div className="col-span-12 md:col-span-6 flex items-center md:justify-end">
          <Button type="submit" className="h-11 px-4 rounded-md">Add Task</Button>
        </div>

      </form>
      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="md:w-[340px] w-full">
            <FormControl>
              <textarea
                {...field}
                placeholder="Short description (optional)"
                className="resize-none rounded-md border px-2 py-2 text-sm w-full transition-[height] duration-150 ease-in-out focus:shadow-sm"
                rows={2}
                onInput={(e) => {
                  // autosize behavior
                  const ta = e.target as HTMLTextAreaElement;
                  ta.style.height = "auto";
                  ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
                }}
              />
            </FormControl>
            <FormMessage />
            <div className="mt-1 text-xs text-muted-foreground">Click inside to expand — press Add to save</div>
          </FormItem>
        )}
      />
    </Form>
  );
}
