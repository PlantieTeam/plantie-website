export function cleanMarkdown(text: string): string {
  return text
    .replace(/([^\n])(#{1,3} )/g, "$1\n\n$2")
    .replace(/\n(#{1,3} )/g, "\n\n$1")
    .replace(/([^\n])([\u2714\u2705\u274C\u{1F33F}-\u{1F399}])/gu, "$1\n$2")
    .replace(/([^\n])(- |\* )/g, "$1\n$2")
    .replace(/([^\n])(\d+. )/g, "$1\n$2")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}