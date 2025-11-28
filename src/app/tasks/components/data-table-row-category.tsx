import { categories } from "../data/data";

export function DataTableRowCategory({ row }: any) {
    const value = row.getValue("category") ?? "";

    const cat = categories.find((c) => c.value === value);

    return (
        <div className="flex items-center gap-2">
            {cat ? (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs text-white ${cat.color}`}>
                    {cat.label}
                </span>
            ) : (
                <span className="text-xs text-muted-foreground">—</span>
            )}
        </div>
    );
}

export default DataTableRowCategory;
