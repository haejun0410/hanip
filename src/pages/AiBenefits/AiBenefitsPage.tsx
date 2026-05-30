import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME, hanbeoteamAiBenefits } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME, kimgodsaengAiBenefits } from '../../data/kimgodsaeng'
import type { AiBenefitType } from '../../types/aiBenefit'

const TYPE_LABEL: Record<AiBenefitType, string> = {
  tax: '절세 추천',
  policy: '정책 추천',
  hidden: '숨은 공제',
}

const TYPE_BADGE: Record<AiBenefitType, string> = {
  tax: 'badge-blue',
  policy: 'badge-green',
  hidden: 'badge-orange',
}

const FILTERS: [AiBenefitType | 'all', string][] = [
  ['all', '전체'],
  ['tax', '절세'],
  ['policy', '정책'],
  ['hidden', '숨은 공제'],
]

export default function AiBenefitsPage() {
  const navigate = useNavigate()
  const { userName } = useAuth()
  useHeaderConfig({ title: 'AI가 찾은 혜택', showBack: true })

  const benefits = userName === HANBEOTEAM_NAME ? hanbeoteamAiBenefits
    : userName === KIMGODSAENG_NAME ? kimgodsaengAiBenefits
    : kimgodsaengAiBenefits

  const [filter, setFilter] = useState<AiBenefitType | 'all'>('all')
  const filtered = filter === 'all' ? benefits : benefits.filter(b => b.type === filter)

  const fmtAmount = (n: number) => n === 0 ? '소득별 차등' : `${n.toLocaleString()}원`

  return (
    <div style={{ background: 'var(--bg-default)', minHeight: '100%', paddingBottom: 24 }}>

      {/* 필터 칩 */}
      <div style={{ background: 'white', padding: '12px 16px', display: 'flex', gap: 8, borderBottom: '1px solid var(--border)' }}>
        {FILTERS.map(([key, label]) => {
          const count = key === 'all' ? benefits.length : benefits.filter(b => b.type === key).length
          const active = filter === key
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '7px 16px', borderRadius: 99, border: 'none', fontFamily: 'inherit',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                background: active ? 'var(--primary)' : 'var(--bg-gray)',
                color: active ? 'white' : 'var(--text-secondary)',
              }}
            >
              {label} {key === 'all' ? count : ''}
            </button>
          )
        })}
      </div>

      {/* 카드 리스트 */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(benefit => (
          <div
            key={benefit.id}
            onClick={() => navigate(`/ai-benefits/${benefit.id}`)}
            style={{
              background: 'white',
              borderRadius: 20,
              padding: '16px',
              boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              border: benefit.type === 'hidden' ? '1.5px solid #F59E0B44' : '1.5px solid transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: benefit.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {benefit.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className={`badge ${TYPE_BADGE[benefit.type]}`} style={{ fontSize: 10, marginBottom: 6, display: 'inline-block' }}>
                  {TYPE_LABEL[benefit.type]}
                </span>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{benefit.title}</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: benefit.statusColor }}>{benefit.statusLabel}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 6 }}>
                <path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{benefit.amountLabel}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)' }}>{fmtAmount(benefit.amount)}</span>
            </div>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-tertiary)', padding: '4px 16px 0' }}>
        * AI가 분석한 데이터를 기반으로 추천합니다.
      </p>
    </div>
  )
}
