import { useState, useEffect } from 'react'
import { characterApi, type PersonaOptions } from '../api/character'

interface PersonaOption {
  value: string
  label: string
}

interface UsePersonaOptionsResult {
  purposeOptions: PersonaOption[]
  styleOptions: PersonaOption[]
  toneOptions: PersonaOption[]
  isLoading: boolean
  error: Error | null
}

// value를 라벨로 변환 (snake_case -> Title Case)
const formatLabel = (value: string): string => {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// string[] -> PersonaOption[] 변환
const toOptions = (values: string[]): PersonaOption[] => {
  return values.map((value) => ({
    value,
    label: formatLabel(value),
  }))
}

export function usePersonaOptions(): UsePersonaOptionsResult {
  const [options, setOptions] = useState<PersonaOptions | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        setIsLoading(true)
        const data = await characterApi.getPersonas()
        setOptions(data)
      } catch (err) {
        console.error('Failed to fetch persona options:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch persona options'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchPersonas()
  }, [])

  return {
    purposeOptions: options ? toOptions(options.purpose) : [],
    styleOptions: options ? toOptions(options.style) : [],
    toneOptions: options ? toOptions(options.tone) : [],
    isLoading,
    error,
  }
}
