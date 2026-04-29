'use client';

import { useState, useEffect } from 'react';
import CopyButton from '@/components/CopyButton';
import DownloadButton from '@/components/DownloadButton';
import Spinner from '@/components/Spinner';

interface HistoryItem {
  task: string;
  prompt: string;
  model: string;
  outputFormat: string;
  timestamp: number;
}

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

  // History states
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const outputFormats = ['Plain Text', 'Markdown', 'JSON', 'YAML'];

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('promptHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as HistoryItem[];
        setHistory(parsed);
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('promptHistory', JSON.stringify(newHistory));
  };

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

      // Add to history (max 10)
      const newItem: HistoryItem = {
        task,
        prompt: data.prompt,
        model,
        outputFormat,
        timestamp: Date.now(),
      };
      const newHistory = [newItem, ...history].slice(0, 10);
      saveHistory(newHistory);
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

  const handleHistoryClick = (item: HistoryItem) => {
    setTask(item.task);
    setModel(item.model);
    setOutputFormat(item.outputFormat);
    setGeneratedPrompt(item.prompt);
    setTestResult('');
    setTestError('');
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  // Generate filename for downloads
  const getPromptFilename = () => {
    const safeTask = task.substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `prompt_${safeTask || 'generated'}_${Date.now()}.txt`;
  };

  const getTestResultFilename = () => {
    const safeTask = task.substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `test_result_${safeTask || 'generated'}_${Date.now()}.txt`;
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
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-400 flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={handleGenerate}
                className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Spinner />}
            {loading ? 'Generating...' : 'Generate Optimized Prompt'}
          </button>

          {/* History Section */}
          {history.length > 0 && (
            <div className="mt-6 border-t border-gray-800 pt-4">
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-gray-300 hover:text-cyan-400 font-medium transition-colors"
                >
                  {showHistory ? '▼' : '▶'} Prompt History ({history.length})
                </button>
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {showHistory && (
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {history.map((item, index) => (
                    <div
                      key={item.timestamp}
                      onClick={() => handleHistoryClick(item)}
                      className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-500 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-300 truncate flex-1">
                          {item.task}
                        </p>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.model.split('/').pop()} • {item.outputFormat}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading Skeleton for Generated Prompt */}
        {loading && (
          <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {generatedPrompt && !loading && (
          <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cyan-400">Generated Prompt</h2>
              <div className="flex gap-2">
                <CopyButton text={generatedPrompt} label="Copy Prompt" />
                <DownloadButton text={generatedPrompt} filename={getPromptFilename()} label="Download .txt" />
              </div>
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
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {testLoading && <Spinner />}
                {testLoading ? 'Testing...' : 'Test This Prompt'}
              </button>

              {testError && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-400 flex justify-between items-center">
                  <span>{testError}</span>
                  <button
                    onClick={handleTestPrompt}
                    className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Loading skeleton for test result */}
              {testLoading && (
                <div className="mt-4 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-1/6 mb-2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              )}

              {testResult && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-purple-400">AI Response</h3>
                    <div className="flex gap-2">
                      <CopyButton text={testResult} label="Copy Response" />
                      <DownloadButton text={testResult} filename={getTestResultFilename()} label="Download .txt" />
                    </div>
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
