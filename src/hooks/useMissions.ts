import { useState, useEffect } from 'react'
import { HANBEOTEAM_NAME } from '../data/hanbeoteam'
import { KIMGODSAENG_NAME } from '../data/kimgodsaeng'

export type Mission = {
  id: string
  emoji: string
  title: string
  sub: string
  badge?: string
  badgeColor?: string
  done: boolean
}

const HANBEOTEAM_MISSIONS: Mission[] = [
  { id: 'm1', emoji: '💰', title: '근로장려금 신청하기', sub: '최대 300만원 · 5.31 마감', badge: '마감 임박', badgeColor: '#EF4444', done: false },
  { id: 'm2', emoji: '👩‍👧', title: '한부모 소득공제 서류 준비', sub: '최대 100만원 · 약 10분', badge: '보통', badgeColor: '#F59E0B', done: false },
  { id: 'm3', emoji: '👶', title: '아동양육비 신청 확인', sub: '최대 21만원/월 · 약 5분', done: true },
  { id: 'm4', emoji: '🎨', title: '문화누리카드 신청', sub: '연 13만원 · 약 5분', done: true },
  { id: 'm5', emoji: '🏥', title: '건강보험 납부 내역 확인', sub: '최대 30만원 · 약 5분', done: true },
]

const KIMGODSAENG_MISSIONS: Mission[] = [
  { id: 'm1', emoji: '🏠', title: '월세 세액공제 서류 준비하기', sub: '최대 75만원 · 12.31 마감', badge: '마감 임박', badgeColor: '#EF4444', done: false },
  { id: 'm2', emoji: '🏦', title: 'ISA 계좌 개설 검토하기', sub: '최대 200만원 · 약 15분', badge: '보통', badgeColor: '#F59E0B', done: false },
  { id: 'm3', emoji: '💳', title: '신용카드 vs 체크카드 비율 확인', sub: '최대 30만원 · 약 10분', done: true },
  { id: 'm4', emoji: '🩺', title: '의료비 공제 가능 여부 체크', sub: '최대 15만원 · 약 5분', done: true },
  { id: 'm5', emoji: '📈', title: '연금저축 납입 현황 확인', sub: '최대 66만원 · 약 5분', done: true },
]

function getDefaults(userName: string): Mission[] {
  if (userName === HANBEOTEAM_NAME) return HANBEOTEAM_MISSIONS
  if (userName === KIMGODSAENG_NAME) return KIMGODSAENG_MISSIONS
  return KIMGODSAENG_MISSIONS
}

function load(userName: string): Mission[] {
  try {
    const saved = localStorage.getItem(`hanip-missions-${userName}`)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return getDefaults(userName)
}

export function useMissions(userName: string) {
  const [missions, setMissions] = useState<Mission[]>(() => load(userName))

  useEffect(() => {
    setMissions(load(userName))
  }, [userName])

  const toggleMission = (id: string) => {
    setMissions(prev => {
      const next = prev.map(m => m.id === id ? { ...m, done: !m.done } : m)
      localStorage.setItem(`hanip-missions-${userName}`, JSON.stringify(next))
      return next
    })
  }

  const doneCount = missions.filter(m => m.done).length
  const total = missions.length
  const pct = Math.round((doneCount / total) * 100)
  const nextMissions = missions.filter(m => !m.done)
  const hasUrgent = nextMissions.some(m => m.badge === '마감 임박')

  return { missions, toggleMission, doneCount, total, pct, nextMissions, hasUrgent }
}
