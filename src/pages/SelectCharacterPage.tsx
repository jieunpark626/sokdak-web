import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout, CharacterCard } from '../shared/ui';
import SystemModal from '../shared/ui/SystemModal';
import { characterApi, PRESET_PERSONAS, PRESET_APPEARANCES } from '../shared/api/character';
import { conversationApi } from '../shared/api/conversation';
import { tokenStorage } from '../shared/api/token';
import { APPEARANCE_IMAGES } from '../shared/utils/appearanceImages';

// 기본 캐릭터용 이미지
const friendImg = APPEARANCE_IMAGES.friend;
const priestImg = APPEARANCE_IMAGES.priest;
const customImg = APPEARANCE_IMAGES.dog; // Custom은 기본적으로 dog 이미지 사용

interface CharacterItemProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}

const CharacterItem = ({ title, description, image, onClick }: CharacterItemProps) => (
  <div className="flex flex-col items-center">
    <CharacterCard image={image} size={166} onClick={onClick} />
    <h3 className="mt-4 text-[20px] font-bold text-[#3E6F97] font-['Segoe_UI']">
      {title}
    </h3>
    <p className="mt-2 text-center text-[14px] text-[#8EADC1] leading-tight whitespace-pre-line font-['Segoe_UI']">
      {description}
    </p>
  </div>
);

function SelectCharacterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'one-time';

  // --- 모달 관련 상태 --- //
  const [modalStep, setModalStep] = useState<'none' | 'confirm' | 'naming'>('none');
  const [characterName, setCharacterName] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (characterType: string) => {
    if (characterType === 'custom') {
      navigate(`/customize-character?mode=${mode}`);
    } else {
      setSelectedType(characterType);
      setModalStep('confirm'); // 1단계: 생성 확인 모달 오픈
    }
  };

  // 1단계 OK 클릭 시 호출
    const handleConfirmOk = () => {
      setModalStep('naming'); // 2단계: 이름 입력 모달로 전환
    };

    // 2단계 OK 클릭 시 호출: 캐릭터 생성 + 대화방 생성
    const handleNamingOk = async () => {
      if (!characterName.trim() || !selectedType || isSubmitting) return;

      const userId = tokenStorage.getUserId();
      if (!userId) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      // 기본 캐릭터의 preset persona 가져오기
      const persona = PRESET_PERSONAS[selectedType];
      if (!persona) {
        alert('유효하지 않은 캐릭터 타입입니다.');
        return;
      }

      setIsSubmitting(true);

      try {
        // 1. 캐릭터 생성
        const appearance = PRESET_APPEARANCES[selectedType];
        const characterResponse = await characterApi.createCharacter({
          user_id: userId,
          name: characterName.trim(),
          persona,
          appearance,
          type: mode === 'one-time' ? 'ephemeral' : 'persistent',
        });

        // 2. 대화방 생성
        const conversationType = mode === 'one-time' ? 'ephemeral' : 'persistent';
        await conversationApi.createConversation({
          character_id: characterResponse.id,
          user_id: userId,
          language: 'auto',
          conversation_type: conversationType,
        });

        setModalStep('none');
        navigate('/chat');
      } catch (error) {
        alert('캐릭터 생성에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <MainLayout activeTab="chat">
      <div className="flex flex-row items-start justify-center gap-[60px]">
        <CharacterItem 
          title="Friend"
          description={"Talk like you would\nwith a friend."}
          image={friendImg}
          onClick={() => handleSelect('friend')}
        />
        <CharacterItem 
          title="Priest"
          description={"Open up about what's\non your mind."}
          image={priestImg}
          onClick={() => handleSelect('priest')}
        />
        <CharacterItem 
          title="Custom"
          description={"Customize it to\nyour preferred style."}
          image={customImg}
          onClick={() => handleSelect('custom')}
        />
      </div>

      {/* 1단계: 캐릭터 생성 확인 모달 (image_e05c77.png 왼쪽 참고) */}
      <SystemModal
        isOpen={modalStep === 'confirm'}
        onClose={() => setModalStep('none')}
        title="캐릭터 생성 확인"
        message={`Would you like to create the ${selectedType} character?`}
        showInput={false}
        onOk={handleConfirmOk}
        onCancel={() => setModalStep('none')}
      />

      {/* 2단계: 캐릭터 이름 지정 모달 (image_e05c77.png 오른쪽 참고) */}
      <SystemModal
        isOpen={modalStep === 'naming'}
        onClose={() => setModalStep('none')}
        title="캐릭터 이름 지정"
        message="Set the name of your character:"
        showInput={true}
        inputValue={characterName}
        onInputChange={setCharacterName}
        onOk={handleNamingOk}
        onCancel={() => setModalStep('none')}
      />
    </MainLayout>
  );
}

export default SelectCharacterPage;