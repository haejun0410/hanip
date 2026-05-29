import { createContext, useContext, useState, type ReactNode } from 'react'

export interface HeaderConfig {
  title?: string
  showBack?: boolean
  showBell?: boolean
  showLogo?: boolean
  badgeCount?: number
  hidden?: boolean
}

interface HeaderContextValue {
  config: HeaderConfig
  setConfig: (cfg: HeaderConfig) => void
}

const HeaderContext = createContext<HeaderContextValue>({
  config: {},
  setConfig: () => {},
})

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HeaderConfig>({ showLogo: true, showBell: true, badgeCount: 2 })
  return <HeaderContext.Provider value={{ config, setConfig }}>{children}</HeaderContext.Provider>
}

export function useHeader() {
  return useContext(HeaderContext)
}
