import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { task, model, outputFormat } = await request.json();

    if (!task) {
      return NextResponse.json({ error: 'Task description is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is not configured' }, { status: 500 });
    }

    // Construct optimized prompt based on user input
    const systemPrompt = `You are an expert prompt engineer. Generate an optimized, production-ready prompt for the following task. The prompt should be clear, specific, and include all necessary context for an AI to complete the task successfully. Output format: ${outputFormat}.`;

    const userPrompt = `Task: ${task}\n\nGenerate an optimized prompt that will make an AI model complete this task effectively. Include any necessary constraints, output format specifications, and examples if relevant.`;

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
        temperature: 0.3,
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
