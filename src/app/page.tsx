export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          AI Writing Assistant
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Build, test, and optimize AI prompts. Get writing assistance powered by state-of-the-art models.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors">
            Try Prompt Builder
          </button>
          <button className="px-6 py-3 border border-purple-500 text-purple-400 hover:bg-purple-900/30 font-medium rounded-lg transition-colors">
            Writing Assistant
          </button>
        </div>
      </div>
    </main>
  );
}
