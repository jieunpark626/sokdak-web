import popupBg from '../assets/images/popup-bg.png'
import popup from '../assets/images/popup.png'
import systemModalIcon from '../assets/images/icon-system-modal.png'

interface SystemModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  showInput?: boolean
  inputValue?: string
  onInputChange?: (val: string) => void
  onOk: () => void
  onCancel: () => void
}

function SystemModal({
  isOpen,
  onClose,
  message,
  showInput = false,
  inputValue,
  onInputChange,
  onOk,
  onCancel,
}: SystemModalProps) {
  if (!isOpen) return null

  // 고정 크기 설정
  const modalWidth = showInput ? 520 : 420
  const modalHeight = showInput ? 200 : 160

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative"
        style={{ width: `${modalWidth}px`, height: `${modalHeight}px` }}
      >
        {/* Background Layer (외곽 프레임) */}
        <img
          src={popupBg}
          alt=""
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: 'fill' }}
        />

        {/* 타이틀 바 아이콘 */}
        <div className="absolute left-[8px] top-[10px]">
          <img src={systemModalIcon} alt="" className="h-[18px] w-[18px]" />
        </div>

        {/* 내부 흰색 팝업 영역 */}
        <div
          className="absolute"
          style={{
            top: '38px',
            left: '7px',
            right: '7px',
            bottom: '7px',
          }}
        >
          <img
            src={popup}
            alt=""
            className="absolute inset-0 h-full w-full"
            style={{ objectFit: 'fill' }}
          />

          {/* 콘텐츠 */}
          <div className="relative z-10 flex h-full flex-col p-5">
            <div className="flex flex-1 items-center gap-4">
              <img src={systemModalIcon} alt="" className="h-[28px] w-[28px] flex-shrink-0" />

              {showInput ? (
                <div className="flex items-center gap-3">
                  <span className="whitespace-nowrap font-['Segoe_UI'] text-[15px] font-medium text-[#171F2A]">
                    {message}
                  </span>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => onInputChange?.(e.target.value)}
                    className="h-[26px] w-[160px] rounded-[1px] px-2 text-[13px] outline-none"
                    style={{
                      border: '1px solid #D2D2D2',
                      boxShadow: 'inset -1.5px -2.5px 2px rgba(110, 182, 245, 0.26)',
                      fontFamily: 'Segoe UI, sans-serif',
                    }}
                    autoFocus
                  />
                </div>
              ) : (
                <p className="font-['Segoe_UI'] text-[15px] font-medium leading-snug text-[#171F2A]">
                  {message}
                </p>
              )}
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onOk}
                className="h-[28px] min-w-[75px] rounded-[3px] border border-[#7CC2F0] bg-gradient-to-b from-white to-[#E1F2FF] font-['Segoe_UI'] text-[12px] font-semibold text-[#3E6F97] active:shadow-inner"
              >
                OK
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="h-[28px] min-w-[75px] rounded-[3px] border border-[#7CC2F0] bg-gradient-to-b from-white to-[#E1F2FF] font-['Segoe_UI'] text-[12px] font-semibold text-[#3E6F97] active:shadow-inner"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemModal