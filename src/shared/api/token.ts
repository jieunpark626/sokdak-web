const ACCESS_TOKEN_KEY = 'sokdak_access_token'
const REFRESH_TOKEN_KEY = 'sokdak_refresh_token'
const USER_ID_KEY = 'sokdak_user_id'
const USER_NAME_KEY = 'sokdak_user_name'

export interface UserInfo {
  id: string
  name: string
}

export const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
    localStorage.removeItem(USER_NAME_KEY)
  },

  hasTokens: (): boolean => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  // User 정보 관련
  getUserId: (): string | null => {
    return localStorage.getItem(USER_ID_KEY)
  },

  getUserName: (): string | null => {
    return localStorage.getItem(USER_NAME_KEY)
  },

  getUser: (): UserInfo | null => {
    const id = localStorage.getItem(USER_ID_KEY)
    const name = localStorage.getItem(USER_NAME_KEY)
    if (id && name) {
      return { id, name }
    }
    return null
  },

  setUser: (user: UserInfo): void => {
    localStorage.setItem(USER_ID_KEY, user.id)
    localStorage.setItem(USER_NAME_KEY, user.name)
  },
}
