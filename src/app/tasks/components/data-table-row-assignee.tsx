import { useTask } from "@/context/task-context";
import { Input } from "@/components/ui/input";

export function DataTableRowAssignee({ row }: any) {
    const { updateTask } = useTask();

    const value = row.getValue("assignee") ?? "";

    const handleChange = (e: any) => {
        updateTask(row.original.id, { assignee: e.target.value });
    };

    return (
        <div className="w-full">
            <Input defaultValue={value} onBlur={handleChange} placeholder="Assignee" />
        </div>
    );
}

export default DataTableRowAssignee;
