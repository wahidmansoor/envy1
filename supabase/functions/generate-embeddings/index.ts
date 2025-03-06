import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai'
import { corsHeaders } from '../_shared/cors.ts'

const configuration = new Configuration({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
})
const openai = new OpenAIApi(configuration)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()

    if (!text) {
      throw new Error('Missing text parameter')
    }

    const embeddingResponse = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: text.trim(),
    })

    const [{ embedding }] = embeddingResponse.data.data

    return new Response(
      JSON.stringify({ embeddings: embedding }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})