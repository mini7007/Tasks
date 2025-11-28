"use client";

import { useState } from "react";

export default function SeoHelper() {
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
                body: JSON.stringify({ tool: "seo", prompt: input }),
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
                <h3 className="text-sm font-semibold">SEO / Website blurb</h3>
                <span className="text-xs text-muted-foreground">Quick meta descriptions, taglines or hero copy</span>
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a short line about the page or site..."
                className="w-full rounded-md border px-2 py-2 text-sm mb-2"
            />

            <div className="flex items-center gap-2">
                <button
                    className="px-3 py-1.5 bg-primary text-white rounded-md disabled:opacity-50"
                    onClick={generate}
                    disabled={!input || loading}
                >
                    {loading ? "Generating…" : "Generate blurb"}
                </button>
                <div className="text-xs text-muted-foreground">Great for quick taglines or meta descriptions</div>
            </div>

            {output && (
                <div className="mt-3 rounded-md border bg-background p-3 text-sm whitespace-pre-wrap">
                    {output}
                </div>
            )}
        </div>
    );
}
