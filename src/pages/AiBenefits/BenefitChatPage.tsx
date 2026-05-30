import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { useChatbotCoach } from '../../context/ChatbotCoachContext'
import { HANBEOTEAM_NAME, hanbeoteamAiBenefits } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME, kimgodsaengAiBenefits } from '../../data/kimgodsaeng'
import { benefitConversations, resolveText } from '../../data/benefitConversations'
import { Bot, CheckCircle2, XCircle } from 'lucide-react'
import type { CoachId, CoachProfile } from '../../context/ChatbotCoachContext'
import Emoji from '../../components/Emoji/Emoji'

type MessageRole = 'ai' | 'user'
type Message = { role: MessageRole; text: string }

const FREE_Q_REPLY: Record<CoachId, string> = {
  easy:     '좋은 질문이에요! 잘 모르는 부분이 있으면 편하게 물어봐요. 더 자세한 내용은 AI 상담 탭에서도 도움받을 수 있어요. 지금은 위에서 답변을 선택해 계속 진행해봐요!',
  summary:  '좋은 질문이에요. 자세한 상담은 AI 상담 탭을 이용해주세요. 지금은 위의 선택지로 계속 진행해주세요.',
  strategy: '유효한 질문입니다. 세부 사항은 AI 상담 탭에서 추가로 확인하세요. 현재 검토를 계속 진행해주세요.',
}

function AiAvatar({ selectedCoach }: { selectedCoach: CoachProfile | null }) {
  return (
    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
      {selectedCoach
        ? <img src={selectedCoach.image} alt="" style={{ width: 62, height: 62, objectFit: 'cover', objectPosition: 'center top', marginTop: 10 }} />
        : <Bot size={18} color="var(--primary)" />}
    </div>
  )
}

export default function BenefitChatPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { userName } = useAuth()
  const { selectedCoach } = useChatbotCoach()
  const coachId = selectedCoach?.id ?? null
  useHeaderConfig({ title: 'AI 확인 중', showBack: true })

  const benefits = userName === HANBEOTEAM_NAME ? hanbeoteamAiBenefits
    : userName === KIMGODSAENG_NAME ? kimgodsaengAiBenefits
    : kimgodsaengAiBenefits

  const benefit = benefits.find(b => b.id === id)
  const conv = id ? benefitConversations[id] : undefined

  const [messages, setMessages] = useState<Message[]>([])
  const [step, setStep] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)
  const [resultType, setResultType] = useState<'positive' | 'negative' | null>(null)
  const [answered, setAnswered] = useState(false)
  const [inputText, setInputText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const allBenefitIds = benefits.map(b => b.id)
  const currentIdx = allBenefitIds.indexOf(id ?? '')
  const nextId = currentIdx < allBenefitIds.length - 1 ? allBenefitIds[currentIdx + 1] : null

  const resolve = (text: Parameters<typeof resolveText>[0]) => resolveText(text, coachId)

  const addAiMessage = (text: string, delay = 800) => {
    setIsTyping(true)
    return new Promise<void>(resolve => setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { role: 'ai', text }])
      resolve()
    }, delay))
  }

  // 인트로 다음에 첫 질문을 표시
  useEffect(() => {
    if (!conv) return
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const addInitialAiMessage = (text: string, delay: number) => {
      setIsTyping(true)
      return new Promise<void>(resolve => {
        timers.push(setTimeout(() => {
          if (!cancelled) {
            setIsTyping(false)
            setMessages(prev => [...prev, { role: 'ai', text }])
          }
          resolve()
        }, delay))
      })
    }

    const start = async () => {
      await addInitialAiMessage(resolve(conv.intro), 600)
      if (cancelled) return
      await addInitialAiMessage(conv.questions[0].message, 700)
      if (cancelled) return
      setStep(0)
      setAnswered(false)
    }
    start()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 스크롤 맨 아래
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 100)
  }, [messages, isTyping, step])

  if (!benefit || !conv) {
    return <div style={{ padding: 24, fontSize: 14, color: 'var(--text-secondary)' }}>대화 데이터를 찾을 수 없어요.</div>
  }

  const currentQuestion = step >= 0 && step < conv.questions.length ? conv.questions[step] : null

  const completionMsg = {
    easy:     '다 확인했어요! 결과를 알려드릴게요.',
    summary:  '확인이 끝났어요. 결과를 알려드릴게요.',
    strategy: '요건 검토가 완료됐어요. 결과를 분석할게요.',
  }

  const handleOption = async (optionIdx: number) => {
    if (answered || step >= conv.questions.length) return
    const question = conv.questions[step]
    const option = question.options[optionIdx]

    setAnswered(true)
    setMessages(prev => [...prev, { role: 'user', text: option.label }])

    if (option.followUp) {
      await addAiMessage(resolve(option.followUp), 900)
    }

    if (!option.isPositive) {
      await addAiMessage(coachId ? completionMsg[coachId] : completionMsg.summary, 700)
      setResultType('negative')
      setStep(99)
      return
    }

    const nextStep = step + 1
    if (nextStep >= conv.questions.length) {
      await addAiMessage(coachId ? completionMsg[coachId] : completionMsg.summary, 700)
      setResultType('positive')
      setStep(99)
    } else {
      await addAiMessage(resolve(conv.questions[nextStep].message), 800)
      setStep(nextStep)
      setAnswered(false)
    }
  }

  const handleFreeQuestion = async () => {
    if (!inputText.trim() || isTyping) return
    const text = inputText.trim()
    setInputText('')
    setMessages(prev => [...prev, { role: 'user', text }])
    const reply = coachId ? FREE_Q_REPLY[coachId] : FREE_Q_REPLY.summary
    await addAiMessage(reply, 900)
  }

  const result = resultType === 'positive'
    ? conv.positiveResult
    : (conv.negativeResult as { title: Parameters<typeof resolveText>[0]; subtitle: Parameters<typeof resolveText>[0]; actions?: Array<{ label: string; action: string }> })

  const handleAction = (action: string) => {
    if (action === 'next' && nextId) navigate(`/ai-benefits/${nextId}/chat`)
    else if (action === 'apply') navigate('/recommend')
    else if (action === 'policy') navigate('/policy')
    else if (action === 'receipt' || action === 'transfer') navigate('/chatbot')
    else navigate('/ai-benefits')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-default)', overflow: 'hidden' }}>

      {/* 혜택 정보 배너 */}
      <div style={{ background: 'white', padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: benefit.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
          <Emoji char={benefit.icon} size={18} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{benefit.title}</p>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{benefit.subtitle}</p>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div ref={scrollRef} className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
            {msg.role === 'ai' && <AiAvatar selectedCoach={selectedCoach} />}
            <div style={{
              maxWidth: '75%', padding: '11px 14px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? 'var(--primary)' : 'white',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              fontSize: 14, lineHeight: 1.6, boxShadow: 'var(--shadow-sm)',
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* AI 타이핑 인디케이터 */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <AiAvatar selectedCoach={selectedCoach} />
            <div style={{ padding: '12px 16px', background: 'white', borderRadius: '18px 18px 18px 4px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', opacity: 0.35 + i * 0.2 }} />
              ))}
            </div>
          </div>
        )}

        {/* 결과 카드 */}
        {step === 99 && result && !isTyping && (
          <div style={{ background: 'white', borderRadius: 20, padding: '24px 20px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              {resultType === 'positive'
                ? <CheckCircle2 size={52} color="#16A34A" strokeWidth={1.5} />
                : <XCircle size={52} color="#9CA3AF" strokeWidth={1.5} />}
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
              {resolve(result.title)}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
              {resolve(result.subtitle)}
            </p>

            {'actions' in result && result.actions && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.actions.map(({ label, action }) => (
                  <button
                    key={label}
                    onClick={() => handleAction(action)}
                    style={{
                      padding: '13px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
                      background: action === 'next' ? 'var(--bg-gray)' : 'var(--primary)',
                      color: action === 'next' ? 'var(--text-primary)' : 'white',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            {resultType === 'negative' && (
              <button
                onClick={() => navigate('/ai-benefits')}
                style={{ marginTop: 8, padding: '13px 0', width: '100%', borderRadius: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, background: 'var(--bg-gray)', color: 'var(--text-secondary)' }}
              >
                목록으로 돌아가기
              </button>
            )}
          </div>
        )}
      </div>

      {/* 선택 버튼 (현재 질문 답변용) */}
      {step !== 99 && currentQuestion && !answered && !isTyping && (
        <div style={{ background: 'white', borderTop: '1px solid var(--border)', padding: '10px 16px 6px', flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8, textAlign: 'center' }}>답변을 선택해 주세요</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOption(i)}
                style={{
                  padding: '11px 16px', borderRadius: 12,
                  border: '1.5px solid var(--border)',
                  background: 'var(--bg-gray)',
                  color: 'var(--text-primary)',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 채팅 입력창 — 항상 표시 */}
      {step !== 99 && (
        <div style={{ background: 'white', borderTop: '1px solid var(--border)', padding: '10px 16px', flexShrink: 0, display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="input"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleFreeQuestion()}
            placeholder="궁금한 점을 입력하세요..."
            style={{ flex: 1, fontSize: 14 }}
          />
          <button
            onClick={handleFreeQuestion}
            disabled={!inputText.trim() || isTyping}
            style={{ width: 42, height: 42, borderRadius: '50%', background: inputText.trim() ? 'var(--primary)' : 'var(--border)', border: 'none', cursor: inputText.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
