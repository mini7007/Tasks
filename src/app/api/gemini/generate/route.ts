import { NextResponse } from "next/server";

type ReqBody = {
  tool?: string;
  prompt?: string;
  model?: string;
};

export async function POST(req: Request) {
  try {
    const body: ReqBody = await req.json();

    const promptText = (body.prompt || "").trim();
    if (!promptText) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Templates for the small tools
    let finalPrompt = promptText;
    switch (body.tool) {
      case "doc":
        finalPrompt = `Create a concise developer documentation entry from the following short description. Include purpose, example usage, and short code or command example where helpful. Output in markdown:\n\n${promptText}`;
        break;
      case "tasks":
        finalPrompt = `From the following description produce a short checklist / task breakdown (4-8 items) suitable for adding to a task list. Keep items action-oriented, with one-line descriptions:\n\n${promptText}`;
        break;
      case "seo":
        finalPrompt = `From the following short site description generate three short taglines and one concise meta description (max 155 characters):\n\n${promptText}`;
        break;
      default:
        finalPrompt = promptText;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let model = body.model || process.env.GEMINI_MODEL || "text-bison-001";
    // normalize model values so user can pass either 'gemini-2.0' or 'models/gemini-2.0'
    if (!model.startsWith("models/")) {
      model = `models/${model}`;
    }

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured in environment" }, { status: 500 });
    }

    // model already includes the 'models/' prefix after normalization
    const baseUrl = `https://generativelanguage.googleapis.com/v1beta2/${model}:generate`;

    // Google Cloud GenAI accepts either OAuth bearer token (Authorization) or API key (?key=)
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    let url = baseUrl;
    // If key looks like 'AIza' or 'AIza...' use query param; otherwise try Bearer token
    if (apiKey.startsWith("AIza")) {
      url = `${baseUrl}?key=${apiKey}`;
    } else {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const resp = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        prompt: { text: finalPrompt },
        temperature: 0.2,
        maxOutputTokens: 512,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      if (resp.status === 404) {
        return NextResponse.json({ error: `API error 404: model '${model}' not found. Confirm the model name and that your key has access.` }, { status: 404 });
      }
      return NextResponse.json({ error: `API error: ${resp.status} ${text}` }, { status: resp.status });
    }

    const data = await resp.json();

    let output = "";
    // Text responses can be under candidates[].output, candidates[].content, or output
    if (data?.candidates && Array.isArray(data.candidates) && data.candidates.length) {
      const pieces = data.candidates.map((c: any) => c.output || c.content || c.text || "").filter(Boolean);
      output = pieces.join("\n\n");
    } else if (data?.output && Array.isArray(data.output)) {
      output = data.output.map((o: any) => o.content || o.text || "").join("\n\n");
    } else if (typeof data?.content === "string") {
      output = data.content;
    } else {
      output = JSON.stringify(data);
    }

    return NextResponse.json({ output });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
