import React, { useState } from "react";
import { useTask } from "@/context/task-context";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

export function DataTableRowDescription({ row }: any) {
    const { updateTask } = useTask();

    const current = (row.getValue("description") ?? "") as string;
    const [open, setOpen] = useState(false);
    const [editValue, setEditValue] = useState<string>(current);

    const truncated = current.length > 120 ? `${current.substring(0, 120)}…` : current;

    const openEditor = () => {
        setEditValue(current);
        setOpen(true);
    };

    const save = () => {
        updateTask(row.original.id, { description: editValue });
        setOpen(false);
    };

    return (
        <div className="w-full">
            <div className="flex items-start gap-2">
                <div className="flex-1 text-sm text-muted-foreground break-words min-h-[36px]">
                    {current ? truncated : <span className="text-muted-foreground/60">No description</span>}
                </div>
                <div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={openEditor} title={current ? "Edit description" : "Add description"}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{current ? "Edit description" : "Add description"}</DialogTitle>
                                <DialogDescription>Edit the full task description below.</DialogDescription>
                            </DialogHeader>

                            <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                placeholder="Write a longer description for the task..."
                                className="w-full min-h-[120px] rounded-md border px-2 py-2 text-sm"
                            />

                            <DialogFooter className="mt-4 flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button onClick={save}>Save</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default DataTableRowDescription;
