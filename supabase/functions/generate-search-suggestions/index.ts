import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query_text, max_suggestions = 5 } = await req.json()

    if (!query_text) {
      throw new Error('Missing query_text parameter')
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Search across all content types
    const tables = ['clinical_guidelines', 'treatment_algorithms', 'evidence', 'best_practices']
    const suggestions: string[] = []

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('title')
        .textSearch('title', query_text)
        .limit(max_suggestions)

      if (error) throw error

      if (data) {
        suggestions.push(...data.map(item => item.title))
      }
    }

    // Add common oncology terms based on query
    const { data: terms, error: termsError } = await supabase
        .from('oncology_terms')
        .select('term')
        .textSearch('term', query_text)
        .limit(max_suggestions)

    if (!termsError && terms) {
      suggestions.push(...terms.map(item => item.term))
    }

    // Remove duplicates and limit results
    const uniqueSuggestions = [...new Set(suggestions)]
      .slice(0, max_suggestions)
      .sort((a, b) => {
        // Prioritize exact matches and starts with
        const aLower = a.toLowerCase()
        const bLower = b.toLowerCase()
        const queryLower = query_text.toLowerCase()
        
        if (aLower === queryLower) return -1
        if (bLower === queryLower) return 1
        if (aLower.startsWith(queryLower)) return -1
        if (bLower.startsWith(queryLower)) return 1
        return 0
      })

    return new Response(
      JSON.stringify(uniqueSuggestions),
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