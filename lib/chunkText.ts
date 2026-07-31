// Splits raw text into overlapping chunks so retrieval has enough context
// without pulling in the entire document every time.
export function chunkText(
  text: string,
  chunkSize = 800,
  overlap = 150
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks.filter((c) => c.trim().length > 0);
}
l
