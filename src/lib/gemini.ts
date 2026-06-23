const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export function isGeminiConfigured(): boolean {
  return Boolean(GEMINI_API_KEY);
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
}

export async function callGemini(
  prompt: string,
  options: { json?: boolean } = {},
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Set VITE_GEMINI_API_KEY in your .env file.');
  }

  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  if (options.json) {
    body.generationConfig = { responseMimeType: 'application/json' };
  }

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    throw new Error(data.error?.message || `Gemini API error (${response.status})`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No response received from Gemini API.');
  }

  return text;
}

export async function callGeminiJson<T>(prompt: string): Promise<T> {
  const text = await callGemini(prompt, { json: true });
  return JSON.parse(text) as T;
}
