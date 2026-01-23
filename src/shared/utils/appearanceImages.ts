import type { AppearanceType } from '../api/character'

// Appearance 이미지 임포트
import appearanceDog from '../assets/images/appearance-dog.png'
import appearanceDuck from '../assets/images/appearance-duck.png'
import appearanceFrog from '../assets/images/appearance-frog.png'
import appearanceFriend from '../assets/images/appearance-friend.png'
import appearancePriest from '../assets/images/appearance-priest.png'

// Appearance 타입별 이미지 매핑
export const APPEARANCE_IMAGES: Record<AppearanceType, string> = {
  dog: appearanceDog,
  duck: appearanceDuck,
  frog: appearanceFrog,
  friend: appearanceFriend,
  priest: appearancePriest,
}

// 모든 appearance 타입 목록
export const ALL_APPEARANCES: AppearanceType[] = ['dog', 'duck', 'frog', 'friend', 'priest']

/**
 * Appearance 타입에 해당하는 이미지 경로를 반환
 * @param appearance - 캐릭터 외형 타입
 * @returns 이미지 경로
 */
export function getAppearanceImage(appearance: AppearanceType): string {
  return APPEARANCE_IMAGES[appearance]
}
