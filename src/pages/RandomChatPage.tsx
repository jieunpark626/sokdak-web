import { useState, useRef, useEffect } from 'react'
import { useWebSocket } from '../shared/hooks/useWebSocket'
import { useRandomChatStore } from '../shared/stores/randomChatStore'
import { MainLayout } from '../shared/ui'
import SystemModal from '../shared/ui/SystemModal'
import AlertModal from '../shared/ui/AlertModal'
import welcomeIcon from '../shared/assets/images/welcome-icon.png'

const MAX_MESSAGE_LENGTH = 1000

function RandomChatPage() {
  const { send, exitRoom, reconnect } = useWebSocket()
  const { status, messages, error, setError, reset } = useRandomChatStore()

  const [inputValue, setInputValue] = useState('')
  const [showExitModal, setShowExitModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleJoinQueue = () => {
    send({ type: 'JOIN_QUEUE' })
  }

  const handleLeaveQueue = () => {
    send({ type: 'LEAVE_QUEUE' })
  }

  const handleSendMessage = () => {
    const content = inputValue.trim()
    if (!content || status !== 'chatting') return

    send({ type: 'SEND_MESSAGE', content })

    // 서버 ACK 없음 - 클라이언트에서 직접 추가
    useRandomChatStore.getState().addMessage({
      id: `me-${Date.now()}`,
      content,
      timestamp: Date.now(),
      sender: 'me',
    })

    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return // 한글 등 IME 조합 중이면 무시
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // EXIT_ROOM: 서버 응답 없음. 즉시 초기 화면 전환.
  const handleExitConfirm = () => {
    setShowExitModal(false)
    exitRoom()
  }

  // 새 채팅 시작 (partner_left 상태에서)
  const handleNewChat = () => {
    reset()
    handleJoinQueue()
  }

  // 돌아가기 (partner_left 상태에서)
  const handleBackToIdle = () => {
    reset()
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase()
  }

  // 채팅 중이거나 상대가 나간 상태에서 채팅 UI 표시
  const showChatUI = status === 'chatting' || status === 'partner_left'

  return (
    <MainLayout activeTab="random-chat">
      {!showChatUI ? (
        /* ───── 비채팅 상태 화면들 ───── */
        <div className="flex h-full w-full flex-col items-center justify-center px-[50px] py-[20px]">

          {/* idle: 초기 화면 */}
          {status === 'idle' && (
            <div className="flex flex-col items-center">
              <div className="h-[139px] w-[139px]">
                <img src={welcomeIcon} alt="Random Chat" className="h-full w-full object-contain" />
              </div>
              <p
                className="mt-[20px] text-center text-[20px] text-[#AEAEAE]"
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              >
                Meet someone new and start chatting!
              </p>
              <button
                onClick={handleJoinQueue}
                className="mt-[27px] flex h-[52px] w-[220px] items-center justify-center rounded-[10px] bg-gradient-to-b from-[#7CC2F0] to-[#5BA3D9] text-[18px] font-bold text-white shadow-md hover:from-[#6BB5E8] hover:to-[#4A92C8] font-['Segoe_UI']"
                style={{
                  border: '1px solid #4A92C8',
                  boxShadow: '0px 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
                }}
              >
                Start Random Chat
              </button>
            </div>
          )}

          {/* connecting: 연결 중 */}
          {status === 'connecting' && (
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#D8F0FE] border-t-[#7CC2F0]" />
              <p className="text-[14px] font-medium text-[#3E6F97] font-['Segoe_UI']">
                Connecting...
              </p>
            </div>
          )}

          {/* waiting: 매칭 대기 */}
          {status === 'waiting' && (
            <div className="flex flex-col items-center">
              <div className="h-[139px] w-[139px]">
                <img src={welcomeIcon} alt="Waiting" className="h-full w-full animate-pulse object-contain" />
              </div>
              <p
                className="mt-[20px] text-center text-[18px] font-semibold text-[#3E6F97]"
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              >
                Looking for someone to chat with...
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-[#7CC2F0]" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 animate-bounce rounded-full bg-[#7CC2F0]" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 animate-bounce rounded-full bg-[#7CC2F0]" style={{ animationDelay: '300ms' }} />
              </div>
              <button
                onClick={handleLeaveQueue}
                className="mt-[27px] flex h-[42px] w-[140px] items-center justify-center rounded-[5px] border border-[#7CC2F0] bg-gradient-to-b from-white to-[#E1F2FF] text-[14px] font-semibold text-[#3E6F97] active:shadow-inner font-['Segoe_UI']"
              >
                Cancel
              </button>
            </div>
          )}

          {/* disconnected: 연결 끊김 */}
          {status === 'disconnected' && (
            <div className="flex flex-col items-center gap-4">
              <div className="h-[139px] w-[139px]">
                <img src={welcomeIcon} alt="Disconnected" className="h-full w-full object-contain opacity-50" />
              </div>
              <p
                className="text-center text-[18px] font-semibold text-[#E74C3C]"
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              >
                Connection lost.
              </p>
              <button
                onClick={reconnect}
                className="flex h-[42px] w-[160px] items-center justify-center rounded-[5px] border border-[#7CC2F0] bg-gradient-to-b from-white to-[#E1F2FF] text-[14px] font-semibold text-[#3E6F97] active:shadow-inner font-['Segoe_UI']"
              >
                Reconnect
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ───── 채팅 UI (chatting / partner_left) ───── */
        <div className="flex h-full w-full flex-col px-[30px] py-[15px] md:px-[50px] md:py-[20px]">

          {/* 채팅 헤더 */}
          <div className="flex flex-shrink-0 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[28px]">👤</span>
                <div>
                  <h3 className="text-[16px] font-bold text-[#3E6F97] font-['Segoe_UI']">
                    Random Chat
                  </h3>
                  <div className="flex items-center gap-1">
                    <span
                      className={`h-[8px] w-[8px] rounded-full ${
                        status === 'chatting'
                          ? 'bg-[#39FF14] shadow-[0_0_4px_rgba(57,255,20,0.8)]'
                          : 'bg-[#AEAEAE]'
                      }`}
                    />
                    <span className="text-[12px] text-[#8EADC1] font-['Segoe_UI']">
                      {status === 'chatting' ? 'Partner connected' : 'Partner left'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 나가기 버튼 (chatting 상태에서만) */}
            {status === 'chatting' && (
              <button
                onClick={() => setShowExitModal(true)}
                className="flex h-[32px] items-center justify-center rounded-[3px] border border-[#7CC2F0] bg-gradient-to-b from-white to-[#E1F2FF] px-4 text-[12px] font-semibold text-[#3E6F97] active:shadow-inner font-['Segoe_UI']"
              >
                Exit Chat
              </button>
            )}

            {/* partner_left 상태에서 버튼들 */}
            {status === 'partner_left' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBackToIdle}
                  className="flex h-[32px] items-center justify-center rounded-[3px] border border-[#7CC2F0] bg-gradient-to-b from-white to-[#E1F2FF] px-4 text-[12px] font-semibold text-[#3E6F97] active:shadow-inner font-['Segoe_UI']"
                >
                  Back
                </button>
                <button
                  onClick={handleNewChat}
                  className="flex h-[32px] items-center justify-center rounded-[3px] bg-gradient-to-b from-[#7CC2F0] to-[#5BA3D9] px-4 text-[12px] font-bold text-white shadow-md hover:from-[#6BB5E8] hover:to-[#4A92C8] font-['Segoe_UI']"
                  style={{ border: '1px solid #4A92C8' }}
                >
                  New Chat
                </button>
              </div>
            )}
          </div>

          {/* 구분선 */}
          <div
            className="mt-2 h-[1px] w-full flex-shrink-0"
            style={{
              background: 'linear-gradient(90deg, rgba(153, 170, 182, 0) 0%, rgba(153, 170, 182, 1) 50%, rgba(153, 170, 182, 0) 100%)',
              filter: 'blur(0.5px)',
            }}
          />

          {/* 메시지 영역 */}
          <div className="custom-scrollbar mt-2 min-h-0 flex-1 overflow-y-auto rounded-md p-3">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-[#8EADC1] font-['Segoe_UI']">Say hello to your partner!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((message) => {
                  // 시스템 메시지 (가운데 정렬)
                  if (message.sender === 'system') {
                    return (
                      <div key={message.id} className="flex justify-center py-1">
                        <span
                          className="rounded-full bg-[#E1F2FF] px-4 py-1 text-[12px] text-[#3E6F97] font-['Segoe_UI']"
                          style={{ border: '1px solid #7CC2F0' }}
                        >
                          {message.content}
                        </span>
                      </div>
                    )
                  }

                  const isMe = message.sender === 'me'
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* 상대방 아바타 */}
                      {!isMe && (
                        <div className="mr-2 flex h-[32px] w-[32px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#D8F0FE] to-[#B9E5FE]"
                          style={{ border: '1px solid #7CC2F0' }}
                        >
                          <span className="text-[14px]">👤</span>
                        </div>
                      )}
                      <div
                        className={`max-w-[65%] rounded-lg px-3 py-2 ${
                          isMe
                            ? 'bg-gradient-to-b from-[#7CC2F0] to-[#5BA3D9]'
                            : 'bg-white'
                        }`}
                        style={{
                          border: isMe ? '1px solid #4A92C8' : '1px solid #D2D2D2',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                        }}
                      >
                        <p
                          className={`whitespace-pre-wrap break-words text-[13px] ${
                            isMe ? 'text-white' : 'text-[#333]'
                          }`}
                        >
                          {message.content}
                        </p>
                        <p
                          className={`mt-1 text-right text-[10px] ${
                            isMe ? 'text-white/70' : 'text-[#AEAEAE]'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {/* 내 아바타 */}
                      {isMe && (
                        <div className="ml-2 flex h-[32px] w-[32px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#D8F0FE] to-[#B9E5FE]"
                          style={{ border: '1px solid #7CC2F0' }}
                        >
                          <span className="text-[14px]">🧑</span>
                        </div>
                      )}
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* 입력 영역 - chatting 상태에서만 활성화 */}
          {status === 'chatting' && (
            <div className="mt-2 flex-shrink-0">
              <div
                className="rounded-md bg-white p-2"
                style={{
                  border: '1px solid #7CC2F0',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <textarea
                  value={inputValue}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                      setInputValue(e.target.value)
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="h-[50px] w-full resize-none text-[13px] text-[#333] placeholder-[#AEAEAE] focus:outline-none"
                  maxLength={MAX_MESSAGE_LENGTH}
                />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[11px] text-[#AEAEAE] font-['Segoe_UI']">
                  {inputValue.length}/{MAX_MESSAGE_LENGTH}
                </span>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="rounded-md bg-gradient-to-b from-[#7CC2F0] to-[#5BA3D9] px-4 py-1 text-[13px] font-bold text-white shadow-md hover:from-[#6BB5E8] hover:to-[#4A92C8] disabled:cursor-not-allowed disabled:opacity-50 font-['Segoe_UI']"
                  style={{ border: '1px solid #4A92C8' }}
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* partner_left 상태 - 입력 비활성화 안내 */}
          {status === 'partner_left' && (
            <div className="mt-2 flex-shrink-0">
              <div
                className="flex items-center justify-center rounded-md bg-[#F5F5F5] p-3"
                style={{ border: '1px solid #D2D2D2' }}
              >
                <p className="text-[13px] text-[#AEAEAE] font-['Segoe_UI']">
                  Chat ended. Partner has left.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 퇴장 확인 모달 */}
      <SystemModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        message="Do you want to leave this chat?"
        onOk={handleExitConfirm}
        onCancel={() => setShowExitModal(false)}
      />

      {/* 에러 알림 모달 */}
      <AlertModal
        isOpen={!!error}
        onClose={() => setError(null)}
        message={error?.message || 'An error occurred.'}
        subMessage={`Error code: ${error?.code || 'UNKNOWN'}`}
        variant="warning"
        buttonText="OK"
        onButtonClick={() => setError(null)}
      />
    </MainLayout>
  )
}

export default RandomChatPage
