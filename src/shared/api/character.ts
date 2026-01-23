import { apiClient } from './client'

// Types
export type AppearanceType = 'dog' | 'duck' | 'frog' | 'friend' | 'priest'

export interface Persona {
  tone: string
  style: string
  purpose: string
}

export interface Character {
  id: string
  user_id: string
  name: string
  persona: Persona
  appearance: AppearanceType
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
  appearance: AppearanceType
  type: 'ephemeral' | 'persistent'
}

export interface UpdateCharacterRequest {
  name?: string
  persona?: Partial<Persona>
  appearance?: AppearanceType
}

export interface PersonaOptions {
  tone: string[]
  style: string[]
  purpose: string[]
}

export interface AppearancesResponse {
  items: AppearanceType[]
}

// 기본 캐릭터(Friend, Priest)의 preset persona
export const PRESET_PERSONAS: Record<string, Persona> = {
  friend: {
    tone: 'friendly',
    style: 'chatty',
    purpose: 'casual_chat',
  },
  priest: {
    tone: 'calm',
    style: 'empathetic',
    purpose: 'confession',
  },
}

// 기본 캐릭터의 appearance 매핑
export const PRESET_APPEARANCES: Record<string, AppearanceType> = {
  friend: 'friend',
  priest: 'priest',
}

// API functions
export const characterApi = {
  // 페르소나 선택 옵션 목록 조회
  getPersonas: async (): Promise<PersonaOptions> => {
    const response = await apiClient.get<PersonaOptions>('/characters/personas')
    return response.data
  },

  // 사용 가능한 외형 목록 조회
  getAppearances: async (): Promise<AppearancesResponse> => {
    const response = await apiClient.get<AppearancesResponse>('/characters/appearances')
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
