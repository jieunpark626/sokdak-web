import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { PageLayout, InputField, RadioButton, AlertModal, Loading } from '../shared/ui'
import { authApi } from '../shared/api' 
import type { RegisterRequest } from '../shared/api'
import sokdakLogo from '../shared/assets/images/sokdak-logo.png'
import rightNav from '../shared/assets/images/right-nav.svg'
import sokdakMascot from '../shared/assets/images/sokdak-mascot.png'
import leftArrow from '../shared/assets/images/left-arrow.png'

const signUpSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('유효한 이메일을 입력해주세요'),
  loginId: z.string().min(1, 'ID를 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  gender: z.enum(['FEMALE', 'MALE', 'OTHER'], {
    message: '성별을 선택해주세요',
  }),
})

type SignUpFormData = z.infer<typeof signUpSchema>

function SignUpPage() {
  const navigate = useNavigate()
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      gender: undefined,
    },
  })

  const selectedGender = watch('gender')

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const requestData: RegisterRequest = {
        loginId: data.loginId,
        email: data.email,
        password: data.password,
        name: data.name,
        gender: data.gender,
      }
      await authApi.register(requestData)
      setShowSuccessPopup(true)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      setErrorMessage(
        axiosError.response?.data?.message || '회원가입에 실패했습니다.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handlePopupClose = () => {
    setShowSuccessPopup(false)
    navigate('/login')
  }

  return (
    <PageLayout>
      {/* Logo */}
      <div className="absolute left-[34px] top-[60px] h-[60px] w-[212px]">
        <img src={sokdakLogo} alt="Sokdak" className="h-full w-auto" />
      </div>

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="absolute left-[440px] top-[250px]"
      >
        <img src={leftArrow} alt="Back" className="h-[32px] w-[32px]" />
      </button>


      {/* Mascot */}
      <div className="absolute left-[544px] top-[100px] h-[192px] w-[192px]">
        <img
          src={sokdakMascot}
          alt="Sokdak Mascot"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="absolute left-[445px] top-[320px] flex w-[391px] flex-col gap-[20px]"
      >
        {/* Name Field */}
        <InputField
          {...register('name')}
          type="text"
          placeholder="Name"
          error={errors.name?.message}
        />

        {/* Email Field */}
        <InputField
          {...register('email')}
          type="email"
          placeholder="Email"
          error={errors.email?.message}
        />

        {/* ID Field */}
        <InputField
          {...register('loginId')}
          type="text"
          placeholder="ID"
          error={errors.loginId?.message}
        />

        {/* Password Field */}
        <InputField
          {...register('password')}
          type="password"
          placeholder="Password"
          error={errors.password?.message}
        />

        {/* Gender Selection */}
        <div className="mt-4 flex items-center justify-center gap-8">
          <RadioButton
            {...register('gender')}
            value="FEMALE"
            label="Female"
            isSelected={selectedGender === 'FEMALE'}
          />
          <RadioButton
            {...register('gender')}
            value="MALE"
            label="Male"
            isSelected={selectedGender === 'MALE'}
          />
          <RadioButton
            {...register('gender')}
            value="OTHER"
            label="Other"
            isSelected={selectedGender === 'OTHER'}
          />
        </div>
        {errors.gender && (
          <p className="text-center text-xs text-red-500">
            {errors.gender.message}
          </p>
        )}
      </form>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        className="absolute left-[620px] top-[630px] text-[14px] text-[#03228B] hover:underline"
      >
        <img src={rightNav} alt="Sign Up" className="h-full w-full" />
      </button>


      {/* Success Popup */}
      <AlertModal
        isOpen={showSuccessPopup}
        onClose={handlePopupClose}
        message="Your SignUp is Done!"
        subMessage="Go check your email to verify your account."
        variant="success"
        buttonText="Login"
        onButtonClick={handlePopupClose}
      />

      {/* Error Popup */}
      <AlertModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        message={errorMessage || ''}
        variant="warning"
        buttonText="OK"
        onButtonClick={() => setErrorMessage(null)}
      />

      {/* Loading */}
      <Loading isLoading={isLoading} message="Signing up..." />
    </PageLayout>
  )
}

export default SignUpPage
