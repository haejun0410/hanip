import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME, hanbeoteamPolicyList } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME, kimgodsaengPolicyList } from '../../data/kimgodsaeng'

const categories = ['전체', '교육', '주거', '취업·창업', '생활·복지', '대출']

const featured = [
  { id: '1', emoji: '🎓', title: '국가장학금 지원', tag: '교육', tagColor: 'badge-blue', deadline: 'D-30', org: '한국장학재단' },
  { id: '2', emoji: '👨‍👩‍👧', title: '한부모가족 양육비 지원', tag: '생활·복지', tagColor: 'badge-green', deadline: 'D-15', org: '여성가족부' },
  { id: '3', emoji: '⚡', title: '청년전기요금 특별지원', tag: '생활·복지', tagColor: 'badge-green', deadline: 'D-5', org: '한국전력' },
]

const allPolicies = [
  { id: '1', emoji: '🎓', title: '방과후교육비 지원', tag: '교육', tagColor: 'badge-blue', deadline: '2025.06.30', org: '교육부', desc: '방과 후 학교 프로그램 참여 비용을 지원합니다.' },
  { id: '2', emoji: '🏠', title: '신혼부부 전세자금 대출', tag: '주거', tagColor: 'badge-orange', deadline: '2025.12.31', org: '주택도시보증공사', desc: '신혼부부를 위한 전세자금 저금리 대출을 제공합니다.' },
  { id: '3', emoji: '💼', title: '취업성공패키지', tag: '취업·창업', tagColor: 'badge-purple', deadline: '2025.08.15', org: '고용노동부', desc: '취업을 원하는 청년에게 맞춤형 취업 지원을 제공합니다.' },
  { id: '4', emoji: '❤️', title: '에너지바우처 지원', tag: '생활·복지', tagColor: 'badge-green', deadline: '2025.05.31', org: '산업통상자원부', desc: '에너지 취약 계층의 전기·가스 요금을 지원합니다.' },
  { id: '5', emoji: '📰', title: '맞춤 뉴스', tag: '일반', tagColor: 'badge-gray', deadline: '상시', org: '행정안전부', desc: '내 상황에 맞는 정부 복지 뉴스를 받아보세요.' },
]

export default function PolicyPage() {
  const navigate = useNavigate()
  const { userName } = useAuth()
  const [activeCategory, setActiveCategory] = useState('전체')
  const [search, setSearch] = useState('')
  const policies = userName === HANBEOTEAM_NAME
    ? hanbeoteamPolicyList
    : userName === KIMGODSAENG_NAME
    ? kimgodsaengPolicyList
    : allPolicies
  const featuredPolicies = userName === HANBEOTEAM_NAME
    ? hanbeoteamPolicyList.slice(0, 3)
    : userName === KIMGODSAENG_NAME
    ? kimgodsaengPolicyList.slice(0, 3)
    : featured
  useHeaderConfig({ showLogo: true, showBell: true, badgeCount: 2 })

  return (
    <div>
      <div style={{ padding: '16px 16px 12px', background: 'white' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>정책</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 14 }}>나에게 맞는 정책 대출 정보를 찾아보세요</p>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="정책을 검색해보세요" style={{ paddingLeft: 42, height: 46 }} />
        </div>
      </div>

      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        <div className="scroll-x" style={{ display: 'flex', gap: 8, padding: '0 16px' }}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 16px', borderRadius: 99, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', background: activeCategory === cat ? 'var(--primary)' : 'var(--bg-gray)', color: activeCategory === cat ? 'white' : 'var(--text-secondary)' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="section" style={{ paddingBottom: 12 }}>
        <div className="section-header">
          <span className="section-title">추천 정책 ✨</span>
          <button className="section-more">더보기 ›</button>
        </div>
        <div className="scroll-x" style={{ display: 'flex', gap: 12 }}>
          {featuredPolicies.map((p) => (
            <div key={p.id} onClick={() => navigate(`/policy/${p.id}`)} style={{ background: 'white', borderRadius: 20, padding: '16px', minWidth: 160, maxWidth: 180, cursor: 'pointer', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
              <div style={{ width: 48, height: 48, background: 'var(--primary-light)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 10 }}>{p.emoji}</div>
              <span className={`badge ${p.tagColor}`} style={{ marginBottom: 6, display: 'inline-block' }}>{p.tag}</span>
              <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>{p.title}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{p.org}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--error)', background: '#FEE2E2', padding: '2px 6px', borderRadius: 6 }}>{p.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      <div className="section">
        <div className="section-header">
          <span className="section-title">전체 정책 {policies.length}건</span>
          <button className="section-more">최신순 ∨</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {policies.map((p) => (
            <div key={p.id} onClick={() => navigate(`/policy/${p.id}`)} style={{ background: 'white', borderRadius: 18, padding: '14px 16px', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, background: 'var(--primary-light)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{p.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span className={`badge ${p.tagColor}`}>{p.tag}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{p.org}</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p.desc}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>신청 기간: {p.deadline}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 4 }}><path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
