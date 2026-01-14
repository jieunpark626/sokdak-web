import type { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal Window */}
      <div
        className="relative w-[350px] overflow-hidden rounded-[10px]"
        style={{
          boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Title Bar */}
        <div
          className="flex h-[30px] items-center justify-between px-2"
          style={{
            background:
              'linear-gradient(180deg, rgba(0, 0, 128, 1) 0%, rgba(16, 132, 208, 1) 50%, rgba(0, 168, 232, 1) 100%)',
          }}
        >
          <span className="text-sm font-bold text-white">{title}</span>
          <button
            onClick={onClose}
            className="flex h-[20px] w-[20px] items-center justify-center rounded-sm bg-[#C0C0C0]"
            style={{
              border: '1px solid',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
            }}
          >
            <span className="text-xs font-bold text-black">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="bg-[#C0C0C0] p-6">{children}</div>
      </div>
    </div>
  )
}

export default Modal
