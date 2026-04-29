# AI Writing Assistant

An AI-powered productivity tool built with Next.js, TypeScript, and Tailwind CSS. Features include an AI Prompt Builder and Writing Assistant to help you create better content faster.

![GitHub stars](https://img.shields.io/github/stars/ayyushnegii/ai-writing-assistant?style=social)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

## 🚀 Features

### AI Prompt Builder
- Generate optimized prompts for any task
- Select from multiple AI models (OpenRouter supported)
- Choose output formats (Markdown, JSON, Plain Text)
- Copy prompts to clipboard with one click

### AI Writing Assistant
- Grammar & spelling correction
- Style improvement suggestions
- Content expansion and shortening
- Tone adjustment for professional communication
- Real-time AI-powered feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Dark Neon Theme)
- **AI Provider**: OpenRouter (supports 200+ models)
- **Deployment**: Vercel-ready

## 📦 Setup Instructions

### 1. Prerequisites
- Node.js 18+ (you have v22.22.2 installed)
- OpenRouter API key ([get one free here](https://openrouter.ai/keys))

### 2. Clone the repo
```bash
git clone https://github.com/ayyushnegii/ai-writing-assistant.git
cd ai-writing-assistant
```

### 3. Install dependencies (when you have good internet)
```bash
npm install
```

### 4. Configure environment variables
```bash
cp .env.example .env.local
```
Then edit `.env.local` and add your OpenRouter API key:
```
OPENROUTER_API_KEY=your_actual_api_key_here
```

### 5. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

This project is ready to deploy on Vercel:

1. Push your changes to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your `ai-writing-assistant` repository
4. Add the `OPENROUTER_API_KEY` environment variable
5. Deploy!

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key for AI model access |

## 🤝 Contributing

Contributions welcome! Feel free to open issues or pull requests.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built by [Ayush Negi](https://github.com/ayyushnegii) as part of his portfolio demonstrating AI workflow integration.
