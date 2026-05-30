import { useNavigate, useParams } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import Emoji from '../../components/Emoji/Emoji'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME, hanbeoteamRecommendationDetails } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME, kimgodsaengRecommendationDetails } from '../../data/kimgodsaeng'

// ── 반원 게이지 미터 ──────────────────────────────────────
function GaugeMeter({ current, max }: { current: number; max: number }) {
  // W=310 → 섹션 너비에 맞게, R=90 → 아크 하단이 H 안에 들어오도록
  const W = 310, H = 172
  const cx = W / 2, cy = 104, R = 90, SW = 7

  const toXY = (deg: number) => ({
    x: cx + R * Math.cos((deg * Math.PI) / 180),
    y: cy + R * Math.sin((deg * Math.PI) / 180),
  })

  const arc = (from: number, to: number) => {
    const s = toXY(from), e = toXY(to)
    const diff = ((to - from) % 360 + 360) % 360
    return `M ${s.x.toFixed(1)} ${s.y.toFixed(1)} A ${R} ${R} 0 ${diff > 180 ? 1 : 0} 1 ${e.x.toFixed(1)} ${e.y.toFixed(1)}`
  }

  const START = 135, SWEEP = 270
  const prog = Math.max(0.025, Math.min(current / max, 1))

  // 텍스트를 아크의 시각적 중심(cx, cy - R*0.35)에 배치
  const textTop = `${Math.round(((cy - R * 0.38) / H) * 100)}%`

  return (
    <div>
      <div style={{ position: 'relative', width: W, margin: '0 auto' }}>
        <svg width={W} height={H} style={{ display: 'block' }}>
          <path d={arc(START, START + SWEEP)} fill="none" stroke="#E8ECF4" strokeWidth={SW} strokeLinecap="round" />
          <path d={arc(START, START + prog * SWEEP)} fill="none" stroke="#3B6FE8" strokeWidth={SW} strokeLinecap="round" />
        </svg>
        {/* 텍스트: 아크의 비어 있는 중앙 상단에 절대 배치 */}
        <div style={{
          position: 'absolute',
          top: textTop,
          left: '50%',
          transform: 'translate(-50%, 0)',
          textAlign: 'center',
          width: '52%',
          pointerEvents: 'none',
        }}>
          <p style={{ fontSize: 10, color: '#AAAAAA', marginBottom: 4, whiteSpace: 'nowrap' }}>예상 공제 가능 금액</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#3B6FE8', lineHeight: 1.1 }}>{current}만원</p>
          <p style={{ fontSize: 11, color: '#CCCCCC', marginTop: 4 }}>/ 최대 {max}만원</p>
        </div>
      </div>

      {/* 하단 좌우 수치 — 아크 끝점 위치에 맞게 패딩 조정 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', marginTop: -10 }}>
        <div>
          <p style={{ fontSize: 10, color: '#AAAAAA', marginBottom: 3 }}>지금 받고 있는 금액</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#3B6FE8' }}>{current}만원</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 10, color: '#AAAAAA', marginBottom: 3 }}>남은 공제 한도</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>{max - current}만원</p>
        </div>
      </div>
    </div>
  )
}

// ── 섹션 타이틀 ──────────────────────────────────────────
function SectionTitle({ type, title }: { type: 'target' | 'condition' | 'step'; title: string }) {
  const icons = {
    target: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#3B6FE8" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" fill="#3B6FE8"/>
      </svg>
    ),
    condition: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#3B6FE8" strokeWidth="2"/>
        <path d="M12 7v10M7 12h10" stroke="#3B6FE8" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    step: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#3B6FE8" strokeWidth="2"/>
        <path d="M8 12l3 3 5-5" stroke="#3B6FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
      {icons[type]}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E' }}>{title}</h3>
    </div>
  )
}

// ── 데이터 ────────────────────────────────────────────────
type ItemData = {
  category: string; categoryColor: string
  emoji: string; title: string; subtitle: string; tag: string
  currentAmount: number; maxAmount: number
  warning: string
  targetDesc: string
  targetItems: { icon: string; label: string; sub: string }[]
  conditions: string[]
  steps: { label: string; desc: string }[]
}

const data: Record<string, ItemData> = {
  glasses: {
    category: '의료비 공제', categoryColor: 'badge-blue',
    emoji: '👓', title: '안경/렌즈',
    subtitle: '시력교정용 안경 및 렌즈 구입비도\n의료비 세액공제 대상이에요.',
    tag: '#의료비 세액공제',
    currentAmount: 10, maxAmount: 50,
    warning: '아직 40만원의 공제 한도가 남았어요!\n영수증을 추가하면 더 많은 공제를 받을 수 있어요.',
    targetDesc: '시력 보정용 안경, 콘택트렌즈(일반/난시용) 구입비가 해당됩니다.',
    targetItems: [
      { icon: '👓', label: '안경/선글라스', sub: '시력 보정품' },
      { icon: '💧', label: '콘택트렌즈', sub: '일반/난시용' },
      { icon: '🧴', label: '관련 용품', sub: '세척액, 보존액 등' },
    ],
    conditions: [
      '근로자 본인과 기본공제대상자를 위해 지출한 금액',
      '안경사, 콘택트렌즈 판매점 등에서 구입한 금액',
      '총 급여액의 3% 초과분부터 공제 적용',
      '연간 한도: 최대 50만원',
    ],
    steps: [
      { label: '영수증 준비', desc: '구매 영수증\n챙기기' },
      { label: '자료 제출', desc: '연말정산 간소화\n서비스 제출' },
      { label: '세액공제 적용', desc: '의료비 세액공제\n자동 적용' },
    ],
  },
  tuition: {
    category: '교육비 공제', categoryColor: 'badge-purple',
    emoji: '📚', title: '마이스터고 자녀교비',
    subtitle: '마이스터고 자녀의 교육비도\n세액공제로 돌려받을 수 있어요.',
    tag: '#교육비 세액공제',
    currentAmount: 30, maxAmount: 90,
    warning: '자녀 1인당 최대 300만원까지 교육비 공제가 가능해요!',
    targetDesc: '마이스터고 및 직업훈련 과정에 재학 중인 자녀의 교육비가 해당됩니다.',
    targetItems: [
      { icon: '🏫', label: '마이스터고', sub: '수업료·입학금' },
      { icon: '📖', label: '교재·실습비', sub: '학교 지정 교재' },
      { icon: '🎒', label: '기타 교육비', sub: '학교 납입금' },
    ],
    conditions: [
      '기본공제 대상 자녀 (만 20세 이하)',
      '교육비 세액공제율 15% 적용',
      '연간 1인당 최대 300만원 한도',
    ],
    steps: [
      { label: '납입 영수증', desc: '학교 발급\n서류 수령' },
      { label: '증명서 제출', desc: '교육비 납입\n증명서 준비' },
      { label: '공제 적용', desc: '연말정산\n자동 반영' },
    ],
  },
  health: {
    category: '의료비 공제', categoryColor: 'badge-green',
    emoji: '🏥', title: '건강검진 비용',
    subtitle: '건강검진 비용도 의료비 공제로\n돌려받을 수 있어요.',
    tag: '#의료비 세액공제',
    currentAmount: 15, maxAmount: 60,
    warning: '의료비 총액이 총급여의 3%를 초과하면 공제 가능해요!',
    targetDesc: '건강검진·종합검진 비용 및 관련 의료비가 해당됩니다.',
    targetItems: [
      { icon: '🩺', label: '건강검진', sub: '종합검진 포함' },
      { icon: '💊', label: '처방 의약품', sub: '처방전 필요' },
      { icon: '🏨', label: '입원 치료비', sub: '병원 입원비' },
    ],
    conditions: [
      '의료비 총액이 총급여의 3% 초과 시 공제',
      '공제율 15% (난임시술비 30%)',
      '연간 700만원 한도',
    ],
    steps: [
      { label: '영수증 수집', desc: '기관 영수증\n모두 보관' },
      { label: '간소화 조회', desc: '국세청\n자동 집계' },
      { label: '공제 적용', desc: '의료비 항목\n자동 반영' },
    ],
  },
  rent: {
    category: '주거비 공제', categoryColor: 'badge-orange',
    emoji: '🏠', title: '월세 세액공제',
    subtitle: '무주택 세대의 월세 납부액을\n세액공제로 돌려받아요.',
    tag: '#월세 세액공제',
    currentAmount: 75, maxAmount: 100,
    warning: '월세 세액공제는 최대 750만원까지 적용 가능해요!',
    targetDesc: '무주택 세대주가 납부한 월세 금액이 공제 대상입니다.',
    targetItems: [
      { icon: '🏠', label: '월세 납부액', sub: '임대차 계약' },
      { icon: '📄', label: '계약서 확인', sub: '주소 일치 필수' },
      { icon: '💰', label: '이체 내역', sub: '납부 증빙' },
    ],
    conditions: [
      '무주택 세대주 또는 세대원',
      '총급여 7천만원 이하 (종합소득 6천만원)',
      '기준시가 4억원 이하 주택',
      '임대차 계약서 주소와 주민등록 일치',
    ],
    steps: [
      { label: '계약서 준비', desc: '임대차\n계약서 보관' },
      { label: '이체 내역', desc: '월세 납부\n확인서 준비' },
      { label: '공제 신청', desc: '연말정산\n월세 공제 적용' },
    ],
  },
  card: {
    category: '신용카드 공제', categoryColor: 'badge-red',
    emoji: '💳', title: '신용카드 사용액',
    subtitle: '총급여의 25% 초과 사용분에 대해\n소득공제를 받을 수 있어요.',
    tag: '#신용카드 소득공제',
    currentAmount: 30, maxAmount: 60,
    warning: '체크카드·현금영수증 사용 시 공제율 30%로 더 유리해요!',
    targetDesc: '신용카드, 체크카드, 현금영수증 사용분이 공제 대상입니다.',
    targetItems: [
      { icon: '💳', label: '신용카드', sub: '공제율 15%' },
      { icon: '🏧', label: '체크카드', sub: '공제율 30%' },
      { icon: '🧾', label: '현금영수증', sub: '공제율 30%' },
    ],
    conditions: [
      '신용카드 사용액이 총급여의 25% 초과',
      '신용카드 15%, 체크카드·현금 30% 공제',
      '전통시장·대중교통 추가 공제 가능',
      '연간 공제 한도 300만원',
    ],
    steps: [
      { label: '사용 내역 확인', desc: '카드사\n내역 조회' },
      { label: '간소화 조회', desc: '국세청\n자동 집계' },
      { label: '공제 적용', desc: '연말정산\n자동 반영' },
    ],
  },
  baby: {
    category: '출산·육아 공제', categoryColor: 'badge-purple',
    emoji: '👶', title: '출산/육아 비용',
    subtitle: '출산 및 육아 관련 비용으로\n세금 혜택을 받을 수 있어요.',
    tag: '#출산·육아 세액공제',
    currentAmount: 20, maxAmount: 50,
    warning: '출산 자녀 1인당 최대 30만원 세액공제가 가능해요!',
    targetDesc: '출산, 산후조리, 영유아 보육 관련 비용이 공제 대상입니다.',
    targetItems: [
      { icon: '👶', label: '출산 세액공제', sub: '첫째 30만원' },
      { icon: '🏥', label: '산후조리원', sub: '200만원 한도' },
      { icon: '🎒', label: '보육 비용', sub: '영유아 대상' },
    ],
    conditions: [
      '출산·입양 세액공제: 첫째 30만원, 둘째 50만원',
      '영아 의료비 전액 공제 (한도 없음)',
      '산후조리원 비용 200만원 한도',
    ],
    steps: [
      { label: '출생 신고', desc: '서류 준비\n및 발급' },
      { label: '영수증 보관', desc: '조리원·병원\n영수증 수집' },
      { label: '공제 적용', desc: '연말정산\n자동 반영' },
    ],
  },
}

// ── 메인 컴포넌트 ──────────────────────────────────────────
export default function RecommendDetailPage() {
  const navigate = useNavigate()
  const { id = 'glasses' } = useParams()
  const { userName } = useAuth()
  const hanbeoteamItem = hanbeoteamRecommendationDetails[id as keyof typeof hanbeoteamRecommendationDetails]
  const kimgodsaengItem = kimgodsaengRecommendationDetails[id as keyof typeof kimgodsaengRecommendationDetails]
  const item = userName === HANBEOTEAM_NAME && hanbeoteamItem
    ? hanbeoteamItem
    : userName === KIMGODSAENG_NAME && kimgodsaengItem
    ? kimgodsaengItem
    : data[id] ?? data.glasses
  useHeaderConfig({ showBack: true, showBell: true, badgeCount: 2 })

  return (
    <div style={{ background: 'white', minHeight: '100%' }}>

      {/* ── 헤더: 배지 + 타이틀 + 일러스트 ── */}
      <div style={{ padding: '20px 20px 18px', background: 'linear-gradient(150deg, #EBF1FF 0%, #F8FAFF 70%, #fff 100%)' }}>
        <span className={`badge ${item.categoryColor}`} style={{ marginBottom: 12, display: 'inline-block' }}>
          {item.category}
        </span>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, lineHeight: 1.2, color: '#1A1A2E' }}>{item.title}</h1>
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65, whiteSpace: 'pre-line', marginBottom: 12 }}>
              {item.subtitle}
            </p>
            <span style={{ fontSize: 12, color: '#3B6FE8', fontWeight: 600 }}>{item.tag}</span>
          </div>
          {/* 일러스트 */}
          <div style={{
            width: 86, height: 86, flexShrink: 0,
            background: 'white',
            borderRadius: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 50,
            boxShadow: '0 4px 16px rgba(59,111,232,0.12)',
          }}>
            <Emoji char={item.emoji} size={48} />
          </div>
        </div>
      </div>

      {/* ── 공제 현황 (게이지 미터) ── */}
      <div style={{ padding: '20px 16px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>올해 {item.title} 공제 현황</p>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#AAAAAA" strokeWidth="1.5"/>
            <path d="M12 8v1M12 11v5" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <GaugeMeter current={item.currentAmount} max={item.maxAmount} />

        {/* 경고 배너 */}
        <div style={{ background: '#F0F5FF', borderRadius: 16, padding: '13px 14px', marginTop: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#EBF1FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#3B6FE8" opacity="0.15"/>
              <path d="M12 7l5 10H7l5-10z" stroke="#3B6FE8" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 13v-3M12 15v.5" stroke="#3B6FE8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{ fontSize: 12, color: '#3B6FE8', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.warning}</p>
        </div>
      </div>

      <div style={{ height: 10, background: '#F5F7FF', margin: '20px 0 0' }} />

      {/* ── 공제 대상 ── */}
      <div style={{ padding: '20px 16px 16px' }}>
        <SectionTitle type="target" title="공제 대상" />
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 16 }}>{item.targetDesc}</p>

        <div style={{ display: 'flex', gap: 10 }}>
          {item.targetItems.map((t, i) => (
            <div key={i} style={{
              flex: 1,
              background: '#F8FAFF',
              borderRadius: 18,
              padding: '14px 8px',
              textAlign: 'center',
              border: '1px solid #EBF1FF',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><Emoji char={t.icon} size={28} /></div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1A1A2E', marginBottom: 3, lineHeight: 1.3 }}>{t.label}</p>
              <p style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.4 }}>{t.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 10, background: '#F5F7FF' }} />

      {/* ── 공제 조건 ── */}
      <div style={{ padding: '20px 16px 16px' }}>
        <SectionTitle type="condition" title="공제 조건" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {item.conditions.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B6FE8', flexShrink: 0, marginTop: 6 }} />
              <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 10, background: '#F5F7FF' }} />

      {/* ── 신청 방법 ── */}
      <div style={{ padding: '20px 16px 24px' }}>
        <SectionTitle type="step" title="신청 방법" />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          {item.steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                {/* 번호 원 */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: i === 0 ? '#3B6FE8' : '#EBF1FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 8px',
                }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: i === 0 ? 'white' : '#3B6FE8' }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#1A1A2E', lineHeight: 1.3, marginBottom: 3 }}>{s.label}</p>
                <p style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{s.desc}</p>
              </div>
              {i < item.steps.length - 1 && (
                <div style={{ flexShrink: 0, paddingBottom: 32 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 하단 버튼 ── */}
      <div style={{ padding: '4px 16px 36px', display: 'flex', gap: 10 }}>
        <button
          className="btn-secondary"
          style={{ flex: 1, height: 50, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2v6h6M12 18v-6M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          영수증 등록하기
        </button>
        <button
          className="btn-primary"
          style={{ flex: 1, height: 50, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
          onClick={() => navigate(-1)}
        >
          연말정산 미리보기
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
