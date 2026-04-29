'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function PromptBuilder() {
  const [task, setTask] = useState('');
  const [model, setModel] = useState('tencent/hy3-preview:free');
  const [outputFormat, setOutputFormat] = useState('Plain Text');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Test prompt states
  const [testResult, setTestResult] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState('');

  const outputFormats = ['Plain Text', 'Markdown', 'JSON', 'YAML'];

  const handleGenerate = async () => {
    if (!task.trim()) {
      setError('Please describe the task for the prompt');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedPrompt('');
    setTestResult('');
    setTestError('');

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, model, outputFormat }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to generate prompt');

      setGeneratedPrompt(data.prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTestPrompt = async () => {
    if (!generatedPrompt) return;

    setTestLoading(true);
    setTestError('');
    setTestResult('');

    try {
      const response = await fetch('/api/test-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: generatedPrompt, model }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to test prompt');

      setTestResult(data.response);
    } catch (err) {
      setTestError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          AI Prompt Builder
        </h1>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-medium">Task Description</label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Describe what you want the AI to do (e.g., 'Write a professional email to decline a meeting invitation')"
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-100 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">AI Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-cyan-500 outline-none"
              >
                <option value="tencent/hy3-preview:free">Tencent Hy3 (Free)</option>
                <option value="meta-llama/llama-3.1-8b-instruct:free">Llama 3.1 8B (Free)</option>
                <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Output Format</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-cyan-500 outline-none"
              >
                {outputFormats.map((fmt) => (
                  <option key={fmt} value={fmt}>{fmt}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Optimized Prompt'}
          </button>
        </div>

        {generatedPrompt && (
          <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cyan-400">Generated Prompt</h2>
              <CopyButton text={generatedPrompt} label="Copy Prompt" />
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 max-h-96 overflow-y-auto mb-4">
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                {generatedPrompt}
              </pre>
            </div>

            {/* Test Prompt Section */}
            <div className="border-t border-gray-800 pt-4">
              <button
                onClick={handleTestPrompt}
                disabled={testLoading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testLoading ? 'Testing...' : 'Test This Prompt'}
              </button>

              {testError && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-400">
                  {testError}
                </div>
              )}

              {testResult && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-purple-400">AI Response</h3>
                    <CopyButton text={testResult} label="Copy Response" />
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 max-h-96 overflow-y-auto">
                    <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                      {testResult}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
