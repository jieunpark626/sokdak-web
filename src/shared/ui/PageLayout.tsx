import type { ReactNode } from 'react'
import bg from "../assets/images/bg.png"
import sokdakCharacter from '../assets/images/sokdak-character.png'
import WindowControls from './WindowControls'

interface PageLayoutProps {
  children: ReactNode
  characterPosition?: 'top' | 'bottom'
  cardBackground?: string
}

function PageLayout({
  children,
  characterPosition = 'top',
  cardBackground = 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(140, 207, 255, 1) 51%, rgba(140, 207, 255, 1) 98%)',
}: PageLayoutProps) {
  return (
    <div
      className="relative flex h-screen w-full items-center justify-center overflow-hidden p-4 md:p-8"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Character - 작은 화면에서는 숨김 */}
      <div
        className={`absolute ${characterPosition === 'top' ? 'top-4' : 'bottom-4'} left-4 z-0 hidden h-[120px] w-[130px] opacity-80 md:left-[58px] md:block md:h-[186px] md:w-[203px]`}
      >
        <img
          src={sokdakCharacter}
          alt="Sokdak Character"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Main Card - 반응형 크기 */}
      <div
        className="relative h-full w-full max-h-[700px] max-w-[1280px] md:h-[90vh] lg:h-[700px]"
        style={{
          background: cardBackground,
          borderRadius: '15px',
          boxShadow: '0px 0px 6px 0px rgba(28, 71, 101, 0.9)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <WindowControls />
        {children}
      </div>
    </div>
  )
}

export default PageLayout
