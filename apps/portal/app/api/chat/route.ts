import { NextResponse } from "next/server";

import { type ChatMessage, runDemoAgent } from "../../_lib/demo-agent";

export async function POST(request: Request) {
  let body: { messages?: ChatMessage[] };

  try {
    body = (await request.json()) as { messages?: ChatMessage[] };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = body.messages?.filter(
    (message) =>
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim().length > 0,
  );

  if (!messages?.length) {
    return NextResponse.json({ error: "Add a message before sending." }, { status: 400 });
  }

  return NextResponse.json(runDemoAgent(messages.slice(-12)));
}
