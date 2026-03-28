// ============================================================
// API KEY TESTER — Development-only diagnostic component
// ============================================================
// Floating panel in the bottom-right corner that lets the
// developer test the AI API key without opening a full chat.
// Hidden automatically in production builds.
// ============================================================

import React, { useState } from 'react';
import { getAgentResponse } from '../../api/mock/agents/agentEngine';

// Only render in development mode
const isDev = import.meta.env.DEV;

// Read current configuration
const provider = import.meta.env.VITE_AI_PROVIDER || 'gemini';
const keyMap = {
  gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
  openai: import.meta.env.VITE_OPENAI_API_KEY || '',
  groq:   import.meta.env.VITE_GROQ_API_KEY || '',
};
const currentKey = keyMap[provider] || '';
const hasKey = currentKey.length > 0;
const keyPrefix = hasKey ? currentKey.substring(0, 8) + '...' : '(empty)';

export default function ApiKeyTester() {
  // Don't render anything in production
  if (!isDev) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [testState, setTestState] = useState('idle'); // idle | loading | success | error
  const [testResult, setTestResult] = useState(null);

  // ── Run API Test ─────────────────────────────────────────
  const runTest = async () => {
    // Quick check: is key missing?
    if (!hasKey) {
      setTestState('error');
      setTestResult({
        errorType: 'Missing Key',
        errorMessage: `No API key found for provider "${provider}".`,
        fix: `Open client/.env and add your key to VITE_${provider.toUpperCase()}_API_KEY. Then restart the dev server: npm run dev`,
      });
      return;
    }

    setTestState('loading');
    setTestResult(null);

    const startTime = performance.now();

    try {
      const response = await getAgentResponse('study', 'Hello! Just a quick test.', []);
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      // Check if it returned a fallback error message
      if (response.isError) {
        setTestState('error');
        setTestResult({
          errorType: 'API Call Failed',
          errorMessage: response.errorDetail || response.message,
          fix: `Check that VITE_${provider.toUpperCase()}_API_KEY in your .env file is correct. Restart the dev server after updating .env.`,
        });
        return;
      }

      // Success!
      setTestState('success');
      setTestResult({
        provider: provider,
        responseTime: responseTime,
        preview: response.message.substring(0, 120) + (response.message.length > 120 ? '...' : ''),
      });
    } catch (error) {
      const endTime = performance.now();
      setTestState('error');

      // Parse error type from error message
      let errorType = 'Unknown Error';
      let fix = 'Check your internet connection and API key.';

      const errMsg = error.message || String(error);

      if (errMsg.includes('MISSING_KEY')) {
        errorType = 'Missing Key';
        fix = `Open client/.env and add your key to VITE_${provider.toUpperCase()}_API_KEY. Then restart the dev server: npm run dev`;
      } else if (errMsg.includes('INVALID_KEY') || errMsg.includes('403') || errMsg.includes('401')) {
        errorType = 'Invalid API Key';
        fix = `Check that VITE_${provider.toUpperCase()}_API_KEY in your .env file matches the key from the provider. Restart the dev server after updating .env.`;
      } else if (errMsg.includes('RATE_LIMIT') || errMsg.includes('429')) {
        errorType = 'Rate Limit';
        fix = "You've hit the rate limit. Wait 1 minute and try again. The free tier allows 15 requests per minute.";
      } else if (errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError')) {
        errorType = 'Network Error';
        fix = 'Cannot reach the API. Check your internet connection. Also verify the API endpoint URL is correct.';
      }

      setTestResult({
        errorType,
        errorMessage: errMsg,
        fix,
      });
    }
  };

  // ── Collapsed state: small pill button ───────────────────
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-full border border-green-700 shadow-2xl hover:bg-gray-800 transition-all duration-300 text-sm font-medium flex items-center gap-2"
      >
        🔑 Test API Key
      </button>
    );
  }

  // ── Expanded panel ───────────────────────────────────────
  return (
    <div className="fixed bottom-5 right-5 z-50 w-[380px] bg-gray-900 border border-green-700 rounded-xl shadow-2xl transition-all duration-300 ease-in-out overflow-hidden">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm">API Key Diagnostic Tool</h3>
          <p className="text-gray-500 text-xs">Development only — hidden in production</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-white transition-colors p-1"
        >
          ✕
        </button>
      </div>

      <div className="px-4 py-3 space-y-3">

        {/* ── Status Row ──────────────────────────────────── */}
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${provider ? 'bg-blue-400' : 'bg-gray-500'}`} />
            <span className="text-gray-400">Provider:</span>
            <span className="text-white font-medium">{provider}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${hasKey ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-gray-400">Key set:</span>
            <span className={hasKey ? 'text-green-400' : 'text-red-400'}>{hasKey ? '✅ Yes' : '❌ No'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            <span className="text-gray-400">Key prefix:</span>
            <span className="text-gray-300 font-mono text-xs">{keyPrefix}</span>
          </div>
        </div>

        {/* ── Test Button ─────────────────────────────────── */}
        <button
          onClick={runTest}
          disabled={testState === 'loading'}
          className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
            testState === 'loading'
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-500 active:scale-[0.98]'
          }`}
        >
          {testState === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Testing...
            </span>
          ) : (
            'Run API Test'
          )}
        </button>

        {/* ── Test Result Area ─────────────────────────────── */}
        {testState === 'success' && testResult && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 space-y-2">
            <p className="text-green-400 font-bold text-sm">✅ API Key is working!</p>
            <div className="text-xs space-y-1">
              <p className="text-gray-300">
                <span className="text-gray-500">Provider:</span> {testResult.provider}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-500">Response time:</span> {testResult.responseTime}ms
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
              <p className="text-green-300 font-mono text-xs break-words">{testResult.preview}</p>
            </div>
            <p className="text-green-400 text-xs font-medium">Your AI assistants are ready to use. 🎉</p>
          </div>
        )}

        {testState === 'error' && testResult && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 space-y-2">
            <p className="text-red-400 font-bold text-sm">❌ API Key Test Failed</p>
            <div className="text-xs space-y-1">
              <p className="text-gray-300">
                <span className="text-gray-500">Error:</span> {testResult.errorType}
              </p>
              <p className="text-gray-400 break-words">{testResult.errorMessage}</p>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-2">
              <p className="text-yellow-400 text-xs">💡 {testResult.fix}</p>
            </div>
          </div>
        )}

        {testState === 'idle' && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
            <p className="text-gray-300 text-xs text-center">
              Click "Run API Test" to verify your API key works.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
