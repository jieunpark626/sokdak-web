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
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Character */}
      <div
        className={`absolute ${characterPosition === 'top' ? 'top-0' : 'bottom-0'} left-[58px] z-10 h-[186px] w-[203px]`}
      >
        <img
          src={sokdakCharacter}
          alt="Sokdak Character"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Main Card */}
      <div
        className="relative h-[700px] w-[1280px]"
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
