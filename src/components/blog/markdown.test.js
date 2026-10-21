import { renderMarkdown } from "./markdown";

test("renders a safe external link for a README section", () => {
  const html = renderMarkdown("[Data and privacy](https://github.com/xelvhk/vasya_ai/blob/main/README.md#data-and-privacy)");
  expect(html).toContain('href="https://github.com/xelvhk/vasya_ai/blob/main/README.md#data-and-privacy"');
  expect(html).toContain('rel="noopener noreferrer"');
});

test("does not create a javascript link", () => {
  const html = renderMarkdown("[bad](javascript:alert)");
  expect(html).not.toContain("<a ");
});

test("sanitizes HTML inside a link label", () => {
  const html = renderMarkdown("[<img src=x onerror=alert(1)>](https://example.com)");
  expect(html).not.toContain("onerror");
});
