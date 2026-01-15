import { apiClient } from './client'

// Types
export interface Conversation {
  id: string
  user_id: string
  character_id: string
  summary: string
  last_message: string | null
  last_message_at: string | null
  language: string
  conversation_type: 'persistent' | 'ephemeral'
  created_at: string
  updated_at: string
}

export interface ConversationListResponse {
  items: Conversation[]
}

export interface CreateConversationRequest {
  character_id: string
  user_id: string
  language: string
  conversation_type: 'persistent' | 'ephemeral'
}

export interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  created_at: string
}

export interface MessageListResponse {
  items: Message[]
  next_cursor: string | null
}

export interface SendMessageRequest {
  content: string
}

// API functions
export const conversationApi = {
  // 대화방 목록 조회
  getConversations: async (params: {
    user_id: string
    character_id?: string
    order_by?: 'asc' | 'desc'
  }): Promise<ConversationListResponse> => {
    const response = await apiClient.get<ConversationListResponse>('/conversations', { params })
    return response.data
  },

  // 특정 대화방 조회
  getConversation: async (conversationId: string): Promise<Conversation> => {
    const response = await apiClient.get<Conversation>(`/conversations/${conversationId}`)
    return response.data
  },

  // 새 대화방 생성
  createConversation: async (data: CreateConversationRequest): Promise<Conversation> => {
    const response = await apiClient.post<Conversation>('/conversations', data)
    return response.data
  },

  // 대화방 삭제
  deleteConversation: async (conversationId: string): Promise<void> => {
    await apiClient.delete(`/conversations/${conversationId}`)
  },

  // 메시지 목록 조회
  getMessages: async (
    conversationId: string,
    params?: { limit?: number; before?: string }
  ): Promise<MessageListResponse> => {
    const response = await apiClient.get<MessageListResponse>(
      `/conversations/${conversationId}/messages`,
      { params }
    )
    return response.data
  },

  // 메시지 전송
  sendMessage: async (conversationId: string, data: SendMessageRequest): Promise<Message> => {
    const response = await apiClient.post<Message>(
      `/conversations/${conversationId}/messages`,
      data
    )
    return response.data
  },
}
