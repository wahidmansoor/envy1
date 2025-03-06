export function chunkText(text, title, options = {}) {
  const defaultOptions = {
    chunkSize: 1000,
    chunkOverlap: 200,
    minChunkSize: 100
  };

  const opts = { ...defaultOptions, ...options };
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + opts.chunkSize;
    
    if (endIndex < text.length) {
      const breakPoint = text.substring(endIndex - 50, endIndex + 50).search(/[.]\s/);
      if (breakPoint !== -1) {
        endIndex = endIndex - 50 + breakPoint + 1;
      }
    } else {
      endIndex = text.length;
    }

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

    startIndex = endIndex - opts.chunkOverlap;
  }

  return chunks;
}
