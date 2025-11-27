import { useTask } from "@/context/task-context";
import { Input } from "@/components/ui/input";

export function DataTableRowEstimate({ row }: any) {
    const { updateTask } = useTask();

    const value = row.getValue("estimate");

    const handleChange = (e: any) => {
        const val = e.target.value;
        const parsed = val === "" ? undefined : parseInt(val, 10);
        updateTask(row.original.id, { estimate: parsed });
    };

    return (
        <div className="w-full">
            <Input defaultValue={value ?? ""} type="number" min={0} onBlur={handleChange} placeholder="pts" />
        </div>
    );
}

export default DataTableRowEstimate;
