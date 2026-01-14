import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../shared/ui'
import sokdakLogo from '../shared/assets/images/sokdak-logo.png'
import welcomeMascot from '../shared/assets/images/welcome-mascot.png'
import welcomeIcon from '../shared/assets/images/welcome-icon.png'
import iconRepertoire from '../shared/assets/images/icon-repertoire.svg'
import iconChat from '../shared/assets/images/icon-chat.png'

const CHAT_CARD_BACKGROUND =
  'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(140, 207, 255, 0.15) 51%, rgba(140, 207, 255, 0.4) 98%)'

function ChatPage() {
  const navigate = useNavigate()

  return (
    <PageLayout cardBackground={CHAT_CARD_BACKGROUND}>

        {/* Logo - Top Left */}
        <div className="absolute left-[22px] top-[13px] h-[60px] w-[212px]">
          <img src={sokdakLogo} alt="Sokdak" className="h-full w-auto" />
        </div>

        {/* URL Bar */}
        <div
          className="absolute left-[253px] top-[22px] flex h-[42px] w-[478px] items-center rounded-[5px] px-[14px]"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            boxShadow: 'inset 0px 1px 0.5px 0px rgba(206, 206, 208, 1)',
          }}
        >
          <span className="text-[16px] text-[#5389B5]/80" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            sokdak.site
          </span>
        </div>

        {/* Content Area */}
        <div
          className="absolute left-[14px] top-[86px] h-[600px] w-[1252px] rounded-[10px]"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0px 0px 4px 0px rgba(51, 87, 110, 0.25)',
          }}
        >
          {/* Tab Bar */}
          <div
            className="relative flex h-[50px] w-full items-end rounded-t-[10px]"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(185, 229, 254, 1) 35%, rgba(140, 207, 255, 0.4) 98%)',
            }}
          >
            {/* Chat Tab (Active) */}
            <div
              className="ml-[239px] flex h-[40px] w-[148px] items-center gap-2 rounded-t-[5px] px-[18px]"
              style={{
                background: 'linear-gradient(180deg, rgba(199, 238, 255, 1) 0%, rgba(252, 252, 252, 1) 100%)',
                border: '1.5px solid #A6C7E4',
                borderBottom: 'none',
              }}
            >
              <span className="text-[18px] text-[#5389B5]" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                chat
              </span>
              <img src={iconChat} alt="Chat" className="h-[22px] w-[22px] object-contain" />
            </div>

            {/* Journal Tab */}
            <div
              className="ml-[7px] flex h-[40px] w-[148px] items-center gap-2 rounded-t-[5px] px-[18px] opacity-60"
              style={{
                background: 'linear-gradient(180deg, rgba(252, 252, 252, 1) 0%, rgba(199, 238, 255, 1) 100%)',
                border: '1.5px solid #A6C7E4',
                borderBottom: 'none',
              }}
            >
              <span className="text-[18px] text-[#5389B5]" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                journal
              </span>
              <img src={iconRepertoire} alt="Journal" className="h-[22px] w-[22px]" />
            </div>

            {/* Tab Divider Line */}
            <div className="absolute bottom-0 left-0 h-[3px] w-full bg-[#A6C7E4]" />
          </div>

          {/* Left Sidebar */}
          <div
            className="absolute left-0 top-[50px] h-[550px] w-[240px]"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(185, 229, 254, 1) 35%, rgba(140, 207, 255, 0.4) 98%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Mascot in Sidebar */}
            <div className="absolute left-[30px] top-[30px] h-[192px] w-[192px]">
              <img src={welcomeMascot} alt="Mascot" className="h-full w-full object-contain" />
            </div>

            {/* Username */}
            <p
              className="absolute left-[82px] top-[232px] text-[20px] font-semibold text-[#3E6F97]"
              style={{ fontFamily: 'Segoe UI, sans-serif' }}
            >
              enong_0a
            </p>
          </div>

          {/* Main Content */}
          <div className="absolute left-[240px] top-[50px] flex h-[550px] w-[1012px] flex-col items-center justify-center">
            {/* Character Icon */}
            <div className="h-[139px] w-[139px]">
              <img src={welcomeIcon} alt="Character" className="h-full w-full object-contain" />
            </div>

            {/* Message */}
            <p
              className="mt-[20px] text-center text-[20px] text-[#AEAEAE]"
              style={{ fontFamily: 'Segoe UI, sans-serif' }}
            >
              Create your own character to start chatting.
            </p>

            {/* Create Now Button */}
            <button
              onClick={() => navigate('/create')}
              className="relative mt-[27px] h-[52px] w-[180px]"
            >
              <div
                className="absolute left-0 top-[3px] h-[50px] w-[180px] rounded-[34px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(201, 235, 255, 1) 0%, rgba(20, 164, 221, 1) 51%, rgba(3, 142, 197, 1) 100%)',
                  border: '1px solid #91D5F1',
                }}
              />
              <div
                className="absolute left-[16px] top-[4.5px] h-[25px] w-[148px] rounded-[34px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.55) 45%, rgba(255, 255, 255, 0) 100%)',
                  filter: 'blur(4px)',
                }}
              />
              <span
                className="absolute left-0 top-[1px] flex h-[50px] w-[180px] items-center justify-center text-[20px] font-semibold text-white"
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              >
                Create Now
              </span>
            </button>
          </div>
        </div>
    </PageLayout>
  )
}

export default ChatPage
