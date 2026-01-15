import { useNavigate } from 'react-router-dom'
import { GradientButton, MainLayout } from '../shared/ui'
import oneTimeChatIcon from '../shared/assets/images/one-time-chat-icon.png'
import persistentChatIcon from '../shared/assets/images/persistent-chat-icon.png'

function CreateCharacterPage() {
  const navigate = useNavigate()

  return (
    <MainLayout activeTab="chat">
      {/* 중앙 메인 콘텐츠 영역*/}
      <div className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-10 md:flex-row md:gap-[100px]">
        
        {/* 왼쪽: 일회성 채팅 섹션 */}
        <div className="flex flex-col items-center">
          <p className="mb-4 text-center text-[16px] leading-tight text-[#8EADC1]">
            This is a one-time chat.<br />It will not be saved.
          </p>
          <div className="h-[140px] w-[140px] md:h-[166px] md:w-[166px]">
            <img src={oneTimeChatIcon} alt="One-time Chat" className="h-full w-full object-contain" />
          </div>
          <GradientButton 
            variant="pink" 
            onClick={() => navigate('/select-character?mode=one-time')} 
            className="mt-[20px] md:mt-[27px]"
          >
            One-time Chat
          </GradientButton>
        </div>

        {/* 오른쪽: 지속성 채팅 섹션 */}
        <div className="flex flex-col items-center">
          <p className="mb-4 text-center text-[16px] leading-tight text-[#8EADC1]">
            Your settings and<br />chat history will be saved.
          </p>
          <div className="h-[140px] w-[140px] md:h-[166px] md:w-[166px]">
            <img src={persistentChatIcon} alt="Persistent Chat" className="h-full w-full object-contain" />
          </div>
          <GradientButton 
            variant="blue" 
            onClick={() => navigate('/select-character?mode=persistent')} 
            className="mt-[20px] md:mt-[27px]"
          >
            Persistent Chat
          </GradientButton>
        </div>

      </div>
    </MainLayout>
  )
}

export default CreateCharacterPage