import { useCallback } from 'react'
import { tokenStorage } from '../api/token'
import { refreshAccessToken } from '../api/client'
import { useRandomChatStore } from '../stores/randomChatStore'

// http(s)://... → ws(s)://... 자동 변환
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const WS_BASE_URL = API_URL.replace(/^http/, 'ws') + '/ws/random-chat'

const MAX_RECONNECT_ATTEMPTS = 3
const RECONNECT_DELAY = 3000

// 클라이언트 → 서버 메시지 타입
type ClientMessage =
  | { type: 'JOIN_QUEUE' }
  | { type: 'LEAVE_QUEUE' }
  | { type: 'SEND_MESSAGE'; content: string }
  | { type: 'EXIT_ROOM' }

// 서버 → 클라이언트 메시지 타입 (discriminated union)
type ServerMessage =
  | { type: 'QUEUE_JOINED'; timestamp: string }
  | { type: 'QUEUE_LEFT'; timestamp: string }
  | { type: 'MATCHED'; roomId: string; timestamp: string }
  | { type: 'MESSAGE_RECEIVED'; messageId: string; content: string; timestamp: string }
  | { type: 'PARTNER_LEFT'; timestamp: string }
  | { type: 'ERROR'; code: string; message: string; timestamp: string }

// 에러 코드별 처리
const RESET_TO_IDLE_ERRORS = ['NOT_IN_QUEUE', 'NOT_IN_ROOM', 'ROOM_NOT_FOUND']
const IGNORABLE_ERRORS = ['ALREADY_IN_QUEUE']
const KEEP_CHATTING_ERRORS = ['ALREADY_IN_ROOM']

// ─── 모듈 레벨 싱글턴 (컴포넌트 lifecycle과 무관) ───
let ws: WebSocket | null = null
let reconnectAttempts = 0
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let intentionalClose = false
let pendingMessages: ClientMessage[] = []

function handleError(code: string, message: string) {
  const store = useRandomChatStore.getState()

  if (IGNORABLE_ERRORS.includes(code)) return
  if (KEEP_CHATTING_ERRORS.includes(code)) return

  if (RESET_TO_IDLE_ERRORS.includes(code)) {
    store.reset()
    store.setError({ code, message })
    return
  }

  store.setError({ code, message })
}

function connectWs() {
  const token = tokenStorage.getAccessToken()
  if (!token) return

  // 이미 연결 중이거나 연결된 상태면 무시
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return
  }

  const store = useRandomChatStore.getState()
  store.setStatus('connecting')
  intentionalClose = false

  const socket = new WebSocket(`${WS_BASE_URL}?token=${token}`)
  ws = socket

  socket.onopen = () => {
    reconnectAttempts = 0
    useRandomChatStore.getState().setStatus('idle')

    // 대기 중이던 메시지 전송
    const queued = [...pendingMessages]
    pendingMessages = []
    queued.forEach((msg) => {
      socket.send(JSON.stringify(msg))
    })
  }

  socket.onmessage = (event) => {
    try {
      const data: ServerMessage = JSON.parse(event.data)
      const s = useRandomChatStore.getState()

      switch (data.type) {
        case 'QUEUE_JOINED':
          // 이미 MATCHED로 chatting이면 무시 (즉시 매칭 케이스)
          if (s.status !== 'chatting') {
            s.setStatus('waiting')
          }
          break

        case 'QUEUE_LEFT':
          s.setStatus('idle')
          break

        case 'MATCHED':
          // 어떤 상태에서든 MATCHED 수신 가능 (전역 리스닝)
          s.setRoomId(data.roomId)
          s.setStatus('chatting')
          break

        case 'MESSAGE_RECEIVED':
          if (s.status === 'chatting') {
            s.addMessage({
              id: data.messageId,
              content: data.content,
              timestamp: new Date(data.timestamp).getTime(),
              sender: 'partner',
            })
          }
          break

        case 'PARTNER_LEFT':
          s.addMessage({
            id: `system-${Date.now()}`,
            content: '상대방이 나갔습니다.',
            timestamp: new Date(data.timestamp).getTime(),
            sender: 'system',
          })
          s.setRoomId(null)
          s.setStatus('partner_left')
          break

        case 'ERROR':
          handleError(data.code, data.message)
          break
      }
    } catch {
      // 파싱 실패 무시
    }
  }

  socket.onclose = () => {
    ws = null

    if (intentionalClose) return

    // 비정상 종료 시 토큰 갱신 후 재연결 시도
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      useRandomChatStore.getState().setStatus('disconnected')
      reconnectTimer = setTimeout(async () => {
        reconnectAttempts += 1
        // 토큰 만료가 원인일 수 있으므로 갱신 시도 후 재연결
        await refreshAccessToken()
        connectWs()
      }, RECONNECT_DELAY)
    } else {
      useRandomChatStore.getState().setStatus('disconnected')
    }
  }

  socket.onerror = () => {
    // onclose에서 처리
  }
}

function disconnectWs() {
  intentionalClose = true
  pendingMessages = []
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (ws) {
    ws.close()
    ws = null
  }
}

function sendWs(message: ClientMessage) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message))
  } else {
    // 연결 안 됐으면 대기열에 넣고 자동 연결
    pendingMessages.push(message)
    connectWs()
  }
}

// 브라우저 종료/새로고침 시 정리 (모듈 레벨에서 1회 등록)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    disconnectWs()
  })
}

// ─── React Hook (단순 래퍼) ───
export function useWebSocket() {
  const send = useCallback((message: ClientMessage) => {
    sendWs(message)
  }, [])

  const exitRoom = useCallback(() => {
    sendWs({ type: 'EXIT_ROOM' })
    useRandomChatStore.getState().reset()
  }, [])

  const reconnect = useCallback(() => {
    reconnectAttempts = 0
    disconnectWs()
    intentionalClose = false
    connectWs()
  }, [])

  const disconnect = useCallback(() => {
    disconnectWs()
    useRandomChatStore.getState().reset()
  }, [])

  return { send, exitRoom, reconnect, disconnect }
}
