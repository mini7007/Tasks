"use client";

import { useState } from "react";

export default function TaskSuggester() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function generate() {
        setOutput(null);
        setLoading(true);
        try {
            const res = await fetch("/api/gemini/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tool: "tasks", prompt: input }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Generation failed");
            setOutput(data.output ?? "");
        } catch (err: any) {
            setOutput("Error: " + (err.message || String(err)));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-lg border p-4 shadow-sm bg-card">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Task ideas & templates</h3>
                <span className="text-xs text-muted-foreground">Generate task breakdowns or a checklist</span>
            </div>

            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe the feature or goal and I'll suggest tasks..."
                className="w-full min-h-[56px] rounded-md border px-2 py-2 text-sm mb-2"
            />

            <div className="flex items-center gap-2">
                <button
                    className="px-3 py-1.5 bg-primary text-white rounded-md disabled:opacity-50"
                    onClick={generate}
                    disabled={!input || loading}
                >
                    {loading ? "Thinking…" : "Suggest tasks"}
                </button>
                <div className="text-xs text-muted-foreground">Useful to quickly generate subtasks or checklists</div>
            </div>

            {output && (
                <div className="mt-3 rounded-md border bg-background p-3 text-sm whitespace-pre-wrap">
                    {output}
                </div>
            )}
        </div>
    );
}
