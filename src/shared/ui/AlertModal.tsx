import { useRef, useState, useLayoutEffect } from 'react'
import popupBg from '../assets/images/popup-bg.png'
import popup from '../assets/images/popup.png'
import warningIcon from '../assets/images/warning-icon.png'
import okIcon from '../assets/images/ok-icon.png'

type AlertModalVariant = 'warning' | 'success'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
  subMessage?: string
  variant?: AlertModalVariant
  buttonText?: string
  onButtonClick?: () => void
}

function AlertModal({
  isOpen,
  onClose,
  message,
  subMessage,
  variant = 'warning',
  buttonText,
  onButtonClick,
}: AlertModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (contentRef.current && isOpen) {
      const { offsetWidth, offsetHeight } = contentRef.current
      setContentSize({ width: offsetWidth, height: offsetHeight })
    }
  }, [isOpen, message, subMessage, buttonText])

  if (!isOpen) return null

  const icon = variant === 'warning' ? warningIcon : okIcon

  // popup 크기: 컨텐츠 + 패딩
  const popupWidth = Math.max(contentSize.width + 40, 400)
  const popupHeight = contentSize.height + 32

  // popup-bg 크기: popup보다 약간 크게
  const bgWidth = popupWidth + 24
  const bgHeight = popupHeight + 20

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - 클릭 시 닫힘 */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Popup Container */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: `${bgWidth}px`,
          height: `${bgHeight}px`,
        }}
      >
        {/* Background Layer */}
        <img
          src={popupBg}
          alt=""
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: 'fill' }}
        />

        {/* Popup Layer - 컨텐츠에 맞게 유동적 */}
        <img
          src={popup}
          alt=""
          className="absolute"
          style={{
            width: `${popupWidth}px`,
            height: `${popupHeight}px`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            objectFit: 'fill',
          }}
        />

        {/* Content */}
        <div
          ref={contentRef}
          className="relative z-10 flex flex-col items-center gap-2 px-4 py-3"
        >
          {/* Icon */}
          <img src={icon} alt="" className="h-[32px] w-[32px]" />

          {/* Message */}
          <p
            className="whitespace-nowrap text-center text-[13px] font-medium text-[#333]"
            style={{ fontFamily: 'Segoe UI, sans-serif' }}
          >
            {message}
          </p>

          {/* Sub Message */}
          {subMessage && (
            <p
              className="whitespace-nowrap text-center text-[12px] text-[#535050]"
              style={{ fontFamily: 'Segoe UI, sans-serif' }}
            >
              {subMessage}
            </p>
          )}

          {/* Button */}
          {buttonText && onButtonClick && (
            <button
              type="button"
              onClick={onButtonClick}
              className="mt-1 rounded-[3px] border border-[#7EB4EA] bg-[#E1EDF7] px-6 py-1.5 text-[12px] text-[#333]"
              style={{ fontFamily: 'Segoe UI, sans-serif' }}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AlertModal
