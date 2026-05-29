import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextValue {
  isLoggedIn: boolean
  userName: string
  login: (name?: string) => void
  logout: () => void
}

const DEFAULT_USER_NAME = '한비팅'

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  userName: DEFAULT_USER_NAME,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState(DEFAULT_USER_NAME)

  const login = (name = DEFAULT_USER_NAME) => {
    setUserName(name)
    setIsLoggedIn(true)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout: () => setIsLoggedIn(false) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
