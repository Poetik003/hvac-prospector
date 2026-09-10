// ProSpector Level A — single Netlify Function that handles 3 actions:
//   POST /.netlify/functions/voice  { action: "warmup" }
//   POST /.netlify/functions/voice  { action: "chat",    persona, history, lead, model }
//   POST /.netlify/functions/voice  { action: "tts",     text, voice_id, model_id }
//
// Reads OPENAI_API_KEY and ELEVENLABS_API_KEY from Netlify environment variables
// (managed at https://app.netlify.com/projects/prospectorproai/configuration/env).

const OPENAI_URL    = 'https://api.openai.com/v1/chat/completions';
const ELEVEN_URL    = 'https://api.elevenlabs.io/v1/text-to-speech';
const CLAUDE_URL    = 'https://api.anthropic.com/v1/messages';
const CLAUDE_VER    = '2023-06-01';
const OPTS          = { headers: () => ({ 'Content-Type': 'application/json' }) };

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function ok(body){      return { statusCode: 200, headers: { ...CORS, 'Content-Type':'application/json' }, body: JSON.stringify(body) }; }
function err(code, e){  return { statusCode: code, headers: CORS, body: JSON.stringify({ error: e?.message || String(e) }) }; }

async function warmup(){
  const out = { openai: 'unknown', claude: 'unknown', elevenlabs: 'unknown', ts: Date.now() };
  try {
    const r = await fetch('https://api.openai.com/v1/models', { headers: { 'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY } });
    out.openai = r.ok ? 'ok' : ('http_' + r.status);
  } catch (e) { out.openai = 'network_error'; }
  try {
    const r = await fetch('https://api.anthropic.com/v1/models', {
      headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY || '', 'anthropic-version': CLAUDE_VER }
    });
    out.claude = r.ok ? 'ok' : ('http_' + r.status);
  } catch (e) { out.claude = 'network_error'; }
  try {
    const r = await fetch(ELEVEN_URL + '/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type':'application/json' },
      body: JSON.stringify({ text:'ping', model_id:'eleven_turbo_v2_5' })
    });
    out.elevenlabs = r.ok ? 'ok' : ('http_' + r.status);
  } catch (e) { out.elevenlabs = 'network_error'; }
  out.ready = out.claude === 'ok' || out.openai === 'ok' || out.elevenlabs === 'ok';
  return ok(out);
}

async function chat(payload){
  const { persona, history = [], lead, model } = payload || {};
  const provider = (payload.provider || 'auto') === 'auto'
    ? (process.env.ANTHROPIC_API_KEY ? 'claude' : 'openai')
    : payload.provider;

  const leadCtx  = lead ? `You are calling ${lead.contact || 'the prospect'} (${lead.title || ''}) at ${lead.company} in ${lead.city || ''}. They work in ${lead.industry || 'their industry'}. Lead score: ${lead.score || 'n/a'}.` : '';
  const system   = (persona?.prompt || 'You are a helpful outbound sales assistant. Be concise, under 50 words per turn, and ask one question at a time.') + (leadCtx ? '\n\n' + leadCtx : '') + '\n\nStay in character. Never break the fourth wall. Keep replies under 50 words. Ask one question per turn.';
  const userText = payload.user || '(the prospect has not said anything yet — open the call)';

  if (provider === 'claude'){
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set in Netlify env vars');
    let msgs = history
      .filter(h => h.role === 'user' || h.role === 'assistant')
      .map(h => ({ role: h.role, content: String(h.content || '') }));
    msgs.push({ role: 'user', content: userText });
    // Anthropic requires strictly alternating user/assistant — merge adjacent duplicates.
    const merged = [];
    for (const m of msgs){
      const last = merged[merged.length - 1];
      if (last && last.role === m.role) last.content += '\n\n' + m.content;
      else merged.push({ ...m });
    }
    const r = await fetch(CLAUDE_URL, {
      method: 'POST',
      headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': CLAUDE_VER, 'Content-Type': 'application/json' },
      // Sonnet 5: adaptive thinking always on — do NOT pass temperature/top_p/top_k (returns 400).
      body: JSON.stringify({ model: model || 'claude-sonnet-4-6', max_tokens: 200, system, messages: merged })
    });
    if (!r.ok){
      const t = await r.text();
      throw new Error('Claude HTTP ' + r.status + ': ' + t.slice(0, 200));
    }
    const j = await r.json();
    const reply = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    return ok({ reply, model: j.model, usage: j.usage });
  }

  // default: OpenAI
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set in Netlify env vars');
  const messages = [
    { role: 'system', content: system },
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user',   content: userText }
  ];
  const r = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { ...OPTS.headers(), 'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY },
    body: JSON.stringify({ model: model || 'gpt-4o-mini', messages, temperature: 0.7, max_tokens: 200 })
  });
  if (!r.ok){
    const t = await r.text();
    throw new Error('OpenAI HTTP ' + r.status + ': ' + t.slice(0, 200));
  }
  const j = await r.json();
  return ok({ reply: j.choices?.[0]?.message?.content?.trim() || '', model: j.model, usage: j.usage });
}

async function tts(payload){
  if (!process.env.ELEVENLABS_API_KEY) throw new Error('ELEVENLABS_API_KEY not set in Netlify env vars');
  const { text, voice_id = '21m00Tcm4TlvDq8ikWAM', model_id = 'eleven_turbo_v2_5' } = payload || {};
  if (!text) throw new Error('text is required');

  const r = await fetch(`${ELEVEN_URL}/${voice_id}`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type':'application/json', 'Accept':'audio/mpeg' },
    body: JSON.stringify({
      text,
      model_id,
      voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.35, use_speaker_boost: true }
    })
  });
  if (!r.ok){
    const t = await r.text();
    throw new Error('ElevenLabs HTTP ' + r.status + ': ' + t.slice(0, 200));
  }
  const buf   = Buffer.from(await r.arrayBuffer());
  const b64   = buf.toString('base64');
  return ok({ audio_base64: b64, mime: 'audio/mpeg', size: buf.length });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return err(405, 'POST only');

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch(e){ return err(400, 'invalid JSON'); }

  try {
    switch (body.action) {
      case 'warmup': return await warmup();
      case 'chat':   return await chat(body);
      case 'tts':    return await tts(body);
      default:       return err(400, 'unknown action: ' + body.action);
    }
  } catch (e) {
    return err(500, e.message || String(e));
  }
};
