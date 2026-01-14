import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { PageLayout, InputField, Popup } from '../shared/ui'
import sokdakMascot from '../shared/assets/images/sokdak-mascot.png'
import sokdakLogo from '../shared/assets/images/sokdak-logo.png'
import rightNav from '../shared/assets/images/right-nav.svg'

const loginSchema = z.object({
  username: z.string().min(1, 'User name을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginPage() {
  const navigate = useNavigate()
  const [showEmailVerifyPopup, setShowEmailVerifyPopup] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    console.log('Login data:', data)
    // TODO: 실제 API 연동 시 이메일 인증 여부 확인
    const isEmailVerified = false // 임시로 false 설정
    if (!isEmailVerified) {
      setShowEmailVerifyPopup(true)
      return
    }
    navigate('/chat')
  }

  return (
     <PageLayout>
      {/* Logo */}
      <div className="absolute left-[534px] top-[107px] h-[60px] w-[212px]">
        <img src={sokdakLogo} alt="Sokdak" className="h-full w-auto" />
      </div>

      {/* Mascot */}
      <div className="absolute left-[544px] top-[214px] h-[192px] w-[192px]">
        <img
          src={sokdakMascot}
          alt="Sokdak Mascot"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="absolute left-[445px] top-[446px] flex w-[391px] flex-col gap-[13px]"
      >
        {/* Username Field */}
        <InputField
          {...register('username')}
          type="text"
          placeholder="User name"
          error={errors.username?.message}
        />

        {/* Password Field */}
        <InputField
          {...register('password')}
          type="password"
          placeholder="Password"
          error={errors.password?.message}
        />
      </form>

      {/* Sign Up Link */}
      <button
        type="button"
        onClick={() => navigate('/signup')}
        className="absolute left-[616px] top-[559px] text-[14px] text-[#03228B] hover:underline"
        style={{ fontFamily: 'Segoe UI, sans-serif' }}
      >
        Sign Up
      </button>

      {/* Login Button */}
      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        className="absolute left-[848px] top-[458px] h-[42px] w-[40px]"
      >
        <img src={rightNav} alt="Login" className="h-full w-full" />
      </button>

      {/* Email Verify Popup */}
      <Popup
        isOpen={showEmailVerifyPopup}
        onClose={() => setShowEmailVerifyPopup(false)}
        message="Please verify your email first."
        variant="warning"
      />
    </PageLayout>
  )
}

export default LoginPage
