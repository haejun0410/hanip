import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { useChatbotCoach } from '../../context/ChatbotCoachContext'
import { HANBEOTEAM_NAME } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME } from '../../data/kimgodsaeng'

const quickReplies = [
  '지금 신청 가능한 혜택이 있어?',
  '내가 받을 수 있는 정책을 알려줘',
  '종합소득세 신고 기간이 언제야?',
  '소득공제와 세액공제 차이가 뭐야?',
  '교육비 공제는 어떻게 받아?',
]

const ragAnswers: Record<string, { answer: string; sources: string[] }> = {
  '한부모 소득공제랑 부녀자 소득공제 둘 다 받을 수 있어?': {
    answer: [
      '자료 3건을 먼저 확인했어요.',
      '',
      '결론부터 말하면 둘 다 동시에 받을 수는 없어요.',
      '한버팀님은 자녀 1명을 부양하는 한부모 가정이라 부녀자 공제 50만 원보다 한부모 공제 100만 원이 더 유리해요.',
      '그래서 앱에서는 한부모 공제를 우선 추천해요.',
    ].join('\n'),
    sources: ['소득세법 제51조 제1항 제3호', '소득세법 제51조 제2항', '정부24 가족관계 스크래핑 결과'],
  },
  '친정 엄마가 아이를 봐주시는데, 따로 살아도 인적공제 받을 수 있어?': {
    answer: [
      '은행 이체내역과 인적공제 규정을 함께 대조했어요.',
      '',
      '가능성이 있어요. 주소가 달라도 주거 형편상 따로 살고, 실제로 생활비를 보태드리는 경우에는 부양가족 공제를 검토할 수 있어요.',
      '다만 어머님이 만 60세 이상이고 연간 소득금액 100만 원 이하인지 확인해야 해요.',
      '조건을 충족하면 1인당 150만 원 기본공제 후보가 됩니다.',
    ].join('\n'),
    sources: ['소득세법 제50조', '소득세법 시행령 제106조', '주거래은행 정기 이체내역'],
  },
  '근로장려금 신청 대상인지 조건을 3줄로 요약해 줘.': {
    answer: [
      '홈택스 소득자료와 가족관계 정보를 기준으로 요약했어요.',
      '',
      '1. 한버팀님은 연소득 약 2,600만 원의 근로소득자로 장려금 검토 대상이에요.',
      '2. 한부모 가정과 자녀 1명 정보가 확인되어 자녀장려금도 함께 검토돼요.',
      '3. 최종 대상 여부는 가구원 재산 합계와 5월 정기신청 서류 확인 후 확정됩니다.',
    ].join('\n'),
    sources: ['조세특례제한법 제100조의2', '조세특례제한법 제100조의27', '홈택스 근로소득 스크래핑 결과'],
  },
  '연말정산이 13월의 월급이라던데 나 세금 토해낼 수도 있어?': {
    answer: [
      '국세청 급여자료와 카드 사용 흐름을 먼저 봤어요.',
      '',
      '네, 토해낼 수도 있어요. 회사가 매달 월급에서 세금을 대략 떼어가는데, 연말정산 때 실제 공제보다 덜 냈다고 계산되면 추가 납부가 생겨요.',
      '반대로 월세, 청약저축, 기부금, 안경 구입비 같은 공제를 잘 챙기면 이미 낸 세금 일부를 돌려받을 수 있어요.',
      '김갓생님은 현재 기준 예상 환급액이 145만 원으로 잡혀 있어요.',
    ].join('\n'),
    sources: ['국세청 연말정산 미리보기 자료', '소득세법 특별세액공제 항목', '마이데이터 급여·카드 사용내역'],
  },
  '체크카드 쓰면 돈 돌려준다던데 신용카드는 아예 쓰면 안 돼?': {
    answer: [
      '카드사 사용액 비율과 신용카드 공제 규칙을 같이 확인했어요.',
      '',
      '신용카드를 아예 끊을 필요는 없어요. 보통 총급여의 25%를 넘긴 뒤부터 공제 효과가 커지고, 그 이후에는 체크카드·현금영수증 공제율이 더 유리해요.',
      '김갓생님은 이번 달 신용카드 지출이 기준치를 넘어서, 남은 기간은 체크카드로 돌리는 전략을 추천해요.',
    ].join('\n'),
    sources: ['소득세법 신용카드 등 사용금액 소득공제 기준', '카드사 월별 사용 비율', '국세청 연말정산 미리보기 소비 분석'],
  },
  '안경 맞춘 것도 세금 깎아준다던데 영수증 버렸으면 어떡해?': {
    answer: [
      'OO안경원 결제내역과 의료비 공제 문서를 같이 조회했어요.',
      '',
      '시력보정용 안경이나 콘택트렌즈라면 1명당 연 50만 원 한도에서 의료비 세액공제 대상이에요.',
      '영수증을 버렸어도 안경점에 재발급을 요청하거나 카드 결제내역으로 구매처를 확인한 뒤 증빙을 다시 받을 수 있어요.',
      '앱에서는 발견된 15만 원 결제내역을 영수증 등록 후보로 올려둘게요.',
    ].join('\n'),
    sources: ['소득세법 제59조의4', '소득세법 시행령 제118조의5 제1항 제4호', '카드사 OO안경원 15만 원 결제내역'],
  },
}

