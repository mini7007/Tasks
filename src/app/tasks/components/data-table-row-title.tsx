import { Badge } from "@/components/ui/badge";
import { useTask } from "@/context/task-context";
import { useState } from "react";
import { labels, categories, types } from "../data/data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

export function DataTableRowTitle({ row }: any) {
  const label = labels.find((label) => label.value === row.original.label);
  const [isEditing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(row.getValue("title"));
  const { updateTask } = useTask();

  const handleTitleClick = () => {
    setEditing(true);
  };

  const handleTitleChange = (e: any) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setEditing(false);
    updateTask(row.original.id, { title: editedTitle });
  };
  const cat = categories.find((c) => c.value === row.original.category);
  const typeVal = types.find((t) => t.value === row.original.type);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {label && <Badge variant="outline">{label.label}</Badge>}
        {isEditing ? (
          <Input
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            className="max-w-[600px] truncate font-medium px-2 border-none h-full"
          />
        ) : (
          <span
            onClick={handleTitleClick}
            className="max-w-[600px] truncate font-medium"
            title="Click to Edit"
          >
            {row.getValue("title")}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {/* Type */}
        <div className="inline-flex items-center gap-1">
          <span className="text-xs font-medium">{typeVal?.label ?? row.original.type ?? "Task"}</span>
        </div>

        {/* Category select inline */}
        <div className="inline-flex items-center gap-1">
          {cat ? (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs text-white ${cat.color}`}>{cat.label}</span>
          ) : (
            <span className="text-xs text-muted-foreground">No category</span>
          )}
        </div>

        {/* Assignee inline editable */}
        <div className="inline-flex items-center">
          <InlineAssigneeEditable row={row} />
        </div>

        {/* Reminder inline editable */}
        <div className="inline-flex items-center">
          <InlineReminderEditable row={row} />
        </div>
      </div>
    </div>
  );
}

function InlineAssigneeEditable({ row }: any) {
  const { updateTask } = useTask();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(row.original.assignee || "");

  const handleBlur = () => {
    setEditing(false);
    updateTask(row.original.id, { assignee: value });
  };

  return (
    <div className="inline-flex items-center">
      {editing ? (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="w-28 h-6 text-xs py-0"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-muted-foreground hover:underline"
          title={value || "Unassigned — click to edit"}
        >
          {value || "Unassigned"}
        </button>
      )}
    </div>
  );
}

function InlineReminderEditable({ row }: any) {
  const { updateTask } = useTask();
  const [editing, setEditing] = useState(false);
  const existing = row.original.reminder || "";
  // convert ISO -> datetime-local value (YYYY-MM-DDTHH:mm)
  const toLocalVal = (iso: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      const tzOffset = d.getTimezoneOffset() * 60000; // offset in ms
      const local = new Date(d.getTime() - tzOffset);
      return local.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  const [value, setValue] = useState(toLocalVal(existing));

  const handleBlur = async () => {
    setEditing(false);
    // convert back to ISO or clear
    if (!value) {
      updateTask(row.original.id, { reminder: "" });
      return;
    }
    // Request notification permission if needed so scheduled reminders can fire
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        if (Notification.permission !== "granted") {
          const p = await Notification.requestPermission();
          if (p !== "granted") {
            toast({
              title: "Notifications disabled",
              description:
                "Reminders require browser notifications and the tab to be open — enable notifications to receive reminders.",
            });
          }
        }
      } catch (e) {
        // ignore
      }
    }
    const iso = new Date(value).toISOString();
    updateTask(row.original.id, { reminder: iso });
  };

  return (
    <div className="inline-flex items-center">
      {editing ? (
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="text-xs px-1 py-0 border rounded h-6"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-muted-foreground hover:underline"
          title={existing ? format(new Date(existing), "PP p") : "No reminder — click to set"}
        >
          {existing ? format(new Date(existing), "PP p") : "No reminder"}
        </button>
      )}
    </div>
  );
}
