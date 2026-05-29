import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME } from '../../data/kimgodsaeng'

type ProfileData = {
  age: string
  income: string
  familyType: string
  housing: string
}

const DEFAULTS: Record<string, ProfileData> = {
  [HANBEOTEAM_NAME]: { age: '34', income: '2,400 ~ 5,000만원', familyType: '한부모 · 자녀', housing: '자가' },
  [KIMGODSAENG_NAME]: { age: '26', income: '2,400 ~ 5,000만원', familyType: '없음(1인)', housing: '무주택 월세' },
}
const FALLBACK: ProfileData = { age: '27', income: '2,400 ~ 5,000만원', familyType: '없음(1인)', housing: '월세' }

function loadProfile(userName: string): ProfileData {
  try {
    const saved = localStorage.getItem(`hanip-profile-${userName}`)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return DEFAULTS[userName] ?? FALLBACK
}

function saveProfile(userName: string, data: ProfileData) {
  localStorage.setItem(`hanip-profile-${userName}`, JSON.stringify(data))
}

export function useProfileData() {
  const { userName } = useAuth()
  return loadProfile(userName ?? '')
}

const TOTAL_STEPS = 4

const incomeOptions = [
  { label: '2,400만원 미만', sub: '기초생활 수급자 포함' },
  { label: '2,400 ~ 5,000만원', sub: '근로자 평균 소득 구간' },
  { label: '5,000 ~ 8,000만원', sub: '고소득 근로자' },
  { label: '8,000만원 이상', sub: '고액 소득자' },
]

const familyOptions = [
  { label: '부모', icon: '👴', sub: '아버지 / 어머니' },
  { label: '배우자', icon: '💑', sub: '남편 / 아내' },
  { label: '자녀', icon: '👶', sub: '아들 / 딸' },
  { label: '한부모 · 자녀', icon: '👩‍👧', sub: '한부모 가정' },
  { label: '형제/자매', icon: '🧑‍🤝‍🧑', sub: '오빠 / 동생 등' },
  { label: '없음(1인)', icon: '🙋', sub: '혼자 생활 중' },
]

const housingOptions = [
  { label: '자가', icon: '🏡', sub: '본인 명의 주택' },
  { label: '무주택 월세', icon: '🏠', sub: '월세 거주 중' },
  { label: '전세', icon: '🔑', sub: '전세 거주 중' },
  { label: '기타', icon: '🏢', sub: '고시원·기숙사 등' },
]

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const { userName } = useAuth()
  const isHanbeoteam = userName === HANBEOTEAM_NAME
  const isKimgodsaeng = userName === KIMGODSAENG_NAME

  const current = loadProfile(userName ?? '')

  // step 0 = 나의 현황, step 1~4 = 위자드, step 99 = 완료
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<ProfileData>(current)
  const [done, setDone] = useState(false)

  useHeaderConfig(
    step === 0
      ? { title: '정보 수정', showBack: true }
      : { showBack: true, showBell: false }
  )

  const goNext = () => {
    if (step < TOTAL_STEPS) { setStep(s => s + 1); return }
    saveProfile(userName ?? '', form)
    setDone(true)
  }

  const goBack = () => {
    if (step === 0) { navigate('/mypage'); return }
    setStep(s => s - 1)
  }

  const canProceed = () => {
    if (step === 1) return form.age.trim().length > 0
    if (step === 2) return form.income.length > 0
    if (step === 3) return form.familyType.length > 0
    if (step === 4) return form.housing.length > 0
    return true
  }

  // ── 완료 화면 ──
  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 24px 16px', background: 'white' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>정보가 업데이트됐어요</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>나의 현황이 새로 저장됐어요</p>
            </div>
          </div>

          <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ background: 'var(--primary)', padding: '16px 20px' }}>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 4 }}>나의 현황</p>
              <p style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>{userName}님의 정보</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', background: 'white' }}>
              {[
                { label: '나이', value: `${form.age}세` },
                { label: '연 소득', value: form.income },
                { label: '가족 형태', value: form.familyType },
                { label: '주거 형태', value: form.housing },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 20px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={() => navigate('/mypage')}>
          마이페이지로 돌아가기
        </button>
      </div>
    )
  }

  // ── STEP 0: 나의 현황 ──
  if (step === 0) {
    const summaryRows = [
      { label: '나이', value: `${current.age}세` },
      { label: '연 소득', value: current.income },
      { label: '가족 형태', value: current.familyType },
      { label: '주거 형태', value: current.housing },
    ]
    return (
      <div style={{ background: 'var(--bg-default)', minHeight: '100%', paddingBottom: 32 }}>
        <div style={{ background: 'white', padding: '20px 16px 24px' }}>
          {/* 프로필 요약 */}
          <div style={{ background: 'var(--primary)', borderRadius: 20, padding: '20px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -16, top: -16, width: 90, height: 90, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>현재 등록된 정보</p>
            <p style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{userName}님</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
              {isHanbeoteam ? '34세 · 중소기업 사무직 · 한부모 가정' : isKimgodsaeng ? '26세 · 공기업 신입 · 월세 1인가구' : '1인 가구'}
            </p>
          </div>

          {/* 나의 현황 */}
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>나의 현황</p>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
            {summaryRows.map((row, i) => (
              <div
                key={row.label}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: i === 0 ? 0 : 14, paddingBottom: 14, borderBottom: i < summaryRows.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{row.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={() => setStep(1)}>
            정보 수정하기
          </button>
        </div>
      </div>
    )
  }

  // ── STEP 1~4: 위자드 ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
      {/* 진행 바 */}
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < step ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>STEP {step} / {TOTAL_STEPS}</span>
          <div style={{ width: 28 }} />
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 24px', display: 'flex', flexDirection: 'column' }}>

        {/* ─── STEP 1: 나이 ─── */}
        {step === 1 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>나이를<br />알려주세요</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
              청년 혜택 및 연령별 지원금 계산에 사용돼요
            </p>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>나이 (세)</label>
            <input
              className="input"
              value={form.age}
              onChange={e => setForm(prev => ({ ...prev, age: e.target.value.replace(/\D/g, '') }))}
              placeholder="예: 30"
              inputMode="numeric"
              style={{ fontSize: 16 }}
            />
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['20대', '30대', '40대', '50대 이상'].map((label, i) => {
                const ages = ['25', '34', '44', '55']
                return (
                  <button key={label} onClick={() => setForm(prev => ({ ...prev, age: ages[i] }))}
                    style={{ padding: '7px 14px', background: 'var(--bg-gray)', border: '1.5px solid transparent', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {label}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* ─── STEP 2: 소득 정보 ─── */}
        {step === 2 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>소득 정보를<br />알려주세요</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
              정확한 공제·지원금 계산에 사용해요<br />
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>실제 소득과 비슷한 구간을 선택해주세요</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {incomeOptions.map(opt => {
                const selected = form.income === opt.label
                return (
                  <button key={opt.label} onClick={() => setForm(prev => ({ ...prev, income: opt.label }))}
                    style={{ padding: '16px 18px', background: selected ? 'var(--primary-light)' : 'var(--bg-gray)', border: selected ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: 18, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s' }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: selected ? 'var(--primary)' : 'var(--text-primary)', marginBottom: 2 }}>{opt.label}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{opt.sub}</p>
                    </div>
                    {selected && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#3B6FE8"/><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* ─── STEP 3: 가족 형태 ─── */}
        {step === 3 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>가족 형태를<br />알려주세요</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
              부양가족 공제 혜택을 찾는 데 활용돼요
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {familyOptions.map(opt => {
                const selected = form.familyType === opt.label
                return (
                  <button key={opt.label} onClick={() => setForm(prev => ({ ...prev, familyType: opt.label }))}
                    style={{ padding: '14px 8px', background: selected ? 'var(--primary-light)' : 'var(--bg-gray)', border: selected ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: 18, cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 30, marginBottom: 6 }}>{opt.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: selected ? 'var(--primary)' : 'var(--text-primary)', marginBottom: 2 }}>{opt.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', lineHeight: 1.3 }}>{opt.sub}</div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* ─── STEP 4: 주거 형태 ─── */}
        {step === 4 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>주거 형태를<br />알려주세요</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
              월세 공제·주거 지원금 계산에 활용돼요
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {housingOptions.map(opt => {
                const selected = form.housing === opt.label
                return (
                  <button key={opt.label} onClick={() => setForm(prev => ({ ...prev, housing: opt.label }))}
                    style={{ padding: '16px 18px', background: selected ? 'var(--primary-light)' : 'var(--bg-gray)', border: selected ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: 18, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.15s' }}>
                    <span style={{ fontSize: 28 }}>{opt.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: selected ? 'var(--primary)' : 'var(--text-primary)', marginBottom: 2 }}>{opt.label}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{opt.sub}</p>
                    </div>
                    {selected && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#3B6FE8"/><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* 하단 버튼 */}
      <div style={{ padding: '0 24px 16px', background: 'white' }}>
        <button className="btn-primary" onClick={goNext}
          style={{ opacity: canProceed() ? 1 : 0.45 }}
          disabled={!canProceed()}>
          {step === TOTAL_STEPS ? '저장하기' : '다음'}
        </button>
      </div>
    </div>
  )
}
