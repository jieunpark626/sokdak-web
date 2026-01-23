import { useState, useEffect } from 'react'
import { characterApi, type AppearanceType } from '../api/character'

interface UseAppearanceOptionsResult {
  appearances: AppearanceType[]
  isLoading: boolean
  error: Error | null
}

export function useAppearanceOptions(): UseAppearanceOptionsResult {
  const [appearances, setAppearances] = useState<AppearanceType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchAppearances = async () => {
      try {
        setIsLoading(true)
        const data = await characterApi.getAppearances()
        setAppearances(data.items)
      } catch (err) {
        console.error('Failed to fetch appearance options:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch appearance options'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppearances()
  }, [])

  return {
    appearances,
    isLoading,
    error,
  }
}
