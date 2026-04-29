import { NextRequest, NextResponse } from 'next/server';

const assistPrompts = {
  grammar: `You are an expert editor. Fix all grammar, spelling, and punctuation errors in the following text. Return only the corrected text without explanations.

CRITICAL: Your corrections must NOT sound like AI wrote them. Avoid these AI clichés:
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
- Maintain the original writer's voice and tone
- Don't add unnecessary flourishes or padding`,

  style: `You are a writing coach. Improve the writing style of the following text to make it more engaging, clear, and professional. Return only the improved text.

CRITICAL: Your improvements must NOT sound like AI wrote them. Avoid these AI clichés:
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
- Maintain the original writer's voice and tone
- Don't add unnecessary flourishes or padding`,

  expand: `You are a content expander. Expand the following text with more details, examples, and context while maintaining the original meaning. Return the expanded text.

CRITICAL: Your expansion must NOT sound like AI wrote it. Avoid these AI clichés:
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
- Add concrete, specific details
- Don't pad with generic statements`,

  shorten: `You are a content editor. Shorten the following text while preserving all key information and meaning. Return the concise version.

CRITICAL: Your shortened version must NOT sound like AI wrote it. Avoid these AI clichés:
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
- Cut fluff, keep substance
- Maintain the original writer's voice`,

  tone: `You are a tone adjuster. Adjust the tone of the following text to be professional and appropriate for business communication. Return the adjusted text.

CRITICAL: Your adjustments must NOT sound like AI wrote them. Avoid these AI clichés:
- "It is important to note that..."
- "In today's rapidly evolving world..."
- "As an AI language model..."
- "I hope this helps..."
- Excessive hedging ("might want to consider", "it could be beneficial")
- Overly formal/stilted language
- Repetitive sentence structures
- Buzzword overload (leverage, synergy, paradigm, etc.)

Instead, write like a human professional would:
- Be direct and concise
- Use natural, varied sentence structures
- Sound like a real person, not a bot
- Maintain authenticity while adjusting tone`,
};

export async function POST(request: NextRequest) {
  try {
    const { text, assistType } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is not configured' }, { status: 500 });
    }

    const systemPrompt = assistPrompts[assistType as keyof typeof assistPrompts] || assistPrompts.grammar;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/ayyushnegii/ai-writing-assistant',
        'X-Title': 'AI Writing Assistant',
      },
      body: JSON.stringify({
        model: 'tencent/hy3-preview:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        temperature: 0.5, // Slightly higher for more natural variation
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get writing assistance');
    }

    const result = data.choices[0]?.message?.content || 'No result generated';

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Writing assistance error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
