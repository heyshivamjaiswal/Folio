
import { llm } from './groq.llm.js';

export async function askLLM(context: string, question: string, usedWebFallback: boolean) {
  const fallbackNotice = usedWebFallback
    ? `\nNote: some or all of the context below came from a live web search because your saved content didn't have a strong match for this question. Clearly tell the user when you're relying on this general web result rather than their saved PDFs/articles/videos.\n`
    : '';

  const prompt = `You are an AI assistant answering questions using saved content from PDFs, web articles, and YouTube videos.

Each context block is labeled with its source (e.g. [PDF, page 3], [YouTube, 4:32], [Web search result: ...]).
${fallbackNotice}
Rules:
- Use ONLY the provided context to answer.
- When you state a fact, mention which source it came from.
- If sources disagree, say so explicitly rather than picking one silently.
- If context came from a web search fallback, say so plainly (e.g. "I couldn't find this in your saved content, but a web search suggests...").
- If the answer is not in the context, say: "I couldn't find that information."

Context:
${context}

Question:
${question}

Answer:`;

  const response = await llm.invoke(prompt);
  return response.content;
}