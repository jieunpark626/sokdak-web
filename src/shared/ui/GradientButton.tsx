import type { ReactNode } from 'react';

//TODO: 리팩토링
interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'blue' | 'pink';
  className?: string;
}

export const GradientButton = ({ 
  children, 
  onClick, 
  variant = 'blue', 
  className = '' 
}: GradientButtonProps) => {
  const backgrounds = {
    blue: 'linear-gradient(180deg, #C9EBFF 0%, #14A4DD 51%, #038EC5 100%)',
    pink: 'linear-gradient(180deg, #F7A6D9 0%, #E34CA8 51%, #C12A85 100%)',
  };

  const borders = {
    blue: '#91D5F1',
    pink: '#FBCFE8',
  };

  return (
    <button
      onClick={onClick}
      // 1. 버튼 자체에 rounded를 주고 overflow-hidden을 걸어 내부 요소가 삐져나오지 않게 합니다.
      className={`relative h-[52px] w-[180px] rounded-[34px] overflow-hidden transition-transform active:scale-95 ${className}`}
    >
      {/* Main Background - top-[3px] 대신 전체를 채우도록 설정 (필요시 조정) */}
      <div
        className="absolute inset-0 h-full w-full rounded-[34px]"
        style={{
          background: backgrounds[variant],
          border: `1px solid ${borders[variant]}`,
          // 버튼 하단 입체감을 위한 그림자 (네모난 잔상 대신 입체감 부여)
          boxShadow: 'inset 0px -4px 4px rgba(0, 0, 0, 0.2)', 
        }}
      />
      
      {/* Top Glossy Highlight (광택 효과) */}
      <div
        className="absolute left-1/2 top-[2px] h-[40%] w-[90%] -translate-x-1/2 rounded-[34px]"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%)',
          filter: 'blur(2px)',
        }}
      />

      {/* Text Content */}
      <span
        className="relative z-10 flex h-full w-full items-center justify-center text-[20px] font-semibold text-white pointer-events-none"
        style={{ fontFamily: 'Segoe UI, sans-serif' }}
      >
        {children}
      </span>
    </button>
  );
};

export default GradientButton