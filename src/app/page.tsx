import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-4xl text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          AI Writing Assistant
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Build, test, and optimize AI prompts. Get real-time writing assistance powered by state-of-the-art AI models.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Link 
            href="/prompt-builder"
            className="group p-8 bg-gray-900 border border-gray-800 rounded-xl hover:border-cyan-500 transition-all hover:shadow-[0_0_30px_rgba(0,243,255,0.1)]"
          >
            <div className="text-cyan-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-100 group-hover:text-cyan-400 transition-colors">
              Prompt Builder
            </h2>
            <p className="text-gray-400">
              Generate optimized AI prompts for any task. Select models, output formats, and get production-ready prompts.
            </p>
          </Link>

          <Link 
            href="/writing-assistant"
            className="group p-8 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-500 transition-all hover:shadow-[0_0_30px_rgba(157,0,255,0.1)]"
          >
            <div className="text-purple-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-100 group-hover:text-purple-400 transition-colors">
              Writing Assistant
            </h2>
            <p className="text-gray-400">
              Get AI-powered writing help: grammar fixes, style improvements, content expansion, and tone adjustments.
            </p>
          </Link>
        </div>

        <div className="mt-12 text-gray-500 text-sm">
          <p>Built with Next.js 15 • TypeScript • Tailwind CSS • OpenRouter AI</p>
        </div>
      </div>
    </main>
  );
}
