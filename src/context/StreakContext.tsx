import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface StreakData {
  streak: number
  lastDate: string | null
  completedDates: string[]
}

interface StreakContextValue {
  streakData: StreakData
  completeToday: () => void
  isTodayDone: boolean
}

const StreakContext = createContext<StreakContextValue | null>(null)

const STORAGE_KEY = 'hanip_streak'

export function toStreakDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

function seedInitial(): StreakData {
  const today = new Date()
  const completed: string[] = []
  for (let i = 7; i >= 1; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    completed.push(toStreakDateStr(d))
  }
  return {
    streak: 7,
    lastDate: completed[completed.length - 1],
    completedDates: completed,
  }
}

function loadData(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  const data = seedInitial()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  return data
}

export function StreakProvider({ children }: { children: ReactNode }) {
  const [streakData, setStreakData] = useState<StreakData>(loadData)

  const todayStr = toStreakDateStr(new Date())
  const isTodayDone = streakData.completedDates.includes(todayStr)

  const completeToday = useCallback(() => {
    const today = toStreakDateStr(new Date())
    setStreakData(prev => {
      if (prev.completedDates.includes(today)) return prev
      let newStreak = 1
      if (prev.lastDate) {
        const diff = daysBetween(prev.lastDate, today)
        if (diff === 1) newStreak = prev.streak + 1
      }
      const updated: StreakData = {
        streak: newStreak,
        lastDate: today,
        completedDates: [...prev.completedDates, today],
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <StreakContext.Provider value={{ streakData, completeToday, isTodayDone }}>
      {children}
    </StreakContext.Provider>
  )
}

export function useStreak() {
  const ctx = useContext(StreakContext)
  if (!ctx) throw new Error('useStreak must be used within StreakProvider')
  return ctx
}
