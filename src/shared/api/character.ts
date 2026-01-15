import { apiClient } from './client'

// Types
export interface Persona {
  tone: string
  style: string
  purpose: string
  gender: string
}

export interface Character {
  id: string
  user_id: string
  name: string
  persona: Persona
  type: 'ephemeral' | 'persistent'
  last_chat_at: string | null
  created_at: string
  updated_at: string
}

export interface CharacterListResponse {
  items: Character[]
}

export interface CreateCharacterRequest {
  user_id: string
  name: string
  persona: Persona
  type: 'ephemeral' | 'persistent'
}

export interface UpdateCharacterRequest {
  name?: string
  persona?: Partial<Persona>
}

export interface PersonaOptions {
  gender: string[]
  tone: string[]
  style: string[]
  purpose: string[]
}

// 기본 캐릭터(Friend, Priest)의 preset persona
export const PRESET_PERSONAS: Record<string, Persona> = {
  friend: {
    tone: 'friendly',
    style: 'chatty',
    purpose: 'casual_chat',
    gender: 'neutral',
  },
  priest: {
    tone: 'calm',
    style: 'empathetic',
    purpose: 'confession',
    gender: 'neutral',
  },
}

// API functions
export const characterApi = {
  // 페르소나 선택 옵션 목록 조회
  getPersonas: async (): Promise<PersonaOptions> => {
    const response = await apiClient.get<PersonaOptions>('/characters/personas')
    return response.data
  },

  // 사용자의 캐릭터 목록 조회
  getCharacters: async (params: {
    user_id: string
    type?: 'saved' | 'oneoff'
    order_by?: 'asc' | 'desc' | 'curr'
  }): Promise<CharacterListResponse> => {
    const response = await apiClient.get<CharacterListResponse>('/characters', { params })
    return response.data
  },

  // 특정 캐릭터 조회
  getCharacter: async (characterId: string): Promise<Character> => {
    const response = await apiClient.get<Character>(`/characters/${characterId}`)
    return response.data
  },

  // 새 캐릭터 생성
  createCharacter: async (data: CreateCharacterRequest): Promise<Character> => {
    const response = await apiClient.post<Character>('/characters', data)
    return response.data
  },

  // 캐릭터 정보 수정
  updateCharacter: async (characterId: string, data: UpdateCharacterRequest): Promise<Character> => {
    const response = await apiClient.patch<Character>(`/characters/${characterId}`, data)
    return response.data
  },

  // 캐릭터 삭제
  deleteCharacter: async (characterId: string): Promise<void> => {
    await apiClient.delete(`/characters/${characterId}`)
  },
}