const ragMatchers = {
  [HANBEOTEAM_NAME]: [
    { answerKey: '한부모 소득공제랑 부녀자 소득공제 둘 다 받을 수 있어?', keywords: ['한부모', '부녀자', '소득공제', '둘', '중복'] },
    { answerKey: '친정 엄마가 아이를 봐주시는데, 따로 살아도 인적공제 받을 수 있어?', keywords: ['친정', '엄마', '부모', '따로', '인적공제', '부양'] },
    { answerKey: '근로장려금 신청 대상인지 조건을 3줄로 요약해 줘.', keywords: ['근로장려금', '자녀장려금', '신청', '대상', '조건', '요약'] },
  ],
  [KIMGODSAENG_NAME]: [
    { answerKey: '연말정산이 13월의 월급이라던데 나 세금 토해낼 수도 있어?', keywords: ['연말정산', '13월', '월급', '토해', '세금', '추가납부'] },
    { answerKey: '체크카드 쓰면 돈 돌려준다던데 신용카드는 아예 쓰면 안 돼?', keywords: ['체크카드', '신용카드', '카드', '공제', '소비', '돌려'] },
    { answerKey: '안경 맞춘 것도 세금 깎아준다던데 영수증 버렸으면 어떡해?', keywords: ['안경', '렌즈', '영수증', '의료비', '안경원', '버렸'] },
  ],
} as const

