import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MainLayout,
  InputField,
  RadioButton,
  GradientButton,
  CharacterCard
} from '../shared/ui';
import { characterApi } from '../shared/api/character';
import { conversationApi } from '../shared/api/conversation';
import { tokenStorage } from '../shared/api/token';
import { usePersonaOptions } from '../shared/hooks/usePersonaOptions';

// 아이콘 이미지 임포트
import iconName from '../shared/assets/images/icon-name.png';
import iconPurpose from '../shared/assets/images/icon-purpose.png';
import iconStyle from '../shared/assets/images/icon-style.png';
import iconTone from '../shared/assets/images/icon-tone.png';
import iconAppearance from '../shared/assets/images/icon-appearance.png';

// 캐릭터 외형 이미지 임포트
import friendImg from '../shared/assets/images/appearance-0.png';
import priestImg from '../shared/assets/images/appearance-1.png';
import customImg from '../shared/assets/images/appearance-2.png';

/**
 * CustomizeCharacterPage: 사용자 정의 캐릭터 설정 페이지
 */
function CustomizeCharacterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL 쿼리 스트링에서 모드 추출 (one-time 또는 persistent)
  const mode = searchParams.get('mode') || 'one-time';

  // --- API에서 persona 옵션 가져오기 ---
  //const { purposeOptions, styleOptions, toneOptions, isLoading: isLoadingOptions } = usePersonaOptions();
  const { purposeOptions, styleOptions, toneOptions} = usePersonaOptions();

  // --- 상태 관리 (State) ---
  const [name, setName] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('casual_chat');
  const [selectedStyle, setSelectedStyle] = useState('chatty');
  const [selectedTone, setSelectedTone] = useState('warm');
  const [selectedAppearance, setSelectedAppearance] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appearances = [friendImg, priestImg, customImg];

  return (
    <MainLayout activeTab="chat">
      <div className="flex h-full w-full flex-col px-[60px] py-[30px] overflow-y-auto custom-scrollbar">
        
        {/* Header 영역 */}
        <div className="mb-6">
          <h2 className="text-[28px] font-bold text-[#3E6F97] font-['Segoe_UI']">Custom</h2>
          <p className="text-[16px] text-[#8EADC1] font-['Segoe_UI']">Customize it to your preferred style...</p>
          <div className="mt-4 h-[1px] w-full bg-[#D9E9F5]" />
        </div>

        {/* 설정 폼 섹션들 */}
        <div className="flex flex-col gap-8 pb-10">
          
          {/* 1. Name 입력 섹션 (w-fit으로 번짐 방지) */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img src={iconName} alt="Name" className="w-5 h-5 object-contain" />
              <span className="text-[18px] font-bold text-[#5389B5] font-['Segoe_UI']">Name</span>
            </div>
            <div className="pl-7 w-fit">
              <InputField 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="An Average AI Assistant" 
                className="w-[300px]" 
              />
            </div>
          </section>

          {/* 2. Purpose 선택 섹션 */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img src={iconPurpose} alt="Purpose" className="w-5 h-5 object-contain" />
              <span className="text-[18px] font-bold text-[#5389B5] font-['Segoe_UI']">Purpose</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pl-7">
              {purposeOptions.map((option) => (
                <RadioButton
                  key={option.value}
                  label={option.label}
                  isSelected={selectedPurpose === option.value}
                  onClick={() => setSelectedPurpose(option.value)}
                />
              ))}
            </div>
          </section>

          {/* 3. Style 선택 섹션 */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img src={iconStyle} alt="Style" className="w-5 h-5 object-contain" />
              <span className="text-[18px] font-bold text-[#5389B5] font-['Segoe_UI']">Style</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pl-7">
              {styleOptions.map((option) => (
                <RadioButton
                  key={option.value}
                  label={option.label}
                  isSelected={selectedStyle === option.value}
                  onClick={() => setSelectedStyle(option.value)}
                />
              ))}
            </div>
          </section>

          {/* 4. Tone 선택 섹션 */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img src={iconTone} alt="Tone" className="w-5 h-5 object-contain" />
              <span className="text-[18px] font-bold text-[#5389B5] font-['Segoe_UI']">Tone</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pl-7">
              {toneOptions.map((option) => (
                <RadioButton
                  key={option.value}
                  label={option.label}
                  isSelected={selectedTone === option.value}
                  onClick={() => setSelectedTone(option.value)}
                />
              ))}
            </div>
          </section>

          {/* 5. Appearance 선택 섹션 */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img src={iconAppearance} alt="Appearance" className="w-5 h-5 object-contain" />
              <span className="text-[18px] font-bold text-[#5389B5] font-['Segoe_UI']">Appearance</span>
            </div>
            <div className="flex gap-4 pl-7">
              {appearances.map((img, idx) => (
                <div key={idx} className="relative">
                  <CharacterCard 
                    image={img} 
                    size={80} 
                    onClick={() => setSelectedAppearance(idx)} 
                  />
                  {/* 선택된 이미지에 표시될 체크 표시 (필요 시) */}
                  {selectedAppearance === idx && (
                    <div className="absolute -right-1 -top-1 z-20 h-5 w-5 rounded-full bg-[#5389B5] flex items-center justify-center border-2 border-white">
                       <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 하단 완료 버튼 영역 */}
        <div className="sticky bottom-0 right-0 flex justify-end bg-white/5 py-2">
          <GradientButton
            variant="blue"
            className="w-[180px] shadow-[0px_4px_10px_0px_rgba(83,137,181,0.3)]"
            onClick={async () => {
              if (isSubmitting) return;

              const userId = tokenStorage.getUserId();
              if (!userId) {
                alert('로그인이 필요합니다.');
                navigate('/login');
                return;
              }

              setIsSubmitting(true);

              try {
                // 1. 캐릭터 생성
                const characterResponse = await characterApi.createCharacter({
                  user_id: userId,
                  name: name || 'An Average AI Assistant',
                  persona: {
                    tone: selectedTone,
                    style: selectedStyle,
                    purpose: selectedPurpose,
                    gender: 'neutral',
                  },
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

                navigate('/chat');
              } catch (error) {
                alert('캐릭터 생성에 실패했습니다. 다시 시도해주세요.');
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {isSubmitting ? 'Creating...' : 'Done'}
          </GradientButton>
        </div>
      </div>
    </MainLayout>
  );
}

export default CustomizeCharacterPage;