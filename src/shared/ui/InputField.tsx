import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <div className="relative h-[37px] w-full">
        <div
          className="absolute inset-0 rounded-[5px] bg-[#4DB5FF]"
          style={{ filter: 'blur(4px)' }}
        />
        <div
          className="absolute left-[3px] top-[1px] flex h-[35px] w-[385px] items-center rounded-[5px] bg-white px-[11px]"
          style={{ border: '0.5px solid #888888' }}
        >
          <input
            ref={ref}
            className={`w-full bg-transparent text-[13px] text-[#535050] outline-none placeholder:text-[#535050] ${className}`}
            style={{ fontFamily: 'Segoe UI, sans-serif' }}
            {...props}
          />
        </div>
        {error && (
          <p className="absolute -bottom-5 left-0 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    )
  }
)

InputField.displayName = 'InputField'

export default InputField
