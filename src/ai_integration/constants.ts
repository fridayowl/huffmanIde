// constants.ts
import { ModelConfig } from './types';

export const defaultModels: ModelConfig[] = [
  {
    name: 'gemma:2b',
    displayName: 'Gemma 2B',
    description: 'Lightweight model good for general tasks',
    parameters: {
      temperature: 0.7,
      top_k: 40,
      top_p: 0.9,
      max_tokens: 2048
    }
  },
  {
    name: 'gemma:7b',
    displayName: 'Gemma 7B',
    description: 'More capable model for complex tasks',
    parameters: {
      temperature: 0.7,
      top_k: 40,
      top_p: 0.9,
      max_tokens: 2048
    }
  },
  {
    name: 'qwen2.5-coder',
    displayName: 'Qwen 2B',
    description: 'Specialized model for code generation and analysis',
    parameters: {
      temperature: 0.8,
      top_k: 40,
      top_p: 0.95,
      max_tokens: 2048
    }
  }
];

export const defaultInstructions = [
  {
    id: 1,
    text: 'You are a Python expert and code generator. Focus on writing clean, efficient, and well-documented code.'
  },
  {
    id: 2,
    text: 'Always explain the code you generate with detailed comments and include type hints when appropriate.'
  },
  {
    id: 3,
    text: 'When suggesting libraries, include pip install commands and version requirements.'
  },
  {
    id: 4,
    text: 'Follow PEP 8 style guidelines and provide error handling best practices.'
  }
];