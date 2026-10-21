import DOMPurify from "dompurify";

export function renderMarkdown(content) {
  const html = content
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
    .replace(/`(.*?)`/gim, "<code>$1</code>")
    .replace(/\[([^\]\n]+)\]\(([^\s)]+)\)/g, (match, label, rawUrl) => {
      try {
        const url = new URL(rawUrl);
        if (url.protocol !== "https:" && url.protocol !== "http:") return match;
        const href = rawUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      } catch {
        return match;
      }
    })
    .replace(/\n/gim, "<br>");

  return DOMPurify.sanitize(html);
}
