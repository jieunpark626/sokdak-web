import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { PageLayout, InputField, AlertModal } from '../shared/ui'
import { authApi } from '../shared/api'
import sokdakMascot from '../shared/assets/images/sokdak-mascot.png'
import sokdakLogo from '../shared/assets/images/sokdak-logo.png'
import rightNav from '../shared/assets/images/right-nav.svg'

const loginSchema = z.object({
  loginId: z.string().min(1, 'User name을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginPage() {
  const navigate = useNavigate()
  const [showEmailVerifyPopup, setShowEmailVerifyPopup] = useState(false)
  const [showLoginErrorPopup, setShowLoginErrorPopup] = useState(false)
  const [showValidationErrorPopup, setShowValidationErrorPopup] = useState(false)
  const [validationErrorMessage, setValidationErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onInvalid = (errors: Record<string, { message?: string }>) => {
    const firstError = Object.values(errors)[0]?.message
    if (firstError) {
      setValidationErrorMessage(firstError)
      setShowValidationErrorPopup(true)
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      await authApi.login(data)
      navigate('/chat')
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string; error?: string }>

      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        ''

      // 이메일 인증이 안 된 경우
      if (
        message.toLowerCase().includes('email') &&
        message.toLowerCase().includes('verif')
      ) {
        setShowEmailVerifyPopup(true)
      } else {
        setShowLoginErrorPopup(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageLayout>
      {/* 컨텐츠 컨테이너 - 중앙 정렬 */}
      <div className="flex h-full w-full flex-col items-center justify-center px-4 py-8 md:px-8">
        {/* Logo */}
        <div className="mb-4 h-[40px] w-[150px] md:mb-6 md:h-[60px] md:w-[212px]">
          <img src={sokdakLogo} alt="Sokdak" className="h-full w-auto" />
        </div>

        {/* Mascot */}
        <div className="mb-6 h-[120px] w-[120px] md:mb-8 md:h-[192px] md:w-[192px]">
          <img
            src={sokdakMascot}
            alt="Sokdak Mascot"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Form */}
<form
  onSubmit={handleSubmit(onSubmit, onInvalid)}
  className="flex w-full max-w-[391px] flex-col gap-3 px-4 md:gap-[13px] md:px-0"
>
  {/* LoginId Field */}
  <InputField
    {...register('loginId')}
    type="text"
    placeholder="User name"
  />

  {/* Password Field + Login Button (공간 확보형 레이아웃) */}
  <div className="relative flex w-full items-center">
    <div className="w-full">
      <InputField
        {...register('password')}
        type="password"
        placeholder="Password"
      />
    </div>
    
    {/* Login Button - Password 입력창 우측에 절대 위치로 고정 */}
    <button
      type="submit"
      disabled={isLoading}
      className="absolute left-full ml-2 h-[42px] w-[40px] flex-shrink-0 disabled:opacity-50"
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
      <img src={rightNav} alt="Login" className="h-full w-full object-contain" />
    </button>
  </div>

  {/* Sign Up Link */}
  <button
    type="button"
    onClick={() => navigate('/signup')}
    className="mt-2 text-center text-[14px] text-[#03228B] hover:underline"
    style={{ fontFamily: 'Segoe UI, sans-serif' }}
  >
    Sign Up
  </button>
</form>
      </div>

      {/* Email Verify Popup */}
      <AlertModal
        isOpen={showEmailVerifyPopup}
        onClose={() => setShowEmailVerifyPopup(false)}
        message="Please verify your email first."
        variant="warning"
        buttonText="OK"
        onButtonClick={() => setShowEmailVerifyPopup(false)}
      />

      {/* Login Error Popup */}
      <AlertModal
        isOpen={showLoginErrorPopup}
        onClose={() => setShowLoginErrorPopup(false)}
        message="로그인에 실패했습니다."
        variant="warning"
        buttonText="OK"
        onButtonClick={() => setShowLoginErrorPopup(false)}
      />

      {/* Validation Error Popup */}
      <AlertModal
        isOpen={showValidationErrorPopup}
        onClose={() => setShowValidationErrorPopup(false)}
        message={validationErrorMessage}
        variant="warning"
        buttonText="OK"
        onButtonClick={() => setShowValidationErrorPopup(false)}
      />
    </PageLayout>
  )
}

export default LoginPage
