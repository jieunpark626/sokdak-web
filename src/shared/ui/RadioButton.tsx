// RadioButton.tsx
import { forwardRef, type InputHTMLAttributes } from 'react'

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  isSelected?: boolean // 1. 여기에 isSelected 추가 (에러 해결 핵심)
}

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, isSelected, ...props }, ref) => { // 2. props에서 분리
    return (
      <label className="flex cursor-pointer items-center gap-2 group">
        <div className="relative flex items-center justify-center">
          <input 
            ref={ref} 
            type="radio" 
            className="peer sr-only" 
            {...props} 
          />
          
          {/* 바깥쪽 원: isSelected가 true면 테두리 색상 변경 */}
          <div
            className={`h-[18px] w-[18px] rounded-full border transition-all ${
              isSelected ? 'border-[#4DB5FF]' : 'border-[#888888]'
            } bg-white`}
            style={{ boxShadow: 'inset 0px 1px 2px rgba(0,0,0,0.1)' }}
          />

          {/* 안쪽 점: isSelected가 true면 보임 */}
          <div className={`absolute h-[8px] w-[8px] rounded-full bg-[#4DB5FF] transition-opacity ${
            isSelected ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>

        <span className="text-[14px] text-[#535050] select-none">
          {label}
        </span>
      </label>
    )
  }
)

RadioButton.displayName = 'RadioButton'
export default RadioButton