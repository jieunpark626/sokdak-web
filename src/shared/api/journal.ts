import { apiClient } from './client'

export interface Journal {
  id: string
  userId: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface JournalListItem {
  id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface JournalListResponse {
  content: JournalListItem[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  numberOfElements: number
  first: boolean
  empty: boolean
}

export interface CreateJournalRequest {
  userId: string
  title: string
  content: string
}

export interface UpdateJournalRequest {
  title?: string
  content?: string
}

export const journalApi = {
  // 새 일기 작성
  createJournal: async (data: CreateJournalRequest): Promise<Journal> => {
    const response = await apiClient.post<Journal>('/journals', data)
    return response.data
  },

  // 일기 목록 조회
  getJournals: async (params: {
    userId: string
    page?: number
    size?: number
    sort?: string
  }): Promise<JournalListResponse> => {
    const response = await apiClient.get<JournalListResponse>('/journals', {
      params: {
        userId: params.userId,
        page: params.page ?? 0,
        size: params.size ?? 100,
        sort: params.sort ?? 'createdAt,desc',
      },
    })
    return response.data
  },

  // 특정 일기 조회
  getJournal: async (journalId: string): Promise<Journal> => {
    const response = await apiClient.get<Journal>(`/journals/${journalId}`)
    return response.data
  },

  // 일기 수정
  updateJournal: async (journalId: string, data: UpdateJournalRequest): Promise<Journal> => {
    const response = await apiClient.patch<Journal>(`/journals/${journalId}`, data)
    return response.data
  },

  // 일기 삭제
  deleteJournal: async (journalId: string): Promise<void> => {
    await apiClient.delete(`/journals/${journalId}`)
  },
}
