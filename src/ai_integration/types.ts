// types.ts

// Model related types
export interface ModelParameters {
  temperature?: number;
  top_k?: number;
  top_p?: number;
  max_tokens?: number;
}

export interface ModelConfig {
  name: string;
  displayName: string;
  description: string;
  parameters?: ModelParameters;
}

export interface ModelInfo {
  selectedModel: {
    name: string;
    displayName: string;
    description: string;
    parameters?: ModelParameters;
  };
  customization?: ModelCustomization;
  lastUpdated: string;
}

export interface ModelCustomization {
  instructions: Instruction[];
  modelfile: string;
  customModelName: string;
}

// Instruction related types
export interface Instruction {
  id: number;
  text: string;
}

// API related types
export interface OllamaRequest {
  model: string;
  prompt: string;
  format?: string;
  stream?: boolean;
  parameters?: ModelParameters;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

// Status related types
export interface OllamaStatus {
  isInstalled: boolean;
  isRunning: boolean;
  version?: string;
  error?: string;
  installedModels: string[];
}

// Component Props Types
export interface SystemStatusProps {
  isLoading: boolean;
  isInstalled: boolean;
}

export interface ModelSelectorProps {
  selectedModel: ModelConfig;
  models: ModelConfig[];
  installedModels: string[];
  parameters: ModelParameters;
  isPulling: boolean;
  isInstalled: boolean;
  onModelSelect: (model: string) => void;
  onParameterChange: (key: string, value: number) => void;
  onPullModel: () => void;
}

export interface ModelTesterProps {
  testMessage: string;
  response: string;
  isSending: boolean;
  isInstalled: boolean;
  onMessageChange: (message: string) => void;
  onSendPrompt: () => void;
}

export interface StatusLogProps {
  status: string;
}

export interface ModelCustomizerProps {
  selectedModel: ModelConfig;
  instructions: Instruction[];
  modelfileContent: string;
  customModelName: string;
  isCreatingModel: boolean;
  onInstructionAdd: () => void;
  onInstructionRemove: (id: number) => void;
  onInstructionUpdate: (id: number, text: string) => void;
  onModelfileGenerate: () => void;
  onModelfileChange: (content: string) => void;
  onCustomModelNameChange: (name: string) => void;
  onCreateModel: () => Promise<void>;
}

// Function return types
export interface PullModelResult {
  success: boolean;
  error?: string;
}

export interface SendPromptResult {
  success: boolean;
  response?: string;
  error?: string;
}

export interface InstallationCheckResult {
  isInstalled: boolean;
  installedModels: string[];
}

// Stream handling types
export interface StreamingExecuteResult {
  success: boolean;
  error?: string;
}

export interface TokenCallback {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: string) => void;
}

// Settings and configuration types
export interface UISettings {
  theme: 'light' | 'dark';
  fontSize: number;
  showAdvancedOptions: boolean;
}

export interface AppConfig {
  apiEndpoint: string;
  defaultModel: string;
  maxTokens: number;
  defaultTemperature: number;
}

// Error handling types
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Event handling types
export interface ModelEvent {
  type: 'pull' | 'create' | 'delete' | 'update';
  model: string;
  timestamp: string;
  status: 'success' | 'failure';
  details?: string;
}

// Utility types
export type ModelStatus = 'not_installed' | 'installing' | 'ready' | 'error';

export type ParameterKey = keyof ModelParameters;

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type TabType = 'instructions' | 'modelfile';

// Union types for different states
export type ModelOperationType = 'pull' | 'create' | 'delete' | 'update';

export type ResponseFormat = 'text' | 'json' | 'markdown';

// Branded types for type safety
export type ModelName = string & { readonly brand: unique symbol };
export type ModelFile = string & { readonly brand: unique symbol };

// Utility type helpers
export type Optional<T> = {
  [P in keyof T]?: T[P];
};

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Context types
export interface ModelContextType {
  selectedModel: ModelConfig;
  setSelectedModel: (model: ModelConfig) => void;
  parameters: ModelParameters;
  setParameters: (params: ModelParameters) => void;
  installedModels: string[];
  refreshModels: () => Promise<void>;
}

export interface UIContextType {
  settings: UISettings;
  updateSettings: (settings: Partial<UISettings>) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}