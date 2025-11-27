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
import { labels, priorities, statuses, types } from "../data/data";

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
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
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
      assignee: "",
      dueDate: "",
      estimate: "",
      description: "",
    },
  });

  const { addTask } = useTask();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Normalize estimate to number before adding
    const normalized: any = { ...data };
    if (data.estimate !== undefined && data.estimate !== "") {
      const parsed = typeof data.estimate === "string" ? parseInt(data.estimate, 10) : data.estimate;
      normalized.estimate = Number.isFinite(parsed) ? parsed : undefined;
    } else {
      normalized.estimate = undefined;
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
        className="block p-3 md:flex gap-2 md:gap-10 justify-end items-end"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Label" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Prioirity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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

        {/* Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {types.map((t: any, index: number) => (
                    <SelectItem key={index} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Assignee */}
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

        {/* Due date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estimate / Story points */}
        <FormField
          control={form.control}
          name="estimate"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="number" min={0} placeholder="Estimate" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



        <Button type="submit">Add Task</Button>

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
