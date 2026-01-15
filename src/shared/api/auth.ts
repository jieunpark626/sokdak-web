import { apiClient } from './client'
import { tokenStorage } from './token'

// 타입 정의
export interface RegisterRequest {
  loginId: string
  email: string
  password: string
  name: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
}

export interface RegisterResponse {
  id: string
  loginId: string
  email: string
  name: string
  gender: string
  plan: string
}

export interface LoginRequest {
  loginId: string
  password: string
}

export interface LoginResponse {
  user: {
    id: string
    name: string
  }
  tokens: {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresInSeconds: number
  }
}

export interface ApiError {
  message: string
  code?: string
}

// Auth API
export const authApi = {
  // 회원가입
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      '/auth/register',
      data
    )
    return response.data
  },

  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data)

    // 토큰 저장
    const { accessToken, refreshToken } = response.data.tokens
    tokenStorage.setTokens(accessToken, refreshToken)

    // 사용자 정보 저장
    tokenStorage.setUser(response.data.user)

    return response.data
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken()
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken })
      } catch {
        // 로그아웃 실패해도 로컬 토큰은 삭제
      }
    }
    tokenStorage.clearTokens()
  },

  // 이메일 인증 메일 재발송
  resendVerificationEmail: async (email: string): Promise<void> => {
    await apiClient.post('/auth/resend-verification-email', { email })
  },
}
