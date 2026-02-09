import axios from 'axios'
import { tokenStorage } from './token'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Access Token 갱신 함수 (WebSocket에서도 사용)
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    )
    const { accessToken } = response.data
    tokenStorage.setAccessToken(accessToken)
    return accessToken
  } catch {
    tokenStorage.clearTokens()
    window.location.href = '/login'
    return null
  }
}

// 요청 인터셉터: Access Token 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터: 토큰 만료 시 자동 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 에러이고, 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const newToken = await refreshAccessToken()
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)
