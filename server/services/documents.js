import { supabase } from './supabase.js';
import { generateEmbedding } from './ai/index.js';
import { parseFile } from '../utils/fileParser.js';
import { chunkText } from './text/chunker.js';
import { extname } from 'path';

export async function processDocument(file, title, provider) {
  const fileExt = extname(file.originalname).toLowerCase().slice(1);
  const content = parseFile(file, fileExt);
  const chunks = chunkText(content, title);
  
  if (chunks.length === 0) {
    throw new Error('No valid content to process');
  }

  console.log(`Document split into ${chunks.length} chunks`);

  const processedChunks = await Promise.all(
    chunks.map(async (chunk) => {
      const { embedding, error: embeddingError } = await generateEmbedding(chunk.content, provider);
      
      if (embeddingError) {
        throw new Error(embeddingError);
      }

      return {
        title,
        content: chunk.content,
        embedding,
        metadata: {
          ...chunk.metadata,
          fileType: fileExt
        }
      };
    })
  );

  const { data, error } = await supabase
    .from('documents')
    .insert(processedChunks);

  if (error) throw error;

  return {
    data,
    chunksProcessed: chunks.length
  };
}