function findRagAnswer(userName: string, text: string) {
  const normalized = text.replace(/\s/g, '').toLowerCase()
  const matchers = ragMatchers[userName as keyof typeof ragMatchers] ?? []
  const scored = matchers
    .map((matcher) => ({
      answer: ragAnswers[matcher.answerKey],
      score: matcher.keywords.filter((keyword) => normalized.includes(keyword.replace(/\s/g, '').toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score)

  return scored[0]?.score >= 2 ? scored[0].answer : undefined
}

type Message = { role: 'user' | 'ai'; text: string; sources?: string[]; loading?: boolean }

export default function ChatbotPage() {
  const navigate = useNavigate()
  const { userName } = useAuth()
  const { selectedCoach } = useChatbotCoach()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const replies = quickReplies

  useHeaderConfig({ title: 'AI 도우미', showBack: true, showBell: true, badgeCount: 2 })

  useEffect(() => {
    if (!selectedCoach) {
      navigate('/chatbot/init', { replace: true })
      return
    }
    setMessages([{ role: 'ai', text: selectedCoach.greeting }])
  }, [navigate, selectedCoach])

  if (!selectedCoach) return null

  const sendMessage = (text: string) => {
    if (!text.trim() || isSearching) return
    const ragAnswer = findRagAnswer(userName, text)
    if (!ragAnswer) {
      setMessages(prev => [
        ...prev,
        { role: 'user', text },
        { role: 'ai', text: `"${text}"에 대해 살펴볼게요. ${selectedCoach.promise}` },
      ])
      setInput('')
      return
    }

    setIsSearching(true)
    setMessages(prev => [
      ...prev,
      { role: 'user', text },
      { role: 'ai', text: '관련 법령과 마이데이터를 검색하고 있어요...', loading: true },
    ])
    setInput('')

    const steps = [
      { delay: 850, text: '관련 법령과 마이데이터를 검색하고 있어요...' },
      { delay: 1700, text: '근거 문서에서 조건과 한도를 추출하고 있어요...' },
      { delay: 2550, text: '내 상황과 대조해서 답변을 정리하고 있어요...' },
    ]

    steps.forEach((step) => {
      window.setTimeout(() => {
        setMessages(prev => prev.map((msg, index) => (
          index === prev.length - 1 && msg.loading ? { ...msg, text: step.text } : msg
        )))
      }, step.delay)
    })

    window.setTimeout(() => {
      setMessages(prev => prev.map((msg, index) => (
        index === prev.length - 1 && msg.loading
          ? { role: 'ai', text: ragAnswer.answer, sources: ragAnswer.sources }
          : msg
      )))
      setIsSearching(false)
    }, 3450)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: 'white', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700 }}>{selectedCoach.name}</p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selectedCoach.level} · {selectedCoach.tags[0]}</p>
        </div>
        <button onClick={() => navigate('/chatbot/init')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-secondary)' }}>변경</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
            {msg.role === 'ai' && (
              <div style={{ width: 34, height: 34, background: selectedCoach.bg, border: `1px solid ${selectedCoach.accent}22`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={selectedCoach.image} alt="" aria-hidden="true" style={{ width: 28, height: 28, objectFit: 'contain' }} />
              </div>
            )}
            <div style={{ maxWidth: '75%', padding: '12px 14px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.role === 'user' ? 'var(--primary)' : 'white', color: msg.role === 'user' ? 'white' : 'var(--text-primary)', fontSize: 14, lineHeight: 1.6, boxShadow: 'var(--shadow-sm)', whiteSpace: 'pre-line' }}>
              {msg.loading && (
                <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                  {[0, 1, 2].map((dot) => (
                    <span key={dot} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--primary)', opacity: 0.35 + dot * 0.2 }} />
                  ))}
                </div>
              )}
              {msg.text}
              {msg.sources && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', marginBottom: 6 }}>참고한 문서</p>
                  {msg.sources.map((source) => (
                    <p key={source} style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 3 }}>• {source}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>빠른 질문 선택</p>
            {replies.map((reply, i) => (
              <button key={reply} onClick={() => sendMessage(reply)} disabled={isSearching} style={{ width: '100%', padding: '13px 16px', background: 'white', border: 'none', borderBottom: i < replies.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: isSearching ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 14, textAlign: 'left', color: 'var(--text-primary)', opacity: isSearching ? 0.6 : 1 }}>
                <span>{reply}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: 'white', borderTop: '1px solid var(--border)', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)} disabled={isSearching} placeholder="궁금한 내용을 입력해 주세요" style={{ flex: 1, height: 44, background: 'var(--bg-gray)', border: 'none', borderRadius: 22, padding: '0 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--text-primary)' }} />
        <button onClick={() => sendMessage(input)} disabled={isSearching} style={{ width: 44, height: 44, background: 'var(--primary)', border: 'none', borderRadius: '50%', cursor: isSearching ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: isSearching ? 0.6 : 1 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="white"/></svg>
        </button>
      </div>
    </div>
  )
}
