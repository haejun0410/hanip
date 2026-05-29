import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { coachProfiles, type CoachId, useChatbotCoach } from '../../context/ChatbotCoachContext'

export default function ChatbotInitPage() {
  const navigate = useNavigate()
  const { selectedCoachId, setSelectedCoach } = useChatbotCoach()
  const [selected, setSelected] = useState<CoachId | null>(selectedCoachId)

  useHeaderConfig({ showBack: true, title: 'AI 코치 선택', showBell: false })

  const startChat = () => {
    if (!selected) return
    setSelectedCoach(selected)
    navigate('/chatbot')
  }

  return (
    <div className="coach-select-page">
      <div className="coach-select-hero">
        <div>
          <h1>
            나에게 딱 맞는<br />
            <span>AI 코치</span>를 선택해주세요
          </h1>
          <p>선택한 코치가 맞춤형 말투로 도와드릴게요!</p>
        </div>
        <div className="coach-select-ghost">●●</div>
      </div>

      <div className="coach-select-list">
        {coachProfiles.map((coach) => {
          const isSelected = selected === coach.id
          return (
            <button
              key={coach.id}
              type="button"
              className={`coach-select-card ${isSelected ? 'selected' : ''}`}
              style={{ background: coach.bg, borderColor: isSelected ? coach.accent : '#E5EAF5' }}
              onClick={() => setSelected(coach.id)}
            >
              <div className="coach-select-character">
                <img src={coach.image} alt="" aria-hidden="true" />
              </div>
              <div className="coach-select-copy">
                <span style={{ background: coach.badgeColor }}>{coach.badge}</span>
                <h2>{coach.name}</h2>
                <strong style={{ color: coach.accent }}>{coach.level}</strong>
                <p>{coach.description}</p>
                <p>{coach.promise}</p>
                <div>
                  {coach.tags.map((tag) => (
                    <em key={tag}>✓ {tag}</em>
                  ))}
                </div>
              </div>
              <div className="coach-select-radio" style={{ borderColor: isSelected ? coach.accent : '#D9DEE8' }}>
                {isSelected && <span style={{ background: coach.accent }} />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="coach-select-note">
        <div>🔒</div>
        <div>
          <strong>선택은 언제든 변경할 수 있어요</strong>
          <p>마이페이지 &gt; 설정 및 정보에서 변경 가능합니다.</p>
        </div>
      </div>

      <div className="coach-select-action">
        <button className="btn-primary" disabled={!selected} onClick={startChat} style={{ opacity: selected ? 1 : 0.5 }}>
          선택하고 시작하기
        </button>
      </div>
    </div>
  )
}
