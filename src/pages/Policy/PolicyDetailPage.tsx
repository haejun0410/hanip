import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { getPolicyById } from './policyData'

type Tab = 'info' | 'apply'

function InfoIcon() {
  return (
    <div className="policy-detail-info-icon">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="#3B6FE8" strokeWidth="2" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke="#3B6FE8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PolicyDetailPage() {
  const { id } = useParams()
  const policy = getPolicyById(id)
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  useHeaderConfig({ showBack: true, showBell: true, badgeCount: 2 })

  const rows = [
    {
      label: '신청 기간',
      value: policy.period,
      badge: policy.dday,
      detail: '마감일이 가까워지면 접수가 몰릴 수 있어요. 신청 전 제출 서류와 기관 공고를 먼저 확인해 주세요.',
    },
    {
      label: '지원 대상',
      value: policy.target,
      detail: '세부 자격은 나이, 소득, 가구 구성, 재학 또는 재직 상태에 따라 달라질 수 있습니다.',
    },
    {
      label: '지원 금액 (예시)',
      value: policy.amountText,
      highlight: policy.amountHighlight,
      detail: '최종 지원 금액은 심사 결과와 예산, 중복 수혜 여부에 따라 조정될 수 있습니다.',
    },
    {
      label: '소득 기준',
      value: policy.organization,
      detail: '소득 기준과 산정 방식은 운영 기관 기준을 따릅니다. 신청 시 최신 공고를 확인해 주세요.',
    },
  ]

  return (
    <div className="policy-detail-page">
      <section className="policy-detail-hero">
        <div className="policy-detail-summary">
          <div className="policy-detail-heading">
            <span className={`badge ${policy.badgeColor}`}>{policy.category}</span>
            <h1>{policy.title}</h1>
            <p>{policy.subtitle}</p>
            <button type="button">신청함</button>
          </div>
          <div className="policy-detail-heading">
            <div className="policy-detail-icon">{policy.icon}</div>
          </div>
        </div>
      </section>

      <section className="policy-detail-info-card">
        <div className="policy-detail-tabs">
          {([
            ['info', '정책 정보'],
            ['apply', '신청하기'],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'info' ? (
          <div className="policy-detail-info-list">
            {rows.map((row) => (
              <div
                key={row.label}
                className={`policy-detail-info-row ${expandedRow === row.label ? 'expanded' : ''}`}
              >
                <button
                  type="button"
                  className="policy-detail-info-row-inner"
                  onClick={() => setExpandedRow(expandedRow === row.label ? null : row.label)}
                  aria-expanded={expandedRow === row.label}
                >
                  <InfoIcon />
                  <div className="policy-detail-info-copy">
                    <div className="policy-detail-info-label-row">
                      <p>{row.label}</p>
                      {row.badge && <span>{row.badge}</span>}
                    </div>
                    <p className="policy-detail-info-value">{row.value}</p>
                    {row.highlight && (
                      <p className="policy-detail-info-highlight">{row.highlight}</p>
                    )}
                  </div>
                  <span className="policy-detail-row-chevron"><ChevronDown /></span>
                </button>
                <div className="policy-detail-info-extra">
                  <div>
                    {row.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="policy-detail-apply-pane">
            <div className="policy-detail-docs">
              <h2>신청 전 준비 서류</h2>
              <div>
                {policy.documents.map((doc) => (
                  <p key={doc}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#3B6FE8" />
                      <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{doc}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="policy-detail-org">
              <p>신청 기관</p>
              <strong>{policy.organization}</strong>
              <span>실제 신청 전 기관 공고와 제출 서류를 한 번 더 확인해 주세요.</span>
            </div>

            <button className="btn-primary">{policy.applyUrlLabel}</button>
          </div>
        )}
      </section>

      {activeTab === 'info' && (
        <>
          <section className="policy-detail-links-section">
            <h2>자세히 알아보기</h2>
            <div className="policy-detail-links">
              {policy.detailLinks.map((link) => (
                <button key={link} type="button">
                  <span>⊕</span>
                  {link}
                  <ChevronDown />
                </button>
              ))}
            </div>
          </section>

          <section className="policy-detail-steps-section">
            <h2>신청 방법</h2>
            <div className="policy-detail-steps">
              {policy.steps.map((step, index) => (
                <div key={step} className="policy-detail-step-wrap">
                  <div className="policy-detail-step">
                    <div>{index + 1}</div>
                    <p>{step}</p>
                  </div>
                  {index < policy.steps.length - 1 && <span>›</span>}
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
