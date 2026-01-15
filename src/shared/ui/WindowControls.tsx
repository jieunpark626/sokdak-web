function WindowControls() {
  return (
    <div className="absolute right-[14px] top-[0px] flex gap-[2px]">
      {/* Minimize */}
      <button
        className="flex h-[30px] w-[45px] items-center justify-center"
        style={{
          background:
            'linear-gradient(180deg, rgba(204, 220, 234, 1) 0%, rgba(181, 198, 214, 1) 49%, rgba(137, 162, 185, 1) 50%, rgba(182, 203, 226, 1) 100%)',
          border: '1px solid #4F5761',
        }}
      >
        <div className="h-[2px] w-[12px] bg-[#535666]" />
      </button>
      {/* Maximize */}
      <button
        className="flex h-[30px] w-[45px] items-center justify-center"
        style={{
          background:
            'linear-gradient(180deg, rgba(204, 220, 234, 1) 0%, rgba(181, 198, 214, 1) 49%, rgba(137, 162, 185, 1) 50%, rgba(182, 203, 226, 1) 100%)',
          border: '1px solid #4F5761',
        }}
      >
        <div className="h-[12px] w-[12px] border-2 border-[#535666]" />
      </button>
      {/* Close */}
      <button
        className="flex h-[30px] w-[75px] items-center justify-center"
        style={{
          background:
            'linear-gradient(180deg, rgba(210, 114, 136, 1) 0%, rgba(201, 74, 100, 1) 49%, rgba(178, 54, 85, 1) 50%, rgba(174, 41, 79, 1) 100%)',
          border: '1px solid #5E1A2F',
        }}
      >
        <span className="text-xl font-bold text-white">×</span>
      </button>
    </div>
  )
}

export default WindowControls
