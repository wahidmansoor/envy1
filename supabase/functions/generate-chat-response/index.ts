import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const openAiConfig = new Configuration({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})
const openai = new OpenAIApi(openAiConfig)

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl!, supabaseKey!)

interface ChatContext {
  cancerType?: string;
  patientFactors?: Record<string, any>;
  relevantData?: any[];
}

interface ModelConfig {
  model: string;
  maxTokens: number;
  temperature: number;
}

// Function to format context into a concise prompt
const formatContextPrompt = (context: ChatContext): string => {
  let contextPrompt = '';
  
  if (context.cancerType) {
    contextPrompt += `Cancer Type: ${context.cancerType}\n`;
  }

  if (context.patientFactors) {
    contextPrompt += 'Patient Factors:\n';
    Object.entries(context.patientFactors).forEach(([key, value]) => {
      contextPrompt += `- ${key}: ${value}\n`;
    });
  }

  if (context.relevantData?.length) {
    contextPrompt += '\nRelevant Information:\n';
    context.relevantData.forEach(item => {
      contextPrompt += `- ${item.title || item.content}\n`;
    });
  }

  return contextPrompt;
};

// Function to get guidelines based on cancer type
const getRelevantGuidelines = async (cancerType: string) => {
  const { data, error } = await supabase
    .from('clinical_guidelines')
    .select('content')
    .eq('cancer_type', cancerType)
    .limit(3);

  if (error) throw error;
  return data?.map(g => g.content) || [];
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, modelConfig, context } = await req.json()

    // Validate required parameters
    if (!prompt || !modelConfig) {
      throw new Error('Missing required parameters')
    }

    // Get relevant guidelines if cancer type is provided
    let guidelineContent = '';
    if (context?.cancerType) {
      const guidelines = await getRelevantGuidelines(context.cancerType);
      guidelineContent = guidelines.join('\n\n');
    }

    // Prepare messages for the chat completion
    const messages = [
      {
        role: 'system',
        content: `You are an oncology AI assistant trained to provide evidence-based responses.
                Focus on clinical accuracy and brevity.
                Always cite relevant guidelines when available.
                If you detect any emergency conditions, mark them clearly.
                Use structured formats for responses.`
      },
      {
        role: 'user',
        content: `${prompt}\n\nContext:\n${formatContextPrompt(context)}${
          guidelineContent ? `\n\nRelevant Guidelines:\n${guidelineContent}` : ''
        }`
      }
    ];

    // Make API call to OpenAI
    const completion = await openai.createChatCompletion({
      model: modelConfig.model,
      messages,
      max_tokens: modelConfig.maxTokens,
      temperature: modelConfig.temperature,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
      stream: false
    });

    // Process the response
    const response = completion.data.choices[0]?.message?.content || '';

    // Extract guidelines cited in the response
    const guidelineMatches = response.match(/\b(NCCN|ASCO|ESMO)\b/g) || [];
    const guidelines = [...new Set(guidelineMatches)];

    // Extract any citations
    const citationMatches = response.match(/\(([^)]+)\)/g) || [];
    const citations = citationMatches.map(citation => citation.slice(1, -1));

    // Prepare the final response
    const result = {
      content: response,
      model: modelConfig.model,
      guidelines,
      citations,
      usage: completion.data.usage
    };

    // Save response to database for analysis
    await supabase.from('ai_responses').insert({
      prompt,
      response: result,
      model: modelConfig.model,
      tokens_used: completion.data.usage?.total_tokens,
      cancer_type: context?.cancerType,
      has_emergency: response.toLowerCase().includes('emergency')
    });

    return new Response(
      JSON.stringify(result),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})