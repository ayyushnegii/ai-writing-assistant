'use client';

import { useState, useRef, useMemo } from 'react';
import CopyButton from '@/components/CopyButton';
import DownloadButton from '@/components/DownloadButton';

interface Version {
  id: number;
  text: string;
  result: string;
  assistType: string;
  timestamp: number;
}

// Calculate readability stats
function getStats(text: string) {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const charCount = text.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const avgWordLength = wordCount > 0 ? words.reduce((sum, w) => sum + w.length, 0) / wordCount : 0;
  
  // Simple syllable counter (approximate)
  const countSyllables = (word: string): number => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };
  
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const fleschKincaid = wordCount > 0 && sentenceCount > 0 ? 
    206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount) : 0;
  
  return { 
    wordCount, 
    charCount, 
    sentenceCount, 
    avgWordLength: avgWordLength.toFixed(1), 
    fleschKincaid: fleschKincaid.toFixed(1) 
  };
}

export default function WritingAssistant() {
  const [text, setText] = useState('');
  const [assistType, setAssistType] = useState('grammar');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [versions, setVersions] = useState<Version[]>([]);
  const [showVersions, setShowVersions] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Compute stats in real-time
  const stats = useMemo(() => getStats(text), [text]);

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

      // Save version
      const newVersion: Version = {
        id: Date.now(),
        text,
        result: data.result,
        assistType,
        timestamp: Date.now(),
      };
      setVersions(prev => [newVersion, ...prev].slice(0, 20)); // Keep last 20 versions

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    setText(result);
    setResult('');
  };

  const handleReject = () => {
    setResult('');
  };

  const handleRestoreVersion = (version: Version) => {
    setText(version.text);
    setResult(version.result);
    setShowVersions(false);
  };

  // Generate filename for download
  const getDownloadFilename = () => {
    const prefix = assistType === 'grammar' ? 'grammar_corrected' :
                   assistType === 'style' ? 'style_improved' :
                   assistType === 'expand' ? 'expanded' :
                   assistType === 'shorten' ? 'shortened' : 'tone_adjusted';
    return `${prefix}_${Date.now()}.txt`;
  };

  return (
    <main className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            AI Writing Assistant
          </h1>
          {versions.length > 0 && (
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
            >
              {showVersions ? 'Hide Versions' : `📋 Version History (${versions.length})`}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-800">
            {/* Stats Bar */}
            <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-gray-300">
                <div>
                  <span className="text-gray-500">Words:</span>
                  <span className="ml-1 font-medium">{stats.wordCount}</span>
                </div>
                <div>
                  <span className="text-gray-500">Chars:</span>
                  <span className="ml-1 font-medium">{stats.charCount}</span>
                </div>
                <div>
                  <span className="text-gray-500">Sentences:</span>
                  <span className="ml-1 font-medium">{stats.sentenceCount}</span>
                </div>
                <div>
                  <span className="text-gray-500">Avg Word:</span>
                  <span className="ml-1 font-medium">{stats.avgWordLength}</span>
                </div>
                <div>
                  <span className="text-gray-500">Readability:</span>
                  <span className={`ml-1 font-medium ${
                    parseFloat(stats.fleschKincaid) > 60 ? 'text-green-400' :
                    parseFloat(stats.fleschKincaid) > 30 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {stats.fleschKincaid}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Flesch-Kincaid score: higher = easier to read (60+ good, 30-60 medium, below 30 hard)
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-medium">Your Text</label>
              <textarea
                ref={textRef}
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
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-400 flex justify-between items-center">
                <span>{error}</span>
                <button
                  onClick={handleAssist}
                  className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            <button
              onClick={handleAssist}
              disabled={loading}
              className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Get AI Assistance'
              )}
            </button>
          </div>

          {/* Result Section - Before/After Comparison */}
          <div className="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-purple-400">AI Suggestions</h2>
              {result && (
                <div className="flex gap-2">
                  <CopyButton text={result} label="Copy Improved" />
                  <DownloadButton text={result} filename={getDownloadFilename()} label="Download .txt" />
                </div>
              )}
            </div>

            {result ? (
              <div className="space-y-4">
                {/* Comparison View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original Text */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Original</h3>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-64 overflow-y-auto">
                      <pre className="text-gray-400 whitespace-pre-wrap font-mono text-sm">
                        {text}
                      </pre>
                    </div>
                  </div>

                  {/* Improved Text */}
                  <div>
                    <h3 className="text-sm font-medium text-green-400 mb-2">Improved</h3>
                    <div className="bg-gray-800 rounded-lg p-4 border border-green-700 h-64 overflow-y-auto">
                      <pre className="text-gray-100 whitespace-pre-wrap font-mono text-sm">
                        {result}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-64 flex items-center justify-center">
                <p className="text-gray-500 italic">
                  Your AI-powered suggestions will appear here...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Version History Panel */}
        {showVersions && (
          <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-cyan-400">Version History</h3>
              <button
                onClick={() => setShowVersions(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-500 cursor-pointer transition-colors"
                  onClick={() => handleRestoreVersion(version)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm font-medium text-cyan-400">
                        {assistTypes.find(t => t.id === version.assistType)?.label || version.assistType}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(version.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDiff(!showDiff);
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {showDiff ? 'Hide Diff' : 'Show Diff'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {version.text.substring(0, 100)}...
                  </p>
                  {showDiff && (
                    <div className="mt-3 p-3 bg-gray-900 rounded border border-gray-700">
                      <div className="flex gap-4 text-xs">
                        <div className="flex-1">
                          <h4 className="text-gray-400 mb-1">Original:</h4>
                          <pre className="text-gray-500 whitespace-pre-wrap font-mono text-xs">
                            {version.text}
                          </pre>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-green-400 mb-1">Improved:</h4>
                          <pre className="text-gray-300 whitespace-pre-wrap font-mono text-xs">
                            {version.result}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
