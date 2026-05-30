import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import Emoji from '../../components/Emoji/Emoji'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME, hanbeoteamAiBenefits } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME, kimgodsaengAiBenefits } from '../../data/kimgodsaeng'

export default function AiBenefitsPage() {
  const navigate = useNavigate()
  const { userName } = useAuth()
  useHeaderConfig({ title: 'AI 감지 알림', showBack: true })

  const allBenefits = userName === HANBEOTEAM_NAME ? hanbeoteamAiBenefits
    : userName === KIMGODSAENG_NAME ? kimgodsaengAiBenefits
    : kimgodsaengAiBenefits
  const benefits = allBenefits.filter(benefit => benefit.type === 'hidden')

  const fmtAmount = (n: number) => n === 0 ? '소득별 차등' : `${n.toLocaleString()}원`

  return (
    <div style={{ background: 'var(--bg-default)', minHeight: '100%', paddingBottom: 24 }}>

      <div style={{ background: 'white', padding: '16px', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 5 }}>
          최근 금융 활동에서 발견했어요
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          카드·계좌 내역을 바탕으로 놓치기 쉬운 혜택 후보를 먼저 알려드려요.
        </p>
      </div>

      {/* 카드 리스트 */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {benefits.map(benefit => (
          <div
            key={benefit.id}
            onClick={() => navigate(`/ai-benefits/${benefit.id}`)}
            style={{
              background: 'white',
              borderRadius: 20,
              padding: '16px',
              boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              border: '1.5px solid #F59E0B44',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: benefit.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                <Emoji char={benefit.icon} size={22} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="badge badge-orange" style={{ fontSize: 10, marginBottom: 6, display: 'inline-block' }}>
                  마이데이터 감지
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
        * 연결된 마이데이터를 바탕으로 AI가 확인이 필요한 후보를 알려드립니다.
      </p>
    </div>
  )
}
