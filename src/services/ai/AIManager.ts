import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';
import {
  AIProvider,
  AIModelConfig,
  AIProviderResponse,
  QueryType,
  MODEL_SELECTION_CONFIG
} from './providers/types';
import { supabaseClient as supabase } from '../../lib/supabase';

type OpenAIModel = 'gpt-4' | 'gpt-3.5-turbo';
type GeminiModel = 'gemini-pro';

export class AIManager {
  private openaiProvider: OpenAIProvider;
  private geminiProvider: GeminiProvider;
  private lastProvider: AIProvider | null = null;

  constructor() {
    // Initialize with default configurations
    this.openaiProvider = new OpenAIProvider({
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      ...MODEL_SELECTION_CONFIG.openai.models['gpt-3.5-turbo']
    });
    this.geminiProvider = new GeminiProvider({
      provider: 'gemini',
      model: 'gemini-pro',
      ...MODEL_SELECTION_CONFIG.gemini.models['gemini-pro']
    });
  }

  private determineQueryType(query: string): QueryType {
    // Simple keyword-based classification
    const keywords = {
      medical_literature: ['study', 'research', 'publication', 'evidence', 'trial'],
      patient_education: ['explain', 'what is', 'how to', 'patient', 'understand'],
      clinical_decision: ['treatment', 'diagnosis', 'prognosis', 'stage'],
      drug_interaction: ['interaction', 'drug', 'medication', 'contraindication'],
      guideline_based: ['guideline', 'protocol', 'nccn', 'asco', 'esmo']
    };

    for (const [type, typeKeywords] of Object.entries(keywords)) {
      if (typeKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
        return type as QueryType;
      }
    }

    return 'clinical_decision'; // Default query type
  }

  private selectProvider(queryType: QueryType): AIProvider {
    // Check if query type is in OpenAI's preferred types
    if (MODEL_SELECTION_CONFIG.openai.preferredQueryTypes.includes(queryType)) {
      return 'openai';
    }
    // Check if query type is in Gemini's preferred types
    if (MODEL_SELECTION_CONFIG.gemini.preferredQueryTypes.includes(queryType)) {
      return 'gemini';
    }
    // Default to OpenAI for other cases
    return 'openai';
  }

  async generateResponse(prompt: string, context?: any): Promise<AIProviderResponse> {
    const queryType = this.determineQueryType(prompt);
    const primaryProvider = this.selectProvider(queryType);
    
    try {
      const response = await this.tryProvider(primaryProvider, prompt, context);
      this.lastProvider = primaryProvider;
      await this.logInteraction(prompt, response, false);
      return response;
    } catch (error) {
      console.error(`${primaryProvider} failed:`, error);
      
      // Try fallback provider
      const fallbackProvider = primaryProvider === 'openai' ? 'gemini' : 'openai';
      try {
        const response = await this.tryProvider(fallbackProvider, prompt, context);
        this.lastProvider = fallbackProvider;
        await this.logInteraction(prompt, response, true);
        return response;
      } catch (fallbackError) {
        console.error(`${fallbackProvider} failed:`, fallbackError);
        throw new Error('All providers failed to generate a response');
      }
    }
  }

  private async tryProvider(
    provider: AIProvider,
    prompt: string,
    context?: any
  ): Promise<AIProviderResponse> {
    const config = this.getProviderConfig(provider, prompt);
    
    if (provider === 'openai') {
      this.openaiProvider = new OpenAIProvider(config);
      return this.openaiProvider.generateResponse(prompt);
    } else {
      this.geminiProvider = new GeminiProvider(config);
      return this.geminiProvider.generateResponse(prompt);
    }
  }

  private getProviderConfig(provider: AIProvider, prompt: string): AIModelConfig {
    const isComplex = this.isComplexQuery(prompt);
    
    if (provider === 'openai') {
      const model: OpenAIModel = isComplex ? 'gpt-4' : 'gpt-3.5-turbo';
      const modelConfig = MODEL_SELECTION_CONFIG.openai.models[model];
      return {
        provider: 'openai',
        model,
        ...modelConfig
      };
    }
    
    const model: GeminiModel = 'gemini-pro';
    const modelConfig = MODEL_SELECTION_CONFIG.gemini.models[model];
    return {
      provider: 'gemini',
      model,
      ...modelConfig
    };
  }

  private isComplexQuery(prompt: string): boolean {
    const complexityIndicators = [
      'compare',
      'analyze',
      'evaluate',
      'implications',
      'evidence-based',
      'guidelines',
      'emergency',
      'urgent'
    ];
    
    return complexityIndicators.some(indicator => 
      prompt.toLowerCase().includes(indicator)
    );
  }

  private async logInteraction(
    prompt: string, 
    response: AIProviderResponse, 
    usedFallback: boolean
  ): Promise<void> {
    try {
      await supabase.from('ai_interactions').insert({
        prompt,
        provider: response.provider,
        model: response.model,
        tokens_used: response.tokensUsed,
        used_fallback: usedFallback,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log AI interaction:', error);
    }
  }

  getLastProvider(): AIProvider | null {
    return this.lastProvider;
  }
}

// Export singleton instance
export const aiManager = new AIManager();