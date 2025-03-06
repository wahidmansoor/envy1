export interface TextChunk {
  content: string;
  metadata: {
    startIndex: number;
    endIndex: number;
    title: string;
  };
}

export interface ChunkingOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  minChunkSize?: number;
}
