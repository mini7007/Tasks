import { useTask } from "@/context/task-context";
import { types } from "../data/data";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectTrigger,
    SelectValue,
} from "@radix-ui/react-select";
import { Check } from "lucide-react";

export function DataTableRowType({ row }: any) {
    const { updateTask } = useTask();

    const type = types.find((t) => t.value === row.getValue("type"));

    const handleType = (selectedValue: string) => {
        updateTask(row.original.id, { type: selectedValue });
    };

    return (
        <div className="flex items-center">
            <Select
                value={type?.value ?? ""}
                onValueChange={handleType}
                defaultValue={type?.value ?? ""}
            >
                <SelectTrigger className="flex w-full items-center gap-2 rounded-md px-3 py-2 outline-none">
                    <SelectValue>{type?.label ?? "Type"}</SelectValue>
                </SelectTrigger>
                <SelectContent
                    position="popper"
                    className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
                >
                    {types.map((t: any, index: number) => (
                        <SelectItem
                            key={index}
                            value={t.value}
                            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none"
                        >
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                <SelectItemIndicator>
                                    <Check className="h-4 w-4" />
                                </SelectItemIndicator>
                            </span>
                            <div className="flex gap-2 items-center">{t.label}</div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default DataTableRowType;
