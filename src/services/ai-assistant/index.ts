/**
 * AI Assistant Service - Main Entry Point
 * 
 * Provides complete integration with AI Assistant Dashboard API
 * - Socket.IO real-time communication
 * - REST API for suggestions
 * - TypeScript type definitions
 * 
 * Usage:
 * ```ts
 * import { getAiAssistantSocket, getSuggestionsWithCache } from '@/services/ai-assistant';
 * 
 * // Initialize socket
 * const socket = getAiAssistantSocket();
 * socket.connect({
 *   onAssistantState: (state) => console.log('State:', state),
 *   onMessageOutput: (msg) => console.log('Message:', msg),
 * });
 * 
 * // Join session
 * await socket.join({
 *   username: 'John Doe',
 *   conversation_id: 'unique-id-123',
 *   language: 'id',
 *   role: 'trainee',
 *   job_title: 'Software Engineer'
 * });
 * 
 * // Send text message
 * socket.sendTextInput('Apa itu LearnXpert?');
 * 
 * // Fetch suggestions
 * const suggestions = await getSuggestionsWithCache('trainee', 'id');
 * ```
 */

// Export types
export type {
  UserRole,
  Language,
  AssistantState,
  MessageType,
  JoinPayload,
  JoinResponse,
  MessageOutput,
  ApiResponse,
  SuggestionResponse,
  SocketEventListeners,
  SocketConfig,
} from './types';

// Export socket service
export {
  AiAssistantSocketService,
  getAiAssistantSocket,
  resetAiAssistantSocket,
} from './socket.service';

// Export suggestion service
export {
  getSuggestions,
  getSuggestionsWithCache,
  clearSuggestionCache,
} from './suggestion.service';

// Configuration constants
export const AI_ASSISTANT_CONFIG = {
  BASE_URL: 'https://ai-assistant-dashboard-presight.hinisa.ai',
  API_KEY: 'ajari_JVm7hSk14LUnwHaDlXrNR90dw1AIjkPcSenGs4YHFbUNR427PE7nxkPBKz',
  NAMESPACE: '/nisa/v1/assistant',
  PATH: '/socket.io',  // Socket.IO default handshake path (NOT custom endpoint)
} as const;