// 设置管理：与主进程 data/settings.json 同步
export const DEFAULTS = {
  llm: {
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com',
    customBaseUrl: false,
    apiKey: '',
    model: 'deepseek-chat',
    temperature: 0.8,
    maxTokens: 1024,
  },
  tts: {
    provider: 'web',
    baseUrl: 'https://api.openai.com/v1',
    customBaseUrl: false,
    apiKey: '',
    model: 'tts-1',
    voice: '',
    language: 'zh',
    rate: 1.0,
    autoPlay: true,
  },
  stt: {
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    customBaseUrl: false,
    apiKey: '',
    model: 'whisper-1',
    language: 'zh',
  },
  behavior: {
    greetingOnLoad: true,
    autoScroll: true,
  },
  theme: {
    primary: '#ff7eb3',
    secondary: '#38b0de',
  },
};

export function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source || {})) {
    if (
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key]) &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      out[key] = deepMerge(target[key], source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

let settings = deepMerge(DEFAULTS, {});

export function getSettings() {
  return settings;
}

export async function loadSettings() {
  settings = deepMerge(DEFAULTS, (await window.api.getSettings()) || {});
  return settings;
}

export async function saveSettings(next) {
  settings = deepMerge(DEFAULTS, next || {});
  await window.api.setSettings(settings);
  return settings;
}
