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
    const response = await apiClient.post<LoginResponse>('/auth/login', data, {
      withCredentials: true, // 쿠키 수신 허용
    })

    // accessToken만 저장 (refreshToken은 HttpOnly 쿠키로 자동 저장됨)
    tokenStorage.setAccessToken(response.data.tokens.accessToken)

    // 사용자 정보 저장
    tokenStorage.setUser(response.data.user)

    return response.data
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout', {}, {
        withCredentials: true, // 쿠키 전송
      })
    } catch {
      // 로그아웃 실패해도 로컬 토큰은 삭제
    }
    tokenStorage.clearTokens()
  },

  // 이메일 인증 메일 재발송
  resendVerificationEmail: async (email: string): Promise<void> => {
    await apiClient.post('/auth/resend-verification-email', { email })
  },
}
