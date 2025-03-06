import { AIProviderResponse, AIError, AIModelConfig } from './types';
import { supabaseClient as supabase } from '../../../lib/supabase';

export class OpenAIProvider {
  private retryCount: number = 0;

  constructor(private config: AIModelConfig) {}

  async generateResponse(prompt: string): Promise<AIProviderResponse> {
    try {
      const response = await this.makeRequest(prompt);
      this.retryCount = 0; // Reset retry count on success
      return response;
    } catch (error) {
      if (this.retryCount < this.config.retryAttempts && this.isRetryableError(error)) {
        this.retryCount++;
        await this.delay(this.config.retryDelay * this.retryCount);
        return this.generateResponse(prompt);
      }
      throw this.handleError(error);
    }
  }

  private async makeRequest(prompt: string): Promise<AIProviderResponse> {
    const { data, error } = await supabase.functions.invoke('generate-openai-response', {
      body: {
        prompt,
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      }
    });

    if (error) throw error;

    return {
      content: data.content,
      model: this.config.model,
      tokensUsed: data.usage.total_tokens,
      provider: 'openai'
    };
  }

  private isRetryableError(error: any): boolean {
    const retryableErrors = [
      'rate_limit_exceeded',
      'timeout',
      'service_unavailable',
      'internal_server_error'
    ];

    return retryableErrors.includes(error?.code);
  }

  private handleError(error: any): AIError {
    const aiError = new Error(error.message) as AIError;
    aiError.provider = 'openai';
    aiError.code = error.code || 'unknown_error';
    aiError.retryable = this.isRetryableError(error);
    return aiError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}