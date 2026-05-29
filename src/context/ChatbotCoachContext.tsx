import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import coachBearImage from '../assets/coach-bear.png'
import coachOwlImage from '../assets/coach-owl.png'
import coachPenguinImage from '../assets/coach-penguin.png'

export type CoachId = 'easy' | 'summary' | 'strategy'

export type CoachProfile = {
  id: CoachId
  badge: string
  badgeColor: string
  name: string
  level: string
  description: string
  promise: string
  tags: string[]
  emoji: string
  image: string
  bg: string
  accent: string
  greeting: string
}

export const coachProfiles: CoachProfile[] = [
  {
    id: 'easy',
    badge: '초보형',
    badgeColor: '#22C55E',
    name: '아예 모르는 사람',
    level: '유치원 수준',
    description: '세금이 너무 어려워요.',
    promise: '쉬운 설명으로 차근차근 알려드릴게요!',
    tags: ['쉬운 설명 중심', '기초부터 차근차근'],
    emoji: '🐻',
    image: coachBearImage,
    bg: '#F2FBF5',
    accent: '#22C55E',
    greeting: '안녕하세요! 어려운 세금과 복지 정보를 아주 쉽게 풀어서 설명해 드릴게요.',
  },
  {
    id: 'summary',
    badge: '관심형',
    badgeColor: '#6D5DF6',
    name: '들어는 봤지만 자세히 모르는 사람',
    level: '학생 수준',
    description: '관심은 있는데 헷갈려요.',
    promise: '핵심만 요약하고 상황에 맞게 추천해 드릴게요!',
    tags: ['요약 + 추천 중심', '상황별 혜택 추천'],
    emoji: '🐧',
    image: coachPenguinImage,
    bg: '#F7F4FF',
    accent: '#6D5DF6',
    greeting: '좋아요. 핵심만 먼저 정리하고, 지금 상황에 맞는 혜택을 골라 드릴게요.',
  },
  {
    id: 'strategy',
    badge: '공부형',
    badgeColor: '#3B6FE8',
    name: '약간의 정보를 알고 있고, 배울 의지가 있는 사람',
    level: '성인 수준',
    description: '절세 전략까지 제대로 알고 싶어요.',
    promise: '분석과 전략으로 최대 혜택을 도와드릴게요!',
    tags: ['분석 + 전략 중심', '맞춤 절세 전략 제공'],
    emoji: '🦉',
    image: coachOwlImage,
    bg: '#F1F6FF',
    accent: '#3B6FE8',
    greeting: '준비되셨네요. 조건을 함께 분석해서 받을 수 있는 혜택과 전략을 꼼꼼히 찾아볼게요.',
  },
]

interface ChatbotCoachContextValue {
  selectedCoachId: CoachId | null
  selectedCoach: CoachProfile | null
  setSelectedCoach: (id: CoachId) => void
}

const ChatbotCoachContext = createContext<ChatbotCoachContextValue>({
  selectedCoachId: null,
  selectedCoach: null,
  setSelectedCoach: () => {},
})

const STORAGE_KEY = 'hanip-chatbot-coach'

export function ChatbotCoachProvider({ children }: { children: ReactNode }) {
  const [selectedCoachId, setSelectedCoachId] = useState<CoachId | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return coachProfiles.some((coach) => coach.id === saved) ? saved as CoachId : null
  })

  useEffect(() => {
    if (selectedCoachId) localStorage.setItem(STORAGE_KEY, selectedCoachId)
  }, [selectedCoachId])

  const value = useMemo(() => ({
    selectedCoachId,
    selectedCoach: coachProfiles.find((coach) => coach.id === selectedCoachId) ?? null,
    setSelectedCoach: setSelectedCoachId,
  }), [selectedCoachId])

  return (
    <ChatbotCoachContext.Provider value={value}>
      {children}
    </ChatbotCoachContext.Provider>
  )
}

export function useChatbotCoach() {
  return useContext(ChatbotCoachContext)
}
