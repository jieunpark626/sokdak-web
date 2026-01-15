import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CharacterCard, ChatModal, GradientButton, MainLayout } from '../shared/ui'
import SystemModal from '../shared/ui/SystemModal'
import { characterApi, type Character } from '../shared/api/character'
import { conversationApi, type Conversation } from '../shared/api/conversation'
import { tokenStorage } from '../shared/api/token'
import welcomeIcon from '../shared/assets/images/welcome-icon.png'
import characterListIcon from '../shared/assets/images/icon-character-list.png'
import iconDelete from '../shared/assets/images/icon-delete.png'

// Character와 Conversation을 합친 타입
interface CharacterWithConversation extends Character {
  conversation?: Conversation
}

function ChatPage() {
  const navigate = useNavigate()
  const [charactersWithConversations, setCharactersWithConversations] = useState<CharacterWithConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'list' | 'edit'>('list')

  // 채팅 모달 상태
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  // 삭제 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [characterToDelete, setCharacterToDelete] = useState<CharacterWithConversation | null>(null)

  // 이름 변경 모달 상태
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [characterToRename, setCharacterToRename] = useState<CharacterWithConversation | null>(null)
  const [newCharacterName, setNewCharacterName] = useState('')

  // useMemo로 user 정보 캐싱
  const userName = useMemo(() => tokenStorage.getUser()?.name || 'Guest', [])

  // 캐릭터 및 대화 목록 가져오기
  const fetchCharactersAndConversations = useCallback(async () => {
    const userId = tokenStorage.getUserId()
    if (!userId) {
      navigate('/login')
      return
    }

    try {
      // Character와 Conversation을 동시에 가져오기
      const [charactersResponse, conversationsResponse] = await Promise.all([
        characterApi.getCharacters({
          user_id: userId,
          order_by: 'desc',
        }),
        conversationApi.getConversations({
          user_id: userId,
          order_by: 'desc',
        }),
      ])

      // Conversation을 character_id 기준으로 매핑
      const conversationMap = new Map<string, Conversation>()
      conversationsResponse.items.forEach((conv) => {
        conversationMap.set(conv.character_id, conv)
      })

      // Character에 해당하는 Conversation 매칭
      const merged: CharacterWithConversation[] = charactersResponse.items.map((character) => ({
        ...character,
        conversation: conversationMap.get(character.id),
      }))

      setCharactersWithConversations(merged)
    } catch (error) {
      console.error('Failed to fetch characters and conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    fetchCharactersAndConversations()
  }, [fetchCharactersAndConversations])

  // 대화 업데이트 핸들러 (메시지 전송 후 리스트 새로고침)
  const handleConversationUpdate = useCallback(() => {
    fetchCharactersAndConversations()
  }, [fetchCharactersAndConversations])

  // 시간 포맷팅 함수
  const formatTime = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase()
  }

  // 삭제 버튼 클릭
  const handleDeleteClick = (character: CharacterWithConversation) => {
    setCharacterToDelete(character)
    setShowDeleteModal(true)
  }

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!characterToDelete) return

    try {
      await characterApi.deleteCharacter(characterToDelete.id)
      setShowDeleteModal(false)
      setCharacterToDelete(null)
      fetchCharactersAndConversations()
    } catch (error) {
      console.error('Failed to delete character:', error)
    }
  }

  // 이름 변경 버튼 클릭
  const handleRenameClick = (character: CharacterWithConversation) => {
    setCharacterToRename(character)
    setNewCharacterName(character.name)
    setShowRenameModal(true)
  }

  // 이름 변경 확인
  const handleRenameConfirm = async () => {
    if (!characterToRename || !newCharacterName.trim()) return

    try {
      await characterApi.updateCharacter(characterToRename.id, {
        name: newCharacterName.trim(),
      })
      setShowRenameModal(false)
      setCharacterToRename(null)
      setNewCharacterName('')
      fetchCharactersAndConversations()
    } catch (error) {
      console.error('Failed to rename character:', error)
    }
  }

  // 로딩 중
  if (isLoading) {
    return (
      <MainLayout activeTab="chat">
        <div className="flex h-full items-center justify-center">
          <p className="text-[#AEAEAE]">Loading...</p>
        </div>
      </MainLayout>
    )
  }

  // 캐릭터가 없는 경우 - 기존 UI
  if (charactersWithConversations.length === 0) {
    return (
      <MainLayout activeTab="chat">
        <div className="h-[139px] w-[139px]">
          <img src={welcomeIcon} alt="Character" className="h-full w-full object-contain" />
        </div>
        <p
          className="mt-[20px] text-center text-[20px] text-[#AEAEAE]"
          style={{ fontFamily: 'Segoe UI, sans-serif' }}
        >
          Create your own character to start chatting.
        </p>
        <GradientButton
          variant="blue"
          onClick={() => navigate('/create-character')}
          className="mt-[27px]"
        >
          Create Now
        </GradientButton>
      </MainLayout>
    )
  }

  // 캐릭터가 있는 경우 - 리스트 UI

  return (
    <MainLayout activeTab="chat">
      <div className="flex h-full w-full flex-col px-[50px] py-[20px]">

        {/* 상단 탭 + Create 버튼 영역 */}
        <div className="flex w-full items-end justify-between pr-4">
          <div className="flex items-center gap-[4px]">
            {/* Character list 탭 */}
            <div className="flex w-fit items-center gap-2 rounded-[3px] border-[1px] border-[#7CC2F0] bg-gradient-to-b from-[#FFFFFF] to-[#D8F0FE] px-[22px] py-[6px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
              <img
                src={characterListIcon}
                alt="Character list"
                className="h-[24px] w-[24px] object-contain"
              />
              <span className="text-[16px] font-bold text-[#171F2A] font-['Segoe_UI']">
                Character list
              </span>
            </div>

            {/* Edit / Done 버튼 */}
            <button
              onClick={() => setActiveTab(activeTab === 'list' ? 'edit' : 'list')}
              className="px-4 py-2 text-[14px] font-bold text-[#03228B] underline font-['Segoe_UI']"
            >
              {activeTab === 'list' ? 'Edit' : 'Done'}
            </button>
          </div>

          <GradientButton
            variant="blue"
            onClick={() => navigate('/create-character')}
            className="!h-[40px] !w-[110px] !text-[16px] shadow-md"
          >
            Create
          </GradientButton>
        </div>

        {/* 메인 리스트 컨테이너 (h-full과 flex-1로 높이 고정) */}
        <div
          className="relative mt-[20px] flex flex-1 flex-col overflow-hidden rounded-[4px] bg-gradient-to-b from-[#FFFFFF] to-[#D8F0FE]"
          style={{
            border: '1px solid #D2D2D2',
            boxShadow: 'inset -1.5px -2.5px 2px 0px rgba(110, 182, 245, 0.26)',
          }}
        >
          {/* 실제 스크롤이 발생하는 영역 */}
          <div className="custom-scrollbar h-full w-full overflow-y-auto px-[30px] py-4">
            <div className="flex flex-col">
              {charactersWithConversations.map((item, idx) => (
                <div key={item.id}>
                  {activeTab === 'list' ? (
                    // 일반 모드 - 채팅 클릭 가능
                    <div
                      onClick={() => {
                        setSelectedCharacter(item)
                        setSelectedConversationId(item.conversation?.id || null)
                        setIsChatModalOpen(true)
                      }}
                      className="group flex cursor-pointer items-start gap-5 py-5 transition-colors hover:bg-white/40"
                    >
                      <div className="flex-shrink-0">
                        <CharacterCard
                          image={welcomeIcon}
                          size={100}
                        />
                      </div>

                      <div className="mt-2 flex flex-1 flex-col">
                        <div className="flex items-center gap-2">
                          <div className="h-[10px] w-[10px] rounded-full bg-[#39FF14] shadow-[0_0_5px_rgba(57,255,20,0.8)]" />
                          <h3 className="text-[20px] font-extrabold text-[#3E6F97] font-['Segoe_UI']">
                            {item.name}
                          </h3>
                        </div>
                        <p className="mt-2 text-[15px] leading-snug text-[#5389B5] font-['Segoe_UI'] max-w-[550px]">
                          {item.type === 'ephemeral'
                            ? `Start New Chat with ${item.name.toLowerCase()}! Nothing will be stored.`
                            : item.conversation?.last_message || `Start a conversation with ${item.name}!`
                          }
                        </p>
                      </div>

                      <div className="mt-2 text-[14px] text-[#8EADC1] font-['Segoe_UI']">
                        {item.conversation?.last_message_at
                          ? formatTime(item.conversation.last_message_at)
                          : item.last_chat_at
                            ? formatTime(item.last_chat_at)
                            : ''
                        }
                      </div>
                    </div>
                  ) : (
                    // Edit 모드 - 삭제/이름변경 가능
                    <div className="flex items-center gap-5 py-5">
                      {/* 삭제 버튼 */}
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="flex-shrink-0 transition-transform hover:scale-110"
                      >
                        <img src={iconDelete} alt="Delete" className="h-[24px] w-[24px]" />
                      </button>

                      <div className="flex-shrink-0">
                        <CharacterCard
                          image={welcomeIcon}
                          size={100}
                        />
                      </div>

                      <div className="mt-2 flex flex-1 items-center gap-3">
                        <h3 className="text-[20px] font-extrabold text-[#3E6F97] font-['Segoe_UI']">
                          {item.name}
                        </h3>
                        {/* 이름 변경 버튼 (연필 아이콘) */}
                        <button
                          onClick={() => handleRenameClick(item)}
                          className="text-[#5389B5] hover:text-[#3E6F97] transition-colors"
                          title="Rename"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {idx !== charactersWithConversations.length - 1 && (
                    <div
                      className="h-[1px] w-full"
                      style={{
                        background: 'linear-gradient(90deg, rgba(153, 170, 182, 0) 0%, rgba(153, 170, 182, 1) 50%, rgba(153, 170, 182, 0) 100%)',
                        filter: 'blur(0.5px)'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        character={selectedCharacter}
        conversationId={selectedConversationId}
        userName={userName}
        onConversationUpdate={handleConversationUpdate}
      />

      {/* 삭제 확인 모달 */}
      <SystemModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        message={`Do you want to delete this character?\nAll chatting record will be deleted.`}
        onOk={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* 이름 변경 모달 */}
      <SystemModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        message="Set the name of your character:"
        showInput={true}
        inputValue={newCharacterName}
        onInputChange={setNewCharacterName}
        onOk={handleRenameConfirm}
        onCancel={() => setShowRenameModal(false)}
      />
    </MainLayout>
  )
}

export default ChatPage
