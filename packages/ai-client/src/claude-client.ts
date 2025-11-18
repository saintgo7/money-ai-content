import Anthropic from '@anthropic-ai/sdk';
import type {
  AIClientConfig,
  GenerationOptions,
  Message,
  ContentGenerationResponse
} from './types';

export class ClaudeClient {
  private client: Anthropic;
  private defaultModel: string;
  private defaultMaxTokens: number;
  private defaultTemperature: number;

  constructor(config: AIClientConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });

    this.defaultModel = config.model || 'claude-sonnet-4-20250514';
    this.defaultMaxTokens = config.maxTokens || 4000;
    this.defaultTemperature = config.temperature || 1.0;
  }

  /**
   * Generate text using Claude
   */
  async generate(
    prompt: string,
    options?: GenerationOptions
  ): Promise<ContentGenerationResponse> {
    const startTime = Date.now();

    const messages: Message[] = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await this.client.messages.create({
      model: options?.model || this.defaultModel,
      max_tokens: options?.maxTokens || this.defaultMaxTokens,
      temperature: options?.temperature || this.defaultTemperature,
      system: options?.systemPrompt,
      messages,
    });

    const generationTime = Date.now() - startTime;

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return {
      content: content.text,
      metadata: {
        model: response.model,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        generationTime,
      },
    };
  }

  /**
   * Generate with conversation history
   */
  async chat(
    messages: Message[],
    options?: GenerationOptions
  ): Promise<ContentGenerationResponse> {
    const startTime = Date.now();

    const response = await this.client.messages.create({
      model: options?.model || this.defaultModel,
      max_tokens: options?.maxTokens || this.defaultMaxTokens,
      temperature: options?.temperature || this.defaultTemperature,
      system: options?.systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    const generationTime = Date.now() - startTime;

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return {
      content: content.text,
      metadata: {
        model: response.model,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        generationTime,
      },
    };
  }

  /**
   * Stream generation
   */
  async *stream(
    prompt: string,
    options?: GenerationOptions
  ): AsyncGenerator<string, void, unknown> {
    const messages: Message[] = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    const stream = await this.client.messages.stream({
      model: options?.model || this.defaultModel,
      max_tokens: options?.maxTokens || this.defaultMaxTokens,
      temperature: options?.temperature || this.defaultTemperature,
      system: options?.systemPrompt,
      messages,
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield chunk.delta.text;
      }
    }
  }

  /**
   * Parse JSON response from Claude
   */
  async generateJSON<T = any>(
    prompt: string,
    options?: GenerationOptions
  ): Promise<T> {
    const response = await this.generate(prompt, {
      ...options,
      systemPrompt: `${options?.systemPrompt || ''}\n\nIMPORTANT: Respond only with valid JSON. Do not include any explanation or markdown formatting.`,
    });

    try {
      // Remove markdown code blocks if present
      let jsonText = response.content.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      return JSON.parse(jsonText) as T;
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}\n\nResponse: ${response.content}`
      );
    }
  }

  /**
   * Analyze and score content quality
   */
  async scoreContent(
    content: string,
    criteria: string[]
  ): Promise<{ total: number; breakdown: Record<string, number> }> {
    const prompt = `Analyze and score the following content based on these criteria:

${criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Content:
${content}

Provide scores from 0-100 for each criterion and a total average score.
Respond in JSON format:
{
  "total": 85,
  "breakdown": {
    "criterion1": 90,
    "criterion2": 80,
    ...
  }
}`;

    return this.generateJSON<{ total: number; breakdown: Record<string, number> }>(
      prompt
    );
  }
}
