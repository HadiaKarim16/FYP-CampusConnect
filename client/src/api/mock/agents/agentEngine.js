// ============================================================
// AGENT ENGINE — Real AI API Integration
// ============================================================
//
// TEMPORARY: Direct browser-to-API calls for development.
// When backend is ready, replace this entire file with:
//
//   import axiosInstance from '../../axios';
//   export const getAgentResponse = async (agentType, userMessage, conversationHistory) => {
//     const response = await axiosInstance.post(
//       `/api/agents/${agentType}/chat`,
//       { message: userMessage, history: conversationHistory }
//     );
//     return { message: response.data.response, followUps: [] };
//   };
//
// At that point:
//   → Remove VITE_GEMINI_API_KEY from client/.env
//   → Add GEMINI_API_KEY to server/.env
//   → The API key is now secure on the server
//   → No other files need to change
//
// ── SETUP INSTRUCTIONS ──────────────────────────────────────
//  1. Get a free Gemini API key:
//     → Go to aistudio.google.com
//     → Sign in with Google account
//     → Click "Get API Key" → "Create API key in new project"
//     → Copy the key (starts with "AIzaSy...")
//
//  2. Open client/.env and paste your key:
//     VITE_GEMINI_API_KEY=AIzaSy...your_key_here
//     VITE_AI_PROVIDER=gemini
//
//  3. Restart the dev server:  npm run dev
//
//  4. Open any agent page:
//     http://localhost:5173/student/agents/study
//
//  5. Look for the "🔑 Test API Key" button (bottom-right)
//
//  6. Click it → "Run API Test"
//     → GREEN = API key working, assistants are live
//     → RED   = see the error message for fix instructions
//
//  7. If test passes, send a message to the Study Assistant
//     → You should get a real AI response within 2 seconds
// ============================================================

import { SYSTEM_PROMPTS } from './systemPrompts';

// ── Configuration ────────────────────────────────────────────
const provider = import.meta.env.VITE_AI_PROVIDER || 'gemini';
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const GROQ_KEY   = import.meta.env.VITE_GROQ_API_KEY || '';

// ── Fallback messages (shown when API fails) ─────────────────
const FALLBACK_MESSAGES = {
  study: "I'm having trouble connecting right now. Please try again in a moment! Quick tip while you wait: try writing down the 3 most important things you need to study today.",
  mentor: "I'm temporarily unavailable. Please try again shortly. Quick action: open LinkedIn and update your headline while you wait — it takes 2 minutes and makes a big difference!",
  wellbeing: "I'm having a brief connection issue. Please try again. While you wait, try this: take 3 slow deep breaths. Breathe in for 4 counts, hold for 4, out for 4. 💙",
  feedback: "I'm temporarily unavailable. Please try again in a moment. Your feedback is important to us!",
};

// ============================================================
// MAIN EXPORT — getAgentResponse
// ============================================================
// Same signature as the old mock engine so nothing else changes.
// Returns: { message: string, followUps: string[] }
// ============================================================
export const getAgentResponse = async (agentType, userMessage, conversationHistory) => {
  const systemPrompt = SYSTEM_PROMPTS[agentType];
  if (!systemPrompt) {
    return { message: "Unknown agent type.", followUps: [] };
  }

  // ── Typing delay + API call run in parallel ──────────────
  // The delay ensures the UI "typing" indicator shows for at
  // least 600-1200ms even if the API responds instantly.
  const minDelay = 600;
  const maxDelay = 1200;
  const typingDelay = minDelay + Math.random() * (maxDelay - minDelay);

  try {
    const [response] = await Promise.all([
      callProvider(systemPrompt, conversationHistory, userMessage),
      new Promise(resolve => setTimeout(resolve, typingDelay)),
    ]);

    return {
      message: response,
      followUps: [],
    };
  } catch (error) {
    console.error(`[AgentEngine] ${provider} API error:`, error);
    return {
      message: FALLBACK_MESSAGES[agentType] || FALLBACK_MESSAGES.study,
      followUps: [],
      isError: true,
      errorDetail: error.message || String(error),
    };
  }
};

// ============================================================
// PROVIDER ROUTER
// ============================================================
async function callProvider(systemPrompt, history, userMessage) {
  switch (provider) {
    case 'openai':
      return callOpenAIFormat(
        'https://api.openai.com/v1/chat/completions',
        OPENAI_KEY,
        'gpt-4o-mini',
        systemPrompt,
        history,
        userMessage
      );
    case 'groq':
      return callOpenAIFormat(
        'https://api.groq.com/openai/v1/chat/completions',
        GROQ_KEY,
        'llama-3.3-70b-versatile',
        systemPrompt,
        history,
        userMessage
      );
    case 'gemini':
    default:
      return callGemini(systemPrompt, history, userMessage);
  }
}

// ============================================================
// GEMINI PROVIDER
// ============================================================
async function callGemini(systemPrompt, history, userMessage) {
  if (!GEMINI_KEY) {
    throw new Error('MISSING_KEY: No Gemini API key found. Add VITE_GEMINI_API_KEY to client/.env');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`;

  // Build conversation contents for Gemini format
  const contents = [];

  // Map conversation history (skip welcome messages, only user/agent)
  if (history && history.length > 0) {
    for (const msg of history) {
      if (msg.role === 'user') {
        contents.push({ role: 'user', parts: [{ text: msg.content }] });
      } else if (msg.role === 'agent') {
        contents.push({ role: 'model', parts: [{ text: msg.content }] });
      }
      // Skip any other roles (system, etc.)
    }
  }

  // Add the new user message
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600,
      topP: 0.9,
    },
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const status = res.status;
    let errorBody = '';
    try { errorBody = await res.text(); } catch(e) { /* ignore */ }
    console.error(`[Gemini] Status ${status}:`, errorBody);
    if (status === 400) throw new Error(`BAD_REQUEST: Invalid request format. ${errorBody}`);
    if (status === 403) throw new Error(`INVALID_KEY: Your Gemini API key is invalid or expired. ${errorBody}`);
    if (status === 429) throw new Error('RATE_LIMIT: Too many requests. Wait a minute and try again');
    throw new Error(`API_ERROR: Gemini returned status ${status}. ${errorBody}`);
  }

  const data = await res.json();

  // Extract the response text
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('EMPTY_RESPONSE: Gemini returned an empty response');
  }

  return text;
}

// ============================================================
// OPENAI-FORMAT PROVIDER (shared by OpenAI and Groq)
// ============================================================
// OpenAI and Groq use the same API format — only the endpoint,
// API key, and model name differ.
// ============================================================
async function callOpenAIFormat(endpoint, apiKey, model, systemPrompt, history, userMessage) {
  if (!apiKey) {
    const providerName = endpoint.includes('groq') ? 'Groq' : 'OpenAI';
    const envVar = endpoint.includes('groq') ? 'VITE_GROQ_API_KEY' : 'VITE_OPENAI_API_KEY';
    throw new Error(`MISSING_KEY: No ${providerName} API key found. Add ${envVar} to client/.env`);
  }

  // Build messages array for OpenAI/Groq chat format
  const messages = [
    { role: 'system', content: systemPrompt },
  ];

  // Map conversation history
  if (history && history.length > 0) {
    for (const msg of history) {
      if (msg.role === 'user') {
        messages.push({ role: 'user', content: msg.content });
      } else if (msg.role === 'agent') {
        messages.push({ role: 'assistant', content: msg.content });
      }
      // Skip any other roles
    }
  }

  // Add the new user message
  messages.push({ role: 'user', content: userMessage });

  const body = {
    model,
    messages,
    max_tokens: 600,
    temperature: 0.7,
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const status = res.status;
    const providerName = endpoint.includes('groq') ? 'Groq' : 'OpenAI';
    if (status === 401) throw new Error(`INVALID_KEY: Your ${providerName} API key is invalid`);
    if (status === 403) throw new Error(`INVALID_KEY: Your ${providerName} API key is forbidden`);
    if (status === 429) throw new Error('RATE_LIMIT: Too many requests. Wait a minute and try again');
    throw new Error(`API_ERROR: ${providerName} returned status ${status}`);
  }

  const data = await res.json();

  // Extract the response text
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('EMPTY_RESPONSE: Provider returned an empty response');
  }

  return text;
}
