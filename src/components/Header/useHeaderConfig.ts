import { useEffect } from 'react'
import { useHeader, type HeaderConfig } from './HeaderContext'

export function useHeaderConfig(config: HeaderConfig) {
  const { setConfig } = useHeader()
  useEffect(() => {
    setConfig(config)
  }, [])
}
