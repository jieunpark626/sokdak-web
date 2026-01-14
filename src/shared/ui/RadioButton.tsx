import { forwardRef, type InputHTMLAttributes } from 'react'

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  isSelected: boolean
}

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, isSelected, ...props }, ref) => {
    return (
      <label className="flex cursor-pointer items-center gap-2">
        <div className="relative">
          <input ref={ref} type="radio" className="peer sr-only" {...props} />
          <div
            className="h-[16px] w-[16px] rounded-sm border border-[#888888] bg-white"
            style={{
              boxShadow:
                'inset 1px 1px 2px rgba(0,0,0,0.2), inset -1px -1px 1px rgba(255,255,255,0.8)',
            }}
          />
          {isSelected && (
            <div className="absolute left-[3px] top-[3px] h-[10px] w-[10px] bg-[#4DB5FF]" />
          )}
        </div>
        <span
          className="text-[13px] text-[#535050]"
          style={{ fontFamily: 'Segoe UI, sans-serif' }}
        >
          {label}
        </span>
      </label>
    )
  }
)

RadioButton.displayName = 'RadioButton'

export default RadioButton
