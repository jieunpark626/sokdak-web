import { useState, useEffect, useRef, memo } from 'react'
import { CharacterCard } from './CharacterCard'
import AlertModal from './AlertModal'
import sokdakLogo from '../assets/images/sokdak-logo.png'
import bgChatting from '../assets/images/bg-chatting.png'
import welcomeIcon from '../assets/images/welcome-icon.png'
import { conversationApi, type Message } from '../api/conversation'
import { type Character } from '../api/character'
import { tokenStorage } from '../api/token'
import { getAppearanceImage } from '../utils/appearanceImages'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  character: Character | null
  conversationId: string | null
  userName: string
  onConversationUpdate?: () => void // 대화 업데이트 시 호출할 콜백
}

export const ChatModal = ({
  isOpen,
  onClose,
  character,
  conversationId: initialConversationId,
  userName,
  onConversationUpdate,
}: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(initialConversationId)
  const [showLimitAlert, setShowLimitAlert] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isSendingRef = useRef(false) // 중복 호출 방지용

  // conversationId prop이 변경되면 state 업데이트
  useEffect(() => {
    setCurrentConversationId(initialConversationId)
  }, [initialConversationId])

  // 모달이 열릴 때 메시지 초기화 및 로드 (initialConversationId 기준으로만)
  useEffect(() => {
    if (!isOpen) {
      setMessages([])
      return
    }

    const fetchMessages = async () => {
      // initialConversationId가 없으면 (새 대화) fetch 하지 않음
      if (!initialConversationId) return

      setIsLoading(true)
      try {
        const response = await conversationApi.getMessages(initialConversationId)
        // API는 최신순으로 반환하므로 역순으로 정렬
        setMessages(response.items.reverse())
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [initialConversationId, isOpen])

  // 새 메시지 추가 시 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    // ref로 중복 호출 방지 (StrictMode에서 두 번 호출되는 것 방지)
    if (!inputValue.trim() || !character || isSendingRef.current) return
    isSendingRef.current = true

    const userId = tokenStorage.getUserId()
    if (!userId) {
      isSendingRef.current = false
      return
    }

    let convId = currentConversationId

    // conversation이 없으면 새로 생성
    if (!convId) {
      try {
        const newConversation = await conversationApi.createConversation({
          character_id: character.id,
          user_id: userId,
          language: 'auto',
          conversation_type: character.type === 'ephemeral' ? 'ephemeral' : 'persistent',
        })
        convId = newConversation.id
        setCurrentConversationId(convId)
      } catch (error: unknown) {
        console.error('Failed to create conversation:', error)
        // 429 에러 (한도 초과) 처리
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } }
          if (axiosError.response?.status === 429) {
            setShowLimitAlert(true)
          }
        }
        isSendingRef.current = false
        return
      }
    }

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsSending(true)

    try {
      const response = await conversationApi.sendMessage(convId, {
        content: userMessage.content,
      })
      // AI 응답만 추가 (유저 메시지는 이미 위에서 추가됨)
      // 만약 response가 배열이면 AI 응답만 필터링
      if (Array.isArray(response)) {
        const aiMessages = response.filter((msg: Message) => msg.role === 'ai')
        setMessages((prev) => [...prev, ...aiMessages])
      } else {
        // 단일 응답인 경우 (AI 응답만 온 경우)
        if (response.role === 'ai') {
          setMessages((prev) => [...prev, response])
        }
      }
      // 메시지 전송 후 리스트 업데이트 콜백 호출
      onConversationUpdate?.()
    } catch (error: unknown) {
      console.error('Failed to send message:', error)
      // 실패한 메시지 제거
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id))
      // 429 에러 (한도 초과) 처리
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } }
        if (axiosError.response?.status === 429) {
          setShowLimitAlert(true)
        }
      }
    } finally {
      setIsSending(false)
      isSendingRef.current = false
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 모달 닫기 핸들러 (ephemeral인 경우 conversation 삭제)
  const handleClose = async () => {
    // ephemeral 타입이고 conversation이 있으면 삭제
    if (character?.type === 'ephemeral' && currentConversationId) {
      try {
        await conversationApi.deleteConversation(currentConversationId)
        onConversationUpdate?.()
      } catch {
        // 삭제 실패 시 무시
      }
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* PageLayout 카드와 동일한 크기의 어두운 오버레이 */}
      <div
        className="absolute h-full w-full max-h-[700px] max-w-[1280px] rounded-[15px] bg-black/50 md:h-[90vh] lg:h-[700px]"
        onClick={handleClose}
      />
      {/* 모달 컨테이너 */}
      <div
        className="relative z-10 flex h-[600px] w-[800px] flex-col overflow-hidden rounded-lg"
        style={{
          backgroundImage: `url(${bgChatting})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* 상단 헤더 */}
        <div 
          className="flex items-center justify-between px-2"
          style={{
            borderBottom: '1px solid #A6C7E4'
          }}
        >
          {/* 로고 */}
          <img src={sokdakLogo} alt="Sokdak" className="h-[40px] mt-2 object-contain" />

          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="flex h-[22px] w-[22px] items-center justify-center rounded-sm bg-gradient-to-b from-[#FF6B6B] to-[#E74C3C] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:from-[#FF5252] hover:to-[#D32F2F]"
            style={{
              border: '1px solid #C0392B',
            }}
          >
            <span className="text-[14px] font-bold leading-none">×</span>
          </button>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="flex min-h-0 flex-1 gap-4 px-4 pb-4">
          {/* 왼쪽 캐릭터 카드 영역 */}
          <div className="flex w-[120px] flex-col justify-between py-2">
            {/* AI 캐릭터 카드 (상단) */}
            <div className="flex flex-col items-center">
              <CharacterCard image={character?.appearance ? getAppearanceImage(character.appearance) : welcomeIcon} size={100} />
              <span className="mt-1 flex items-center gap-1 text-[12px] text-[#3E6F97]">
                <span className="h-[8px] w-[8px] rounded-full bg-[#39FF14] shadow-[0_0_4px_rgba(57,255,20,0.8)]" />
                {character?.name || 'AI'}
              </span>
            </div>

            {/* 유저 카드 (하단) */}
            <div className="flex flex-col items-center">
              <CharacterCard image={welcomeIcon} size={100} />
              <span className="mt-1 flex items-center gap-1 text-[12px] text-[#3E6F97]">
                <span className="h-[8px] w-[8px] rounded-full bg-[#39FF14] shadow-[0_0_4px_rgba(57,255,20,0.8)]" />
                {userName}
              </span>
            </div>
          </div>

          {/* 오른쪽 채팅 영역 */}
          <div className="flex min-h-0 flex-1 flex-col mt-8">
            {/* 캐릭터 정보 헤더 */}
            <div className="mb-2 flex-shrink-0 rounded-md px-3 py-2">
              <h3 className="text-[16px] font-bold text-[#3E6F97]">
                {character?.name || 'AI Assistant'}{' '}
                <span className="text-[12px] font-normal text-[#8EADC1]">(Available)</span>
              </h3>
              <p className="text-[12px] text-[#5389B5]">
                I am fully ready to hear your story today...
              </p>
          </div>
          <div 
            className="h-[1px] w-full" 
            style={{
              background: 'linear-gradient(90deg, rgba(153, 170, 182, 0) 0%, rgba(153, 170, 182, 1) 50%, rgba(153, 170, 182, 0) 100%)',
              filter: 'blur(0.5px)' 
            }} 
          />

            {/* 메시지 영역 */}
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto rounded-md p-3">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-[#8EADC1]">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-[#8EADC1]">Start a conversation!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {messages.map((message) => (
                    <div key={message.id}>
                      <p className="text-[12px] font-semibold text-[#3E6F97]">
                        {message.role === 'ai'
                          ? `${character?.name || 'AI Assistant'} says:`
                          : 'User says:'}
                      </p>
                      <ul className="ml-4 mt-1">
                        <li className="text-[13px] text-[#5389B5]">• {message.content}</li>
                      </ul>
                    </div>
                  ))}
                  {/* AI 타이핑 인디케이터 */}
                  {isSending && (
                    <div>
                      <p className="text-[12px] font-semibold text-[#3E6F97]">
                        {character?.name || 'AI Assistant'} is typing:
                      </p>
                      <ul className="ml-4 mt-1">
                        <li className="text-[13px] text-[#5389B5]">
                          <span className="inline-flex gap-[2px]">
                            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
                            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
                            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* 입력 영역 */}
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
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="h-[60px] w-full resize-none text-[13px] text-[#333] placeholder-[#AEAEAE] focus:outline-none"
                  disabled={isSending}
                />
              </div>

              {/* 이모지 & 전송 버튼 영역 */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-1 text-[20px]">
                  <span className="cursor-pointer hover:scale-110">😘</span>
                  <span className="cursor-pointer hover:scale-110">😊</span>
                  <span className="cursor-pointer hover:scale-110">🥳</span>
                  <span className="cursor-pointer hover:scale-110">🌈</span>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputValue.trim()}
                  className="rounded-md bg-gradient-to-b from-[#7CC2F0] to-[#5BA3D9] px-4 py-1 text-[13px] font-bold text-white shadow-md hover:from-[#6BB5E8] hover:to-[#4A92C8] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    border: '1px solid #4A92C8',
                  }}
                >
                  {isSending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 사용량 한도 초과 알림 */}
        <AlertModal
          isOpen={showLimitAlert}
          onClose={() => setShowLimitAlert(false)}
          message="Daily chat limit exceeded!"
          subMessage="You've reached your daily AI chat limit. Please try again tomorrow."
          variant="warning"
          buttonText="OK"
          onButtonClick={() => setShowLimitAlert(false)}
        />
      </div>
    </div>
  )
}

export default memo(ChatModal)
