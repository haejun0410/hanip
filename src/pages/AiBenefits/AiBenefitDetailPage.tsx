import { useNavigate, useParams } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME, hanbeoteamAiBenefits } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME, kimgodsaengAiBenefits } from '../../data/kimgodsaeng'
import type { AiBenefitType } from '../../types/aiBenefit'

const TYPE_LABEL: Record<AiBenefitType, string> = {
  tax: '절세 추천',
  policy: '정책 추천',
  hidden: '숨은 공제 후보',
}

const TYPE_COLOR: Record<AiBenefitType, string> = {
  tax: 'var(--primary)',
  policy: '#16A34A',
  hidden: '#D97706',
}

const TYPE_BG: Record<AiBenefitType, string> = {
  tax: 'var(--primary-light)',
  policy: '#F0FDF4',
  hidden: '#FEF3C7',
}

export default function AiBenefitDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { userName } = useAuth()
  useHeaderConfig({ title: '혜택 상세', showBack: true })

  const benefits = userName === HANBEOTEAM_NAME ? hanbeoteamAiBenefits
    : userName === KIMGODSAENG_NAME ? kimgodsaengAiBenefits
    : kimgodsaengAiBenefits

  const benefit = benefits.find(b => b.id === id)

  if (!benefit) {
    return <div style={{ padding: 24, fontSize: 14, color: 'var(--text-secondary)' }}>항목을 찾을 수 없어요.</div>
  }

  const fmtAmount = (n: number) => n === 0 ? '소득별 차등 지원' : `${n.toLocaleString()}원`

  return (
    <div style={{ background: 'var(--bg-default)', minHeight: '100%', paddingBottom: 32 }}>

      {/* 상단 정보 카드 */}
      <div style={{ background: 'white', padding: '20px 16px 24px' }}>
        <span style={{
          fontSize: 12, fontWeight: 700,
          color: TYPE_COLOR[benefit.type],
          background: TYPE_BG[benefit.type],
          borderRadius: 8, padding: '4px 10px',
          display: 'inline-block', marginBottom: 16,
        }}>
          {TYPE_LABEL[benefit.type]}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: benefit.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
            {benefit.icon}
          </div>
          <div>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{benefit.title}</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{benefit.subtitle}</p>
          </div>
        </div>

        <div style={{ background: 'var(--bg-gray)', borderRadius: 16, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{benefit.amountLabel}</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{fmtAmount(benefit.amount)}</span>
        </div>
      </div>

      {/* AI가 발견한 이유 */}
      <div style={{ background: 'white', marginTop: 8, padding: '20px 16px' }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 12 }}>AI가 발견한 이유</p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{benefit.aiReason}</p>
      </div>

      {/* 확인할 조건 */}
      <div style={{ background: 'white', marginTop: 8, padding: '20px 16px' }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>확인할 조건</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {benefit.conditions.map((cond, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{cond}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA 버튼 */}
      <div style={{ padding: '20px 16px 0' }}>
        <button className="btn-primary" onClick={() => navigate('/chatbot')} style={{ marginBottom: 10 }}>
          AI와 확인하기
        </button>
        {benefit.type === 'hidden' && (
          <button className="btn-secondary" style={{ marginBottom: 10 }}>
            영수증 등록하기
          </button>
        )}
        <button
          onClick={() => navigate(-1 as never)}
          style={{ width: '100%', background: 'none', border: 'none', fontSize: 14, color: 'var(--text-tertiary)', cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }}
        >
          나중에 하기
        </button>
      </div>
    </div>
  )
}
