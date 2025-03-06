import { TextChunk, ChunkingOptions } from './types.js';

const DEFAULT_OPTIONS: Required<ChunkingOptions> = {
  chunkSize: 1000,    // Characters per chunk
  chunkOverlap: 200,  // Overlap between chunks
  minChunkSize: 100   // Minimum chunk size
};

export function chunkText(text: string, title: string, options: ChunkingOptions = {}): TextChunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const chunks: TextChunk[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    // Calculate end index for current chunk
    let endIndex = startIndex + opts.chunkSize;
    
    // If we're not at the end of the text, try to find a natural break point
    if (endIndex < text.length) {
      // Look for natural break points (period followed by space or newline)
      const breakPoint = text.substring(endIndex - 50, endIndex + 50).search(/[.]\s/);
      if (breakPoint !== -1) {
        endIndex = endIndex - 50 + breakPoint + 1;
      }
    } else {
      endIndex = text.length;
    }

    // Create chunk if it meets minimum size
    const chunkContent = text.substring(startIndex, endIndex).trim();
    if (chunkContent.length >= opts.minChunkSize) {
      chunks.push({
        content: chunkContent,
        metadata: {
          startIndex,
          endIndex,
          title
        }
      });
    }

    // Move start index for next chunk, accounting for overlap
    startIndex = endIndex - opts.chunkOverlap;
  }

  return chunks;
}
