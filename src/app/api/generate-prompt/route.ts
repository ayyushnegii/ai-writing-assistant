import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { task, model, outputFormat, language = 'en' } = await request.json();

    if (!task) {
      return NextResponse.json({ error: 'Task description is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is not configured' }, { status: 500 });
    }

    // Language mapping for prompts
    const languageNames: { [key: string]: string } = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ar': 'Arabic',
    };

    const languageName = languageNames[language] || 'English';

    // Construct optimized prompt — instruct AI to avoid AI-isms and use specified language
    const systemPrompt = `You are an expert prompt engineer. Generate an optimized, production-ready prompt for the following task.

CRITICAL: The prompt you generate must NOT sound like it was written by an AI. Avoid these AI clichés:
- "It is important to note that..."
- "In today's rapidly evolving world..."
- "As an AI language model..."
- "I hope this helps..."
- Excessive hedging ("might want to consider", "it could be beneficial")
- Overly formal/stilted language
- Repetitive sentence structures
- Buzzword overload (leverage, synergy, paradigm, etc.)

Instead, write like a human expert would:
- Be direct and concise
- Use natural, varied sentence structures
- Write at the appropriate skill level for the task
- Include specific, actionable instructions
- Use concrete examples when helpful
- Skip unnecessary preamble and postamble

Output format: ${outputFormat}.
Language: ${languageName}. Write the prompt in ${languageName}.`;

    const userPrompt = `Task: ${task}

Generate an optimized prompt that will make an AI model complete this task effectively. Write the prompt itself in a natural, human voice — not like an AI wrote it. The prompt should be in ${languageName}.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/ayyushnegii/ai-writing-assistant',
        'X-Title': 'AI Writing Assistant',
      },
      body: JSON.stringify({
        model: model || 'tencent/hy3-preview:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.5, // Slightly higher for more natural variation
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate prompt');
    }

    const generatedPrompt = data.choices[0]?.message?.content || 'No prompt generated';

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Prompt generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
