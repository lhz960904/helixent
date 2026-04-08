import Anthropic from "@anthropic-ai/sdk";

import type { Message, ModelProvider, Tool } from "@/foundation";

import { convertToAnthropicMessages, convertToAnthropicTools, parseAssistantMessage } from "./utils";

/**
 * A provider for the Anthropic API.
 */
export class AnthropicModelProvider implements ModelProvider {
  _client: Anthropic;

  constructor({ baseURL, apiKey }: { baseURL?: string; apiKey?: string } = {}) {
    this._client = new Anthropic({
      baseURL,
      apiKey,
    });
  }

  async invoke({
    model,
    messages,
    tools,
    options,
    signal,
  }: {
    model: string;
    messages: Message[];
    tools?: Tool[];
    options?: Record<string, unknown>;
    signal?: AbortSignal;
  }) {
    const { system, messages: anthropicMessages } = convertToAnthropicMessages(messages);

    const params: Anthropic.MessageCreateParamsNonStreaming = {
      model,
      max_tokens: 8192,
      system: system.length > 0 ? system : undefined,
      messages: anthropicMessages,
      tools: tools ? convertToAnthropicTools(tools) : undefined,
      ...options,
    };

    const response = await this._client.messages.create(params, { signal });
    return parseAssistantMessage(response);
  }
}
