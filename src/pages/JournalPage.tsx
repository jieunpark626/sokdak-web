import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../shared/ui'
import SystemModal from '../shared/ui/SystemModal'
import { journalApi, type Journal, type JournalListItem } from '../shared/api/journal'
import { tokenStorage } from '../shared/api/token'
import bgChatting from '../shared/assets/images/bg-chatting.png'
import iconFolder from '../shared/assets/images/icon-folder.png'
import iconMemo from '../shared/assets/images/icon-memo.png'
import iconDelete from '../shared/assets/images/icon-delete.png'

function JournalPage() {
  const navigate = useNavigate()
  const [currentJournal, setCurrentJournal] = useState<Journal | null>(null)
  const [journalList, setJournalList] = useState<JournalListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isNewJournal, setIsNewJournal] = useState(false) // 새 일기 작성 모드

  // 삭제 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [journalToDelete, setJournalToDelete] = useState<JournalListItem | null>(null)

  // 오늘 날짜 포맷
  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayName = days[date.getDay()]
    return `${year}.${month}.${day}.${dayName}`
  }

  // 날짜만 비교 (시간 제외)
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  // 일기 목록 가져오기
  const fetchJournalList = useCallback(async () => {
    const userId = tokenStorage.getUserId()
    if (!userId) {
      navigate('/login')
      return
    }

    try {
      const response = await journalApi.getJournals({ userId })
      setJournalList(response.content)
      return response.content
    } catch (error) {
      console.error('Failed to fetch journals:', error)
      return []
    }
  }, [navigate])

  // 오늘 일기 찾기 (없으면 빈 상태로 표시)
  const initializeTodayJournal = useCallback(async () => {
    const userId = tokenStorage.getUserId()
    if (!userId) {
      navigate('/login')
      return
    }

    setIsLoading(true)
    try {
      const journals = await fetchJournalList()
      const today = new Date()

      // 오늘 날짜의 일기 찾기
      const todayJournal = journals?.find((j) => isSameDay(new Date(j.createdAt), today))

      if (todayJournal) {
        // 오늘 일기가 있으면 상세 조회
        const detail = await journalApi.getJournal(todayJournal.id)
        setCurrentJournal(detail)
        setTitle(detail.title)
        setContent(detail.content)
        setIsNewJournal(false)
      } else {
        // 오늘 일기가 없으면 빈 상태로 표시 (POST하지 않음)
        setCurrentJournal(null)
        setTitle('')
        setContent('')
        setIsNewJournal(true)
      }
    } catch (error) {
      console.error('Failed to initialize journal:', error)
    } finally {
      setIsLoading(false)
    }
  }, [navigate, fetchJournalList])

  useEffect(() => {
    initializeTodayJournal()
  }, [initializeTodayJournal])

  // 특정 일기 선택
  const handleSelectJournal = async (journal: JournalListItem) => {
    try {
      const detail = await journalApi.getJournal(journal.id)
      setCurrentJournal(detail)
      setTitle(detail.title)
      setContent(detail.content)
      setIsNewJournal(false)
    } catch (error) {
      console.error('Failed to fetch journal:', error)
    }
  }

  // 저장
  const handleSave = async () => {
    const userId = tokenStorage.getUserId()
    if (!userId) {
      navigate('/login')
      return
    }

    setIsSaving(true)
    try {
      if (isNewJournal) {
        // 새 일기 생성 (POST)
        const newJournal = await journalApi.createJournal({
          userId,
          title,
          content,
        })
        setCurrentJournal(newJournal)
        setIsNewJournal(false)
      } else if (currentJournal) {
        // 기존 일기 수정 (PUT)
        const updated = await journalApi.updateJournal(currentJournal.id, {
          title,
          content,
        })
        setCurrentJournal(updated)
      }
      await fetchJournalList()
    } catch (error) {
      console.error('Failed to save journal:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // 삭제 클릭
  const handleDeleteClick = (journal: JournalListItem) => {
    setJournalToDelete(journal)
    setShowDeleteModal(true)
  }

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!journalToDelete) return

    try {
      await journalApi.deleteJournal(journalToDelete.id)
      setShowDeleteModal(false)
      setJournalToDelete(null)

      // 현재 보고 있던 일기가 삭제된 경우 오늘 일기로 이동
      if (currentJournal?.id === journalToDelete.id) {
        await initializeTodayJournal()
      } else {
        await fetchJournalList()
      }
    } catch (error) {
      console.error('Failed to delete journal:', error)
    }
  }

  // 로딩 중
  if (isLoading) {
    return (
      <MainLayout activeTab="journal">
        <div className="flex h-full items-center justify-center">
          <p className="text-[#AEAEAE]">Loading...</p>
        </div>
      </MainLayout>
    )
  }

  const displayDate = currentJournal
    ? formatDate(new Date(currentJournal.createdAt))
    : formatDate(new Date())

  return (
    <MainLayout activeTab="journal">
      <div className="flex h-full w-full p-4 md:p-10">
        {/* 메인 컨텐츠 영역 */}
        <div
          className="relative h-full w-full mx-auto max-w-5xl overflow-hidden rounded-[10px] shadow-2xl shadow-[#3E6F97]/20 "
          style={{
            backgroundImage: `url(${bgChatting})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* 일기 입력 폼 */}
          <div className="h-full px-8 py-6 md:px-12 md:py-8">
            {/* 날짜 */}
            <h1 className="text-[22px] font-bold text-[#3E6F97] font-['Segoe_UI'] md:text-[26px]">
              {displayDate}
            </h1>

            {/* 제목 입력 */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="(Title)"
              className="mt-6 w-full bg-transparent text-[20px] font-semibold text-[#171F2A] placeholder-[#171F2A]/60 outline-none font-['Segoe_UI'] md:text-[22px]"
            />

            {/* 내용 입력 */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter Your Content Here."
              className="custom-scrollbar mt-4 min-h-[300px] w-full resize-none bg-transparent text-[15px] leading-relaxed text-[#5389B5] placeholder-[#5389B5]/60 outline-none font-['Segoe_UI'] md:min-h-[400px] md:text-[16px]"
            />
          </div>

          {/* Save 버튼 */}
          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="h-[32px] min-w-[80px] rounded-[3px] border border-[#7CC2F0] bg-gradient-to-b from-white to-[#E1F2FF] font-['Segoe_UI'] text-[13px] font-semibold text-[#3E6F97] shadow-sm transition-all hover:shadow-md active:shadow-inner disabled:opacity-50 md:h-[36px] md:min-w-[90px] md:text-[14px]"
            >
              {isSaving ? 'Saving...' : 'save'}
            </button>
          </div>
        </div>

        {/* 오른쪽 사이드바 - Archive */}
        <div className="hidden w-[160px] flex-col md:flex ml-4 lg:w-[180px]">
          {/* Archive 헤더 */}
          <div className="flex items-center justify-between border-b border-[#A6C7E4]/30 px-3 py-3">
            <div className="flex items-center gap-2">
              <img src={iconFolder} alt="Archive" className="h-[18px] w-[18px]" />
              <span className="text-[14px] font-semibold text-[#3E6F97] font-['Segoe_UI']">
                Archive
              </span>
            </div>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="text-[12px] font-medium text-[#03228B] underline font-['Segoe_UI']"
            >
              {isEditMode ? 'Done' : 'Edit'}
            </button>
          </div>

          {/* 일기 목록 */}
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            {journalList.map((journal) => (
              <div
                key={journal.id}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors"
                onClick={() => !isEditMode && handleSelectJournal(journal)}
              >
                {isEditMode ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(journal)
                    }}
                    className="flex-shrink-0 transition-transform hover:scale-110"
                  >
                    <img src={iconDelete} alt="Delete" className="h-[16px] w-[16px]" />
                  </button>
                ) : (
                  <img src={iconMemo} alt="Memo" className="h-[16px] w-[16px] flex-shrink-0" />
                )}
                
                {/* 텍스트 부분: 밑줄 추가 및 선택 시 색상 강조 */}
                <span
                  className={`truncate text-[12px] font-['Segoe_UI'] underline underline-offset-2 ${
                    currentJournal?.id === journal.id
                      ? 'text-[#03228B] font-bold decoration-[#03228B]' // 선택되었을 때
                      : 'text-[#5389B5] decoration-[#5389B5]'           // 기본
                  }`}
                >
                  {formatDate(new Date(journal.createdAt))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <SystemModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        message="Do you want to delete this journal?"
        onOk={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </MainLayout>
  )
}

export default JournalPage
