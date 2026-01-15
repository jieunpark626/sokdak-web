interface LoadingProps {
  isLoading: boolean
  message?: string
}

function Loading({ isLoading, message = 'Loading...' }: LoadingProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30">
      <div
        className="flex flex-col items-center gap-4 rounded-lg bg-white px-8 py-6 shadow-lg"
        style={{
          border: '1px solid #7CC2F0',
        }}
      >
        {/* 스피너 */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#D8F0FE] border-t-[#7CC2F0]" />
        <p className="text-[14px] font-medium text-[#3E6F97] font-['Segoe_UI']">
          {message}
        </p>
      </div>
    </div>
  )
}

export default Loading
