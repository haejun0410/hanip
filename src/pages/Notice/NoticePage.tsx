import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME, hanbeoteamNotices } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME, kimgodsaengNotices } from '../../data/kimgodsaeng'

const tabs = ['전체', '혜택 추천', '신청/처리 현황', '일반 알림']

const benefitItems = [
  { emoji: '🏠', bg: '#FEF3C7', title: '유자원 결제 내역이 있으세요!', desc: '유자원이 전 주택 혜택을 받기 비기지 마세요?', sub: '임직원·근데 잠깐 버리지 않으세요', cta: '지금 바로 신청', date: '1일 전' },
  { emoji: '🚗', bg: '#DBEAFE', title: '차를 구매하셨나요? 🚗', desc: '차량관련 공제 혜택도 놓치지 마세요!', sub: '자동차 관련 공제 혜택 확인하기', cta: '사용자 이전', date: '3일 전' },
]

const statusItems = [
  { emoji: '🎁', desc: '근로장려금 신청이 완료되었습니다.', date: '2024.06.31', status: '접수완료', statusColor: 'badge-blue' },
  { emoji: '💰', desc: '한부모가족 양육비 지급이 완료되었습니다.', date: '2024.06.31', status: '삭제됨', statusColor: 'badge-gray' },
]

const generalItems = [
  { emoji: '🔔', text: '2024년 5월 월 알림이 있어요! 확인해 보세요.', date: '1일 전' },
  { emoji: '🤖', text: 'AI 봇에서 새로운 조건이 추가되었어요!', date: '2일 전' },
  { emoji: '💬', text: '중요소득에 새 서류가 제공되었어요.', date: '3일 전' },
  { emoji: '📱', text: '카드 시내 내역 서비스가 정식으로 되었어요.', date: '05.03' },
]

export default function NoticePage() {
  const navigate = useNavigate()
  const { userName } = useAuth()
  const [activeTab, setActiveTab] = useState('전체')
  useHeaderConfig({ title: '알림', showBack: true, showBell: false })
  const notices = userName === HANBEOTEAM_NAME
    ? hanbeoteamNotices
    : userName === KIMGODSAENG_NAME
    ? kimgodsaengNotices
    : { benefit: benefitItems, status: statusItems, general: generalItems }

  const showBenefit = activeTab === '전체' || activeTab === '혜택 추천'
  const showStatus = activeTab === '전체' || activeTab === '신청/처리 현황'
  const showGeneral = activeTab === '전체' || activeTab === '일반 알림'

  return (
    <div>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div className="scroll-x" style={{ display: 'flex' }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 16px', background: 'none', border: 'none', borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)' }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div>
        {showBenefit && (
          <div className="section" style={{ paddingBottom: 8 }}>
            <div className="section-header">
              <span className="section-title">혜택 추천 알림</span>
              <button className="section-more">전체보기 ›</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {notices.benefit.map((item, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ background: item.bg, padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 52, height: 52, background: 'white', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{item.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.desc}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{item.sub}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{item.date}</span>
                    <button style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{item.cta}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showStatus && (
          <div className="section" style={{ paddingBottom: 8 }}>
            <div className="section-header">
              <span className="section-title">신청/처리 현황</span>
              <button className="section-more">전체보기 ›</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notices.status.map((item, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 18, padding: '14px 16px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, background: 'var(--bg-gray)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.desc}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{item.date}</p>
                  </div>
                  <span className={`badge ${item.statusColor}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showGeneral && (
          <div className="section">
            <div className="section-header">
              <span className="section-title">일반 알림</span>
              <button className="section-more">전체보기 ›</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {notices.general.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 0', borderBottom: i < notices.general.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 36, height: 36, background: 'var(--bg-gray)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 4 }}>{item.text}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ margin: '0 16px 16px', background: 'var(--primary)', borderRadius: 20, padding: '20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.2)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 4 }}>더 궁금한 내용이 있으신가요?</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>AI 봇에게 물어보세요!</p>
          </div>
          <button onClick={() => navigate('/chatbot')} style={{ background: 'white', color: 'var(--primary)', border: 'none', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            AI 봇 바로가기
          </button>
        </div>
      </div>
    </div>
  )
}
