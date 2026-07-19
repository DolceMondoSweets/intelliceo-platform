import "server-only";
import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-5";

export function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

export async function askClaude(
  client: Anthropic,
  system: string,
  userMessage: string,
  maxTokens = 2000
): Promise<string | null> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: userMessage }],
  });
  const block = message.content.find((b) => b.type === "text");
  return block && block.type === "text" ? block.text : null;
}

export async function askClaudeJson<T>(
  client: Anthropic,
  system: string,
  userMessage: string,
  maxTokens = 2000
): Promise<T | null> {
  const raw = await askClaude(client, system, userMessage, maxTokens);
  if (!raw) return null;

  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.split("```")[1];
    if (cleaned.startsWith("json")) cleaned = cleaned.slice(4);
    cleaned = cleaned.trim();
  }
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}
