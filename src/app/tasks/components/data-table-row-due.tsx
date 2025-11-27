import { useTask } from "@/context/task-context";
import { Input } from "@/components/ui/input";

export function DataTableRowDue({ row }: any) {
    const { updateTask } = useTask();

    const value = row.getValue("dueDate") ?? "";

    const handleChange = (e: any) => {
        updateTask(row.original.id, { dueDate: e.target.value });
    };

    return (
        <div className="w-full">
            <Input defaultValue={value} type="date" onBlur={handleChange} />
        </div>
    );
}

export default DataTableRowDue;
