// LLM 对话：OpenAI 兼容 /chat/completions，SSE 流式输出
export async function streamChat({ messages, settings, signal, onDelta }) {
  const { baseUrl, apiKey, model, temperature, maxTokens } = settings.llm;
  if (!apiKey) throw new Error('未配置 API Key，请打开 ⚙ 设置 填写');
  const url = baseUrl.replace(/\/+$/, '') + '/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: Number(temperature) || 0.8,
      max_tokens: Number(maxTokens) || 1024,
      stream: true,
    }),
    signal,
  });
  if (!res.ok) {
    let detail = '';
    try { detail = await res.text(); } catch { /* ignore */ }
    throw new Error('HTTP ' + res.status + ' ' + detail.slice(0, 240));
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const j = JSON.parse(data);
        const delta = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
        if (typeof delta === 'string' && delta.length > 0) onDelta(delta);
      } catch { /* partial json */ }
    }
  }
}
