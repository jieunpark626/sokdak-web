import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import sokdakLogo from '../assets/images/sokdak-logo.png';
import welcomeMascot from '../assets/images/welcome-mascot.png';
import iconChat from '../assets/images/icon-chat.png';
import iconRepertoire from '../assets/images/icon-repertoire.svg';
import PageLayout from './PageLayout';
import { tokenStorage } from '../api/token';
import { authApi } from '../api';

interface MainLayoutProps {
  children: ReactNode;
  activeTab: 'chat' | 'journal';
}

const CHAT_CARD_BACKGROUND = 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(140, 207, 255, 0.15) 51%, rgba(140, 207, 255, 0.4) 98%)';

export const MainLayout = ({
  children,
  activeTab
}: MainLayoutProps) => {
  const navigate = useNavigate();
  const username = tokenStorage.getUserName() || 'Guest';

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/login');
  };

  return (
    <PageLayout cardBackground={CHAT_CARD_BACKGROUND}>
      {/* 로고 & URL Bar */}
      <div className="absolute left-4 top-3 h-12 w-40 md:left-[22px] md:top-[13px] md:h-[60px] md:w-[212px]">
        <img src={sokdakLogo} alt="Sokdak" className="h-full w-auto" />
      </div>
      <div className="absolute left-36 top-4 right-4 flex h-8 items-center rounded-[5px] px-3 bg-white/80 shadow-[inset_0px_1px_0.5px_0px_rgba(206,206,208,1)] sm:left-44 sm:right-8 md:left-[253px] md:right-auto md:top-[22px] md:h-[42px] md:w-[478px] md:px-[14px] lg:w-[600px]">
        <span className="text-xs text-[#5389B5]/80 font-['Segoe_UI'] sm:text-sm md:text-[16px]">sokdak.site</span>
      </div>

      <div className="absolute inset-x-2 top-16 bottom-4 rounded-[10px] bg-white/95 shadow-[0px_0px_4px_0px_rgba(51,87,110,0.25)] md:inset-x-[14px] md:top-[86px] md:bottom-[14px]">

        {/* 탭 바 영역 */}
        <div className="relative flex h-12 w-full items-end rounded-t-[10px] bg-gradient-to-b from-white/60 via-[#B9E5FE] to-[#8CCFFF]/40 md:h-[50px]">

          {/* Chat Tab */}
          <div
            onClick={() => navigate('/chat')}
            className={`relative z-10 ml-4 flex h-9 w-24 cursor-pointer items-center justify-center gap-1 rounded-t-[5px] px-3 border-[1.5px] border-[#A6C7E4] border-b-0 transition-all md:ml-[19%] md:h-[40px] md:w-[148px] md:justify-start md:gap-2 md:px-[18px] ${
              activeTab === 'chat'
                ? 'bg-gradient-to-b from-[#C7EEFF] to-[#FCFCFC] opacity-100'
                : 'bg-gradient-to-b from-[#FCFCFC] to-[#C7EEFF] opacity-60 hover:opacity-80'
            }`}
          >
            <span className="text-sm text-[#5389B5] font-['Segoe_UI'] md:text-[18px]">chat</span>
            <img src={iconChat} alt="Chat" className="h-5 w-5 object-contain md:h-[22px] md:w-[22px]" />
            {activeTab === 'chat' && (
              <div className="absolute bottom-[-1.5px] left-0 right-0 h-[3px] bg-[#FCFCFC]" />
            )}
          </div>

          {/* Journal Tab */}
          <div
            onClick={() => navigate('/journal')}
            className={`relative z-10 ml-2 flex h-9 w-24 cursor-pointer items-center justify-center gap-1 rounded-t-[5px] px-3 border-[1.5px] border-[#A6C7E4] border-b-0 transition-all md:ml-[7px] md:h-[40px] md:w-[148px] md:justify-start md:gap-2 md:px-[18px] ${
              activeTab === 'journal'
                ? 'bg-gradient-to-b from-[#C7EEFF] to-[#FCFCFC] opacity-100'
                : 'bg-gradient-to-b from-[#FCFCFC] to-[#C7EEFF] opacity-60 hover:opacity-80'
            }`}
          >
            <span className="text-sm text-[#5389B5] font-['Segoe_UI'] md:text-[18px]">journal</span>
            <img src={iconRepertoire} alt="Journal" className="h-5 w-5 md:h-[22px] md:w-[22px]" />
            {activeTab === 'journal' && (
              <div className="absolute bottom-[-1.5px] left-0 right-0 h-[3px] bg-[#FCFCFC]" />
            )}
          </div>

          <div className="absolute bottom-0 left-0 h-[1.5px] w-full bg-[#A6C7E4]" />
        </div>

        {/* 사이드바 영역 - 모바일에서는 숨김 */}
        <div className="hidden md:block absolute left-0 top-[50px] bottom-0 w-[19%] min-w-[180px] max-w-[240px] rounded-bl-[10px] bg-gradient-to-b from-white/60 via-[#B9E5FE] to-[#8CCFFF]/40 backdrop-blur-[12px]">
          <div className="absolute left-1/2 -translate-x-1/2 top-[30px] h-[160px] w-[160px] lg:h-[192px] lg:w-[192px]">
            <img src={welcomeMascot} alt="Mascot" className="h-full w-full object-contain" />
          </div>
          <p className="absolute w-full text-center top-[200px] text-[18px] font-semibold text-[#3E6F97] font-['Segoe_UI'] lg:top-[232px] lg:text-[20px]">
            {username}
          </p>
          <button
            onClick={handleLogout}
            className="absolute w-full text-center top-[230px] text-[14px] font-medium text-[#3E6F97] underline hover:text-[#2A5070] font-['Segoe_UI'] lg:top-[262px]"
          >
            Logout
          </button>
        </div>

        {/* 본문 콘텐츠 영역 */}
        <div className="absolute left-0 top-12 right-0 bottom-0 flex flex-col items-center justify-center md:left-[19%] md:top-[50px]">
          {children}
        </div>
      </div>
    </PageLayout>
  );
};


export default MainLayout; // TODO: 이거맞나