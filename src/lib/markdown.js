// 轻量 Markdown 渲染（够用的子集）
function inline(t) {
  return t
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

export function renderMarkdown(src) {
  if (!src) return '';
  let s = String(src)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // 代码块
  s = s.replace(/```([\s\S]*?)```/g, (_, code) => '<pre><code>' + code.trim() + '</code></pre>');
  // 行内代码（在段落里处理）
  const blocks = s.split(/\n{2,}/);
  return blocks.map((block) => {
    const b = block.trim();
    if (!b) return '';
    const heading = b.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const lvl = heading[1].length;
      return '<h' + lvl + '>' + inline(heading[2]) + '</h' + lvl + '>';
    }
    if (b.startsWith('- ') || b.startsWith('* ')) {
      const items = b.split(/\n/).filter((l) => l.trim()).map((l) => '<li>' + inline(l.replace(/^[-*]\s+/, '')) + '</li>');
      return '<ul>' + items.join('') + '</ul>';
    }
    if (/^\d+\.\s/.test(b)) {
      const items = b.split(/\n/).filter((l) => l.trim()).map((l) => '<li>' + inline(l.replace(/^\d+\.\s+/, '')) + '</li>');
      return '<ol>' + items.join('') + '</ol>';
    }
    const lines = b.split(/\n/).map((l) => inline(l));
    return '<p>' + lines.join('<br>') + '</p>';
  }).join('');
}

export function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
