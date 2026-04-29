'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function WritingAssistant() {
  const [text, setText] = useState('');
  const [assistType, setAssistType] = useState('grammar');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const assistTypes = [
    { id: 'grammar', label: 'Grammar & Spelling' },
    { id: 'style', label: 'Style Improvement' },
    { id: 'expand', label: 'Expand Content' },
    { id: 'shorten', label: 'Shorten Content' },
    { id: 'tone', label: 'Adjust Tone' },
  ];

  const handleAssist = async () => {
    if (!text.trim()) {
      setError('Please enter some text to assist with');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/writing-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, assistType }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to get writing assistance');

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          AI Writing Assistant
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-medium">Your Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your text here..."
                className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-100 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none font-mono text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-medium">Assistance Type</label>
              <div className="grid grid-cols-2 gap-3">
                {assistTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setAssistType(type.id)}
                    className={`p-3 rounded-lg border transition-colors ${
                      assistType === type.id
                        ? 'border-cyan-500 bg-cyan-900/30 text-cyan-400'
                        : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleAssist}
              disabled={loading}
              className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Get AI Assistance'}
            </button>
          </div>

          {/* Result Section */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-purple-400">AI Suggestions</h2>
              {result && <CopyButton text={result} label="Copy Result" />}
            </div>
            {result ? (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-64 overflow-y-auto">
                <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                  {result}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-64 flex items-center justify-center">
                <p className="text-gray-500 italic">
                  Your AI-powered suggestions will appear here...
                </p>
              </div>
            )}

            {result && (
              <button
                onClick={() => {
                  setText(result);
                  setResult('');
                }}
                className="mt-4 w-full px-6 py-2 border border-purple-500 text-purple-400 hover:bg-purple-900/30 rounded-lg transition-colors"
              >
                Apply Suggestions to Editor
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
