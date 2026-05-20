

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL          = 'openai/gpt-oss-120b:free';

async function callOpenRouter(systemPrompt, userMessage) {
  const response = await fetch(OPENROUTER_URL, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer':  'http://localhost:5173',
      'X-Title':       'BrandFlow',
    },
    body: JSON.stringify({
      model:    MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage  },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error('OpenRouter API error:', err);
    throw new Error('AI service error — please try again.');
  }

  const data = await response.json();
  const raw  = data.choices?.[0]?.message?.content ?? '{}';

  try {
    return JSON.parse(raw.replace(/```json\n?|```/g, '').trim());
  } catch {
    console.error('OpenRouter JSON parse error. Raw:', raw);
    throw new Error('Failed to parse AI response.');
  }
}

// ── Generate posts ────────────────────────────────────────────
async function generatePosts({ platform, topic, tone }) {
  const charLimit = platform === 'twitter' ? 'Each post must be under 280 characters.' : '';
  return callOpenRouter(
    `You are a social media content expert.
Return ONLY valid JSON — no markdown, no preamble, no explanation.
Format: {"posts":[{"content":"text","hashtags":["a","b","c"],"best_time":"Day H:mmam","angle":"angle"}]}
Platform: ${platform}. ${charLimit}
Generate exactly 3 posts: storytelling, value-driven, engagement-hook.`,
    `Write 3 ${tone.toLowerCase()} ${platform} posts about: "${topic.trim()}"`
  );
}

// ── Repurpose content ─────────────────────────────────────────
async function repurposeContent({ content, sourcePlatform, tone }) {
  return callOpenRouter(
    `You are a social media content expert.
Return ONLY valid JSON — no markdown, no preamble, no explanation.
Format: {"repurposed":[{"platform":"id","content":"adapted text","hashtags":["a","b"],"changes":"what changed in one phrase"}]}
Adapt for all platforms except ${sourcePlatform}: instagram, twitter, linkedin, facebook.
Rules: twitter max 280 chars. linkedin professional and longer. instagram casual with visual cues. facebook conversational.`,
    `Adapt this ${sourcePlatform} post for all other platforms (${tone} tone):\n\n"${content.trim()}"`
  );
}

// ── Predict post performance ──────────────────────────────────
async function predictPost({ content, platform, scheduledTime }) {
  return callOpenRouter(
    `You are a social media performance analyst.
Return ONLY valid JSON — no markdown, no preamble, no explanation.
Format: {"score":{"overall":82,"hook":75,"timing":88,"hashtags":70,"readability":90,"verdict":"One sentence verdict.","tips":["tip1","tip2","tip3"]}}
Score each 0-100. overall = weighted average. tips = 3 specific actionable improvements.
Consider platform: ${platform}. Timing: ${scheduledTime}.`,
    `Score this ${platform} post:\n\n"${content.trim()}"`
  );
}

module.exports = { generatePosts, repurposeContent, predictPost };