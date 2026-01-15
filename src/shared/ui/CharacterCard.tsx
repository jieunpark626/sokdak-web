import characterFrame from '../assets/images/character-frame.png';

interface CharacterCardProps {
  image: string;
  size?: number;        // 전체 컨테이너 크기
  onClick?: () => void;
  className?: string;   // 추가적인 마진이나 스타일을 위해 유지
}

export const CharacterCard = ({ 
  image, 
  size = 166, 
  onClick,
  className = "" 
}: CharacterCardProps) => {
  // 프레임 안쪽 여백을 고려한 이미지 크기 (약 84%)
  const innerSize = Math.floor(size * 0.84);

  return (
    <div 
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* 배경 프레임 */}
      <img 
        src={characterFrame} 
        alt="Frame" 
        className="absolute inset-0 h-full w-full object-contain" 
      />
      
      {/* 내부 캐릭터 이미지 */}
      <div 
        className="overflow-hidden rounded-[15%]" 
        style={{ width: `${innerSize}px`, height: `${innerSize}px`, zIndex: 10 }}
      >
        <img 
          src={image} 
          alt="Character" 
          className="h-full w-full object-cover" 
        />
      </div>
    </div>
  );
};

export default CharacterCard