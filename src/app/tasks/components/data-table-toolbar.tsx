"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Download, Printer } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";


import { priorities, statuses, templates } from "../data/data";
import { useTask } from "@/context/task-context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { importTemplate } = useTask();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* right-aligned action bar */}
        <div className="flex items-center gap-2 bg-white/40 dark:bg-slate-900/60 border border-gray-200 dark:border-[#2d2d2d] rounded-md p-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden h-9 px-3 lg:flex rounded-md text-sm"
            onClick={() => {
              // export currently filtered rows to CSV
              const rows = table.getFilteredRowModel().rows.map((r) => r.original as any);
              if (!rows.length) return;
              const headers = [
                "id",
                "title",
                "type",
                "label",
                "status",
                "priority",
                "assignee",
                "dueDate",
                "estimate",
                "description",
              ];

              const csv = [headers.join(",")];
              rows.forEach((row) => {
                const line = headers
                  .map((h) => {
                    let v = row[h] === undefined || row[h] === null ? "" : row[h];
                    if (typeof v === "string") v = v.replace(/"/g, '""').replace(/\n/g, " ");
                    return `"${String(v)}"`;
                  })
                  .join(",");
                csv.push(line);
              });

              const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `itasks-export-${new Date().toISOString()}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="hidden h-9 px-3 lg:flex rounded-md text-sm"
            onClick={() => {
              const rows = table.getFilteredRowModel().rows.map((r) => r.original as any);
              if (!rows.length) return;

              // Open printable window and let the user save as PDF via print dialog
              const headers = ["Title", "Type", "Label", "Status", "Priority", "Assignee", "Due", "Estimate", "Description"];
              let html = `<!doctype html><html><head><meta charset="utf-8"/><title>iTasks export</title><style>body{font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding:18px} table{border-collapse:collapse;width:100%} th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px} th{background:#f3f4f6}</style></head><body>`;
              html += `<h2>iTasks export - ${new Date().toLocaleString()}</h2>`;
              html += '<table><thead><tr>' + headers.map((h) => `<th>${h}</th>`).join("") + '</tr></thead><tbody>';
              html += rows
                .map((r) => {
                  return (
                    '<tr>' +
                    `<td>${escapeHtml(r.title ?? "")}</td>` +
                    `<td>${escapeHtml(r.type ?? "")}</td>` +
                    `<td>${escapeHtml(r.label ?? "")}</td>` +
                    `<td>${escapeHtml(r.status ?? "")}</td>` +
                    `<td>${escapeHtml(r.priority ?? "")}</td>` +
                    `<td>${escapeHtml(r.assignee ?? "")}</td>` +
                    `<td>${escapeHtml(r.dueDate ?? "")}</td>` +
                    `<td>${escapeHtml(r.estimate ?? "")}</td>` +
                    `<td>${escapeHtml((r.description || "").toString())}</td>` +
                    '</tr>'
                  );
                })
                .join("");
              html += '</tbody></table>';
              html += '<script>function doPrint(){ try{ window.focus(); window.print(); }catch(e){ console.error(e); } } if(document.readyState==="complete"){ doPrint(); } else { window.addEventListener("load", doPrint); }</script>';
              html += '</body></html>';

              const newWindow = window.open("", "_blank", "noopener,noreferrer");
              if (newWindow) {
                newWindow.document.write(html);
                newWindow.document.close();
                // Notify user
                try {
                  newWindow.focus();
                } catch (e) {
                  // ignore
                }
                // print will be invoked by the page's onload handler
                toast({ title: "Preparing printable view...", description: "A printable view opened in a new tab. Use your browser Print -> Save as PDF." });
              } else {
                // Popup blocked — fallback to download HTML so user can open/save manually
                const blob = new Blob([html], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                window.open(url, "_blank");
                toast({ title: "Popup blocked", description: "Browser blocked opening a new tab. A printable HTML tab was opened instead." });
              }
            }}
          >
            <Printer className="mr-2 h-4 w-4" />
            PDF
          </Button>

          <div className="hidden lg:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-3 rounded-md text-sm">Templates</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuLabel>Import template</DropdownMenuLabel>
                {templates.map((tpl) => (
                  <DropdownMenuItem key={tpl.id} onClick={() => {
                    if (importTemplate) importTemplate(tpl.tasks as any);
                    toast({ title: `Imported ${tpl.name}`, description: tpl.description });
                  }}>
                    {tpl.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DataTableViewOptions table={table} />
          </div>
        </div>
      </div>
    </div>
  );
}

// small HTML escape util
function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
