import { create } from 'zustand'

// idle: 초기 / connecting: WS 연결 중 / waiting: 매칭 대기
// chatting: 1:1 채팅 중 / partner_left: 상대 퇴장 (메시지 유지)
// disconnected: 연결 끊김
export type RandomChatStatus =
  | 'idle'
  | 'connecting'
  | 'waiting'
  | 'chatting'
  | 'partner_left'
  | 'disconnected'

export interface ChatMessage {
  id: string
  content: string
  timestamp: number
  sender: 'me' | 'partner' | 'system'
}

export interface ChatError {
  code: string
  message: string
}

interface RandomChatState {
  status: RandomChatStatus
  roomId: string | null
  messages: ChatMessage[]
  error: ChatError | null

  setStatus: (status: RandomChatStatus) => void
  setRoomId: (roomId: string | null) => void
  addMessage: (message: ChatMessage) => void
  setError: (error: ChatError | null) => void
  reset: () => void
}

export const useRandomChatStore = create<RandomChatState>((set) => ({
  status: 'idle',
  roomId: null,
  messages: [],
  error: null,

  setStatus: (status) => set({ status }),
  setRoomId: (roomId) => set({ roomId }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setError: (error) => set({ error }),
  reset: () => set({ status: 'idle', roomId: null, messages: [], error: null }),
}))
