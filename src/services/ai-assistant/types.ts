/**
 * TypeScript definitions for AI Assistant API
 * Based on AI Assistant Dashboard API Contract
 */

export type UserRole = 'lnd' | 'trainee' | 'instructor' | 'hr';
export type Language = 'id-ID' | 'en-US' | string;
export type AssistantState = 'waiting' | 'listening' | 'thinking' | 'writing' | 'speaking';
export type MessageType = 'user' | 'assistant';

/**
 * Join event payload - sent when initializing session
 */
export interface JoinPayload {
  username: string;
  conversation_id: string;
  language: Language;
  role: UserRole;
  job_title: string;
}

/**
 * Join response from server
 */
export interface JoinResponse {
  status_code: number;
  message: string;
}

/**
 * Message output event data - text messages from user or assistant
 */
export interface MessageOutput {
  type: MessageType;
  content: string;
  is_final: boolean;
  created_time: string;
}

/**
 * Generic API response
 */
export interface ApiResponse {
  status_code: number;
  message: string;
}

/**
 * Suggestion response from REST endpoint
 */
export interface SuggestionResponse {
  role: UserRole;
  language: Language;
  questions: string[];
}

/**
 * Socket event listeners configuration
 */
export interface SocketEventListeners {
  onAssistantState?: (state: AssistantState) => void;
  onMessageOutput?: (message: MessageOutput) => void;
  onAudioOutput?: (audioChunk: ArrayBuffer) => void;
  onAudioComplete?: () => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Socket connection config
 */
export interface SocketConfig {
  baseUrl: string;
  token: string;
  namespace?: string;
  path?: string;
}