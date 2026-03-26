import { llm } from './groq.llm.js';

export async function askLLM(context: string, question: string) {
  const prompt = `You are an AI assistant.

Use ONLY the provided context to answer the question.

If the answer is not in the context, say:
"I couldn't find that information in the saved content."
    context: 
    ${context}
    
    qustion:
    ${question}

    Answer:
    `;

  const response = await llm.invoke(prompt);
  return response.content;
}
