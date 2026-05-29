import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'

const GUEST_LIMIT = 3

const sampleReplies = [
  '연말정산이 뭐야?',
  '지금 신청 가능한 복지 있어?',
  '월세 공제 받을 수 있어?',
]

const autoReply: Record<string, string> = {
  '연말정산이 뭐야?': '연말정산은 1년 동안 납부한 세금을 정산해서 더 냈으면 돌려받고, 덜 냈으면 추가로 내는 절차예요. 매년 1~2월에 직장인이라면 꼭 해야 해요! 😊',
  '지금 신청 가능한 복지 있어?': '현재 청년내일저축계좌, 국가장학금, 에너지바우처 등이 신청 기간 중이에요. 로그인하면 내 상황에 맞는 혜택만 골라서 보여드릴게요!',
  '월세 공제 받을 수 있어?': '무주택 세대주라면 월세의 15~17%를 세액공제 받을 수 있어요. 연간 최대 75만원까지 가능해요! 자세한 조건은 로그인 후 확인해보세요 🏠',
}

type Message = { role: 'user' | 'ai'; text: string }

export default function ChatbotGuestPage() {
  const navigate = useNavigate()
  useHeaderConfig({ title: 'AI 도우미', showBell: false })

  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: '안녕하세요! 세금·복지 관련 궁금한 점을 물어보세요 😊\n아래 질문을 눌러서 먼저 체험해보세요!' },
  ])
  const [input, setInput] = useState('')
  const [userCount, setUserCount] = useState(0)
  const [locked, setLocked] = useState(false)

  const sendMessage = (text: string) => {
    if (!text.trim() || locked) return

    const next = userCount + 1
    const reply = autoReply[text] ?? `"${text}"에 대한 답변이에요. 로그인하면 더 자세한 맞춤 정보를 드릴 수 있어요!`

    setMessages(prev => [...prev, { role: 'user', text }, { role: 'ai', text: reply }])
    setInput('')
    setUserCount(next)

    if (next >= GUEST_LIMIT) setLocked(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 체험 배너 */}
      <div style={{ background: 'var(--primary-light)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 14 }}>✨</span>
        <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
          {locked ? '체험이 끝났어요! 로그인하면 무제한으로 사용할 수 있어요' : `${GUEST_LIMIT - userCount}회 더 체험할 수 있어요`}
        </p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
            {msg.role === 'ai' && (
              <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 16 }}>🤖</span>
              </div>
            )}
            <div style={{ maxWidth: '75%', padding: '12px 14px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.role === 'user' ? 'var(--primary)' : 'white', color: msg.role === 'user' ? 'white' : 'var(--text-primary)', fontSize: 14, lineHeight: 1.6, boxShadow: 'var(--shadow-sm)', whiteSpace: 'pre-line' }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* 빠른 질문 (첫 화면) */}
        {userCount === 0 && (
          <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>💡 이런 것들을 물어볼 수 있어요</p>
            {sampleReplies.map((reply, i) => (
              <button key={i} onClick={() => sendMessage(reply)} style={{ width: '100%', padding: '13px 16px', background: 'white', border: 'none', borderBottom: i < sampleReplies.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, textAlign: 'left', color: 'var(--text-primary)' }}>
                <span>{reply}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ))}
          </div>
        )}

        {/* 잠금 메시지 */}
        {locked && (
          <div style={{ background: 'white', borderRadius: 20, padding: '24px', textAlign: 'center', boxShadow: '0 8px 32px rgba(59,111,232,0.15)', border: '1.5px solid var(--border)', margin: '8px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>체험이 끝났어요!</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              로그인하면 AI 도우미를<br />제한 없이 사용할 수 있어요
            </p>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{ marginBottom: 10 }}>
              로그인하고 계속하기
            </button>
          </div>
        )}
      </div>

      {/* 입력창 */}
      <div style={{ background: 'white', borderTop: '1px solid var(--border)', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder={locked ? '로그인 후 이용 가능해요' : '궁금한 내용을 입력해 주세요'}
          disabled={locked}
          style={{ flex: 1, height: 44, background: locked ? '#F3F4F6' : 'var(--bg-gray)', border: 'none', borderRadius: 22, padding: '0 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: locked ? 'var(--text-tertiary)' : 'var(--text-primary)', cursor: locked ? 'not-allowed' : 'text' }}
        />
        <button
          onClick={() => locked ? navigate('/login') : sendMessage(input)}
          style={{ width: 44, height: 44, background: locked ? '#9CA3AF' : 'var(--primary)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="white"/></svg>
        </button>
      </div>
    </div>
  )
}
