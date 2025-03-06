import { supabaseClient as supabase } from '../../lib/supabase';
import { aiManager } from './AIManager';
import type { 
  AIQueryParams,
  ChatResponse,
  ChatConfig,
  ResponseFormat,
  Alert,
  ClinicalGuideline
} from '../../types/chat';

const DEFAULT_CONFIG: ChatConfig = {
  defaultModel: 'gpt-3.5-turbo',
  fallbackModel: 'gemini-pro',
  maxTokens: 500,
  temperature: 0.3,
  guidelines: ['NCCN', 'ASCO', 'ESMO'],
  responseFormat: 'general',
  streamResponse: false
};

// Emergency keywords that trigger urgent alerts
const EMERGENCY_KEYWORDS = [
  'cord compression',
  'neutropenic fever',
  'hemorrhage',
  'sepsis',
  'respiratory distress',
  'cardiac tamponade'
];

// Generate structured prompts based on response format
const generatePrompt = (params: AIQueryParams): string => {
  const { query, format, context } = params;
  
  let systemPrompt = `You are an oncology AI assistant. Provide concise, evidence-based responses using ${
    context?.guidelines?.join(', ') || 'NCCN, ASCO, ESMO'
  } guidelines. `;

  // Add format-specific instructions
  switch (format) {
    case 'treatment':
      systemPrompt += `Structure response as:
      1. First-line options (with evidence levels)
      2. Second-line options (with evidence levels)
      3. Palliative care considerations (if applicable)
      Include only essential information.`;
      break;

    case 'workup':
      systemPrompt += `Structure response as:
      1. Required laboratory tests
      2. Imaging studies (with timing)
      3. Essential biomarkers
      Be specific and concise.`;
      break;

    case 'interaction':
      systemPrompt += `Structure response as:
      1. Interaction mechanism
      2. Clinical significance
      3. Management recommendations
      Focus on critical interactions only.`;
      break;

    case 'case':
      systemPrompt += `Structure response as:
      1. Key patient factors to consider
      2. Risk assessment
      3. Evidence-based treatment pathway
      Include urgent alerts if applicable.`;
      break;
  }

  return `${systemPrompt}\n\nQuery: ${query}${
    context ? `\nContext: ${JSON.stringify(context)}` : ''
  }`;
};

// Check for emergency conditions
const checkEmergencyConditions = (query: string): Alert | null => {
  for (const keyword of EMERGENCY_KEYWORDS) {
    if (query.toLowerCase().includes(keyword)) {
      return {
        type: 'emergency',
        message: `⚠️ EMERGENCY: Potential ${keyword} detected`,
        action: ['Immediate clinical assessment required', 'Consider emergency referral'],
        urgency: 'emergency'
      };
    }
  }
  return null;
};

// Process response to ensure token efficiency
const processResponse = (response: any, format: ResponseFormat): ChatResponse => {
  const alert = checkEmergencyConditions(response.content);
  
  return {
    format,
    content: response.content,
    alerts: alert ? [alert] : undefined,
    references: {
      guidelines: response.guidelines || ['NCCN'],
      citations: response.citations || []
    },
    aiModel: response.model,
    tokensUsed: response.tokensUsed
  };
};

export const generateAIResponse = async (params: AIQueryParams): Promise<ChatResponse> => {
  const config: ChatConfig = { ...DEFAULT_CONFIG, ...params.config };
  const format = params.format || config.responseFormat;
  
  try {
    // Check for emergency conditions first
    const alert = checkEmergencyConditions(params.query);

    // Generate optimized prompt
    const prompt = generatePrompt(params);

    // Get relevant context from database
    const { data: contextData } = await supabase.rpc('get_relevant_context', {
      query_text: params.query,
      cancer_type: params.context?.cancerType
    });

    // Generate response using AIManager (handles model selection and fallback)
    const response = await aiManager.generateResponse(prompt, {
      ...params.context,
      relevantData: contextData,
      hasEmergencyAlert: !!alert
    });

    // Process and structure the response
    const processedResponse = processResponse({
      content: response.content,
      model: response.model,
      provider: response.provider,
      tokensUsed: response.tokensUsed
    }, format);

    // Add emergency alert if detected
    if (alert) {
      processedResponse.alerts = [alert];
    }

    // Save interaction for future reference
    await supabase.from('chat_interactions').insert({
      query: params.query,
      response: processedResponse,
      format,
      cancer_type: params.context?.cancerType,
      tokens_used: processedResponse.tokensUsed,
      model: processedResponse.aiModel,
      provider: response.provider,
      has_alert: !!processedResponse.alerts?.length
    });

    return processedResponse;

  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};