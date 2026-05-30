import type { BenefitConversation, CoachVariant } from './benefitConversations'
import type { AiBenefit } from '../types/aiBenefit'

type QuestionSpec = {
  message: string
  positive: string
  negative: string
  negativeReason: string
}

type ConversationSpec = {
  title: string
  intro: string
  result: string
  questions: QuestionSpec[]
  action: 'apply' | 'policy'
}

const coachVariant = (easy: string, summary: string, strategy: string): CoachVariant => ({
  easy,
  summary,
  strategy,
})

function makeConversation({ title, intro, result, questions, action }: ConversationSpec): BenefitConversation {
  return {
    intro: coachVariant(
      `${intro} 어려운 말 없이 하나씩 같이 확인해봐요.`,
      `${intro} 핵심 조건만 빠르게 확인해드릴게요.`,
      `${intro} 적용 요건과 준비 항목을 순서대로 검토하겠습니다.`,
    ),
    questions: questions.map(({ message, positive, negative, negativeReason }) => ({
      message,
      options: [
        { label: positive, isPositive: true },
        {
          label: negative,
          isPositive: false,
          followUp: coachVariant(
            `${negativeReason} 이 부분을 준비한 뒤 다시 확인해봐요.`,
            `${negativeReason} 준비 후 다시 확인해주세요.`,
            `${negativeReason} 현재는 요건 미충족으로 분류하고, 보완 후 재검토하세요.`,
          ),
        },
      ],
    })),
    positiveResult: {
      title: coachVariant(
        `${title}, 받을 수 있을 것 같아요!`,
        `${title} 대상일 가능성이 높아요`,
        `${title} 적용 가능성이 높습니다`,
      ),
      subtitle: coachVariant(
        `${result} 필요한 자료를 챙겨서 다음 단계로 가봐요.`,
        `${result} 신청 전 증빙 자료를 확인해주세요.`,
        `${result} 확인된 조건을 기준으로 증빙 확보 후 신청을 진행하세요.`,
      ),
      actions: [
        { label: action === 'policy' ? '지원 정책 보러 가기' : '추천 항목 보러 가기', action },
        { label: '다른 혜택 확인하기', action: 'next' },
      ],
    },
    negativeResult: {
      title: coachVariant(
        '지금은 바로 신청하기 어려워요',
        '확인이 더 필요한 조건이 있어요',
        '현재 확인된 요건이 부족합니다',
      ),
      subtitle: coachVariant(
        '괜찮아요. 부족한 조건을 준비한 뒤 다시 확인하면 돼요.',
        '미충족 조건을 확인한 뒤 다시 검토해주세요.',
        '미충족 요건을 보완한 뒤 적용 가능성을 다시 검토하세요.',
      ),
    },
  }
}

export const additionalBenefitConversations: Record<string, BenefitConversation> = {
  'housing-subscription-ai': makeConversation({
    title: '주택청약종합저축 소득공제',
    intro: '청약저축 납입 내역이 있네요.',
    result: '무주택확인서 제출 여부까지 점검하면 연말정산에 반영할 수 있어요.',
    action: 'apply',
    questions: [
      { message: '현재 총급여가 7천만 원 이하인가요?', positive: '네, 맞아요', negative: '아니요', negativeReason: '이 공제는 총급여 7천만 원 이하 근로자가 대상이에요.' },
      { message: '현재 무주택 세대주인가요?', positive: '네, 맞아요', negative: '아니요', negativeReason: '무주택 세대주 요건을 먼저 충족해야 해요.' },
      { message: '무주택확인서를 은행에 제출하셨나요?', positive: '네, 제출했어요', negative: '아직 제출하지 않았어요', negativeReason: '은행에 무주택확인서를 제출해야 공제가 적용돼요.' },
    ],
  }),
  'hometown-donation-ai': makeConversation({
    title: '고향사랑기부제',
    intro: '10만 원 기부로 세액공제와 답례품을 함께 받을 수 있어요.',
    result: '주소지가 아닌 지자체를 선택하면 기부와 답례품 신청을 진행할 수 있어요.',
    action: 'apply',
    questions: [
      { message: '현재 주민등록상 주소지 외의 지자체에 기부할 예정인가요?', positive: '네, 다른 지역이에요', negative: '주소지에 기부하려고 해요', negativeReason: '현재 주소지 관할 지자체에는 기부할 수 없어요.' },
      { message: '본인 명의로 기부할 예정인가요?', positive: '네, 본인 명의예요', negative: '가족 명의로 할게요', negativeReason: '세액공제를 받으려면 본인 명의로 기부해야 해요.' },
      { message: '세액공제와 답례품을 함께 확인해볼까요?', positive: '네, 확인할게요', negative: '나중에 볼게요', negativeReason: '기부 전 예상 혜택을 먼저 확인하면 좋아요.' },
    ],
  }),
  'student-loan-ai': makeConversation({
    title: '학자금 대출 상환액 세액공제',
    intro: '취업 후 갚은 학자금 대출 원리금도 교육비 공제 후보예요.',
    result: '본인 상환액과 간소화 반영 여부를 확인하면 교육비 공제로 챙길 수 있어요.',
    action: 'apply',
    questions: [
      { message: '본인의 학자금 대출 원리금을 직접 상환하셨나요?', positive: '네, 직접 상환했어요', negative: '아니요', negativeReason: '본인이 직접 상환한 학자금 대출 원리금이 대상이에요.' },
      { message: '상환액에 연체료나 추가 수수료가 포함되어 있나요?', positive: '아니요, 원리금만 있어요', negative: '네, 포함되어 있어요', negativeReason: '연체료와 추가 수수료는 공제 대상에서 제외될 수 있어요.' },
      { message: '연말정산 간소화 서비스에서 상환 내역을 확인하셨나요?', positive: '네, 확인했어요', negative: '아직 확인하지 않았어요', negativeReason: '간소화 서비스에서 상환 내역 반영 여부를 먼저 확인해주세요.' },
    ],
  }),
  'pension-irp-ai': makeConversation({
    title: '연금저축·IRP 세액공제',
    intro: '연금계좌 납입액을 활용하면 예상 환급액을 더 키울 수 있어요.',
    result: '현재 납입액과 여유 자금을 기준으로 추가 납입 전략을 세울 수 있어요.',
    action: 'apply',
    questions: [
      { message: '올해 연금저축 또는 IRP 계좌에 납입한 금액이 있나요?', positive: '네, 납입했어요', negative: '아직 없어요', negativeReason: '세액공제를 받으려면 연금계좌 납입이 필요해요.' },
      { message: '중도 해지 없이 장기간 유지할 수 있는 자금인가요?', positive: '네, 유지할 수 있어요', negative: '확실하지 않아요', negativeReason: '연금계좌는 장기 유지가 필요한 상품이라 여유 자금으로 접근해야 해요.' },
      { message: '올해 납입 한도와 남은 공제 가능 금액을 확인해볼까요?', positive: '네, 확인할게요', negative: '나중에 볼게요', negativeReason: '추가 납입 전 남은 공제 한도를 확인하는 것이 좋아요.' },
    ],
  }),
  'tomorrow-card-ai': makeConversation({
    title: '국민내일배움카드',
    intro: '직무 역량을 키울 때 훈련비 지원을 받을 수 있는지 확인해볼게요.',
    result: '지원 가능한 훈련과정을 골라 카드 발급과 수강 신청을 진행할 수 있어요.',
    action: 'policy',
    questions: [
      { message: '현재 직업훈련이나 직무 교육을 받을 계획이 있나요?', positive: '네, 있어요', negative: '아직 없어요', negativeReason: '수강할 훈련과정을 먼저 정하면 지원 여부를 확인하기 쉬워요.' },
      { message: '국민내일배움카드를 이미 발급받으셨나요?', positive: '네, 있어요', negative: '아직 없어요', negativeReason: '훈련비 지원을 받으려면 카드 발급 절차가 필요해요.' },
      { message: '고용24에서 수강 가능한 과정을 확인해볼까요?', positive: '네, 확인할게요', negative: '나중에 볼게요', negativeReason: '과정별 지원 비율이 달라서 수강 전 확인이 필요해요.' },
    ],
  }),
  'youth-dream-account-ai': makeConversation({
    title: '청년주택드림청약통장',
    intro: '청년 주거 마련에 유리한 청약통장으로 전환할 수 있는지 확인해볼게요.',
    result: '연령·소득·무주택 요건을 바탕으로 가입 또는 전환을 검토할 수 있어요.',
    action: 'policy',
    questions: [
      { message: '현재 만 19~34세 청년인가요?', positive: '네, 맞아요', negative: '아니요', negativeReason: '청년 연령 요건을 먼저 확인해야 해요.' },
      { message: '현재 무주택자인가요?', positive: '네, 무주택이에요', negative: '주택이 있어요', negativeReason: '이 통장은 무주택 청년을 위한 상품이에요.' },
      { message: '연소득이 5천만 원 이하인가요?', positive: '네, 맞아요', negative: '아니요', negativeReason: '가입 가능한 연소득 기준을 초과했어요.' },
    ],
  }),
  'youth-leap-account-ai': makeConversation({
    title: '청년도약계좌',
    intro: '장기 목돈 마련에 정부기여금과 비과세 혜택을 받을 수 있는지 확인해볼게요.',
    result: '월 납입 가능액을 정하고 은행 앱에서 가입 심사를 진행할 수 있어요.',
    action: 'policy',
    questions: [
      { message: '현재 청년도약계좌 가입 연령 기준에 해당하나요?', positive: '네, 해당해요', negative: '아니요', negativeReason: '청년 연령 기준을 충족해야 가입할 수 있어요.' },
      { message: '총급여가 7,500만 원 이하인가요?', positive: '네, 맞아요', negative: '아니요', negativeReason: '가입 가능한 총급여 기준을 초과했어요.' },
      { message: '매월 일정 금액을 장기간 납입할 수 있나요?', positive: '네, 가능해요', negative: '아직 어려워요', negativeReason: '장기 납입이 가능한 금액부터 정하는 것이 좋아요.' },
    ],
  }),
  'dependent-parent-ai': makeConversation({
    title: '따로 사는 부모님 인적공제',
    intro: '부모님께 보내드린 생활비 이체 내역이 있네요.',
    result: '주소가 달라도 실제 부양 사실과 부모님의 나이·소득 요건을 확인하면 공제 후보가 될 수 있어요.',
    action: 'apply',
    questions: [
      { message: '부모님께 정기적으로 생활비를 보내드리고 있나요?', positive: '네, 보내드리고 있어요', negative: '아니요', negativeReason: '실제로 부양하고 있다는 사실을 확인할 수 있어야 해요.' },
      { message: '부모님이 만 60세 이상인가요?', positive: '네, 맞아요', negative: '아니요', negativeReason: '부모님 인적공제는 나이 요건을 확인해야 해요.' },
      { message: '부모님의 연간 소득금액이 100만 원 이하인가요?', positive: '네, 맞아요', negative: '아니요 또는 잘 모르겠어요', negativeReason: '부모님의 연간 소득금액 기준을 확인해야 해요.' },
    ],
  }),
  'donation-ai': makeConversation({
    title: '기부금 세액공제',
    intro: '기부 내역이 있다면 영수증을 챙겨 세액공제를 받을 수 있어요.',
    result: '기부처 유형과 영수증 반영 여부를 확인하면 공제 신청을 진행할 수 있어요.',
    action: 'apply',
    questions: [
      { message: '올해 본인 명의로 기부한 내역이 있나요?', positive: '네, 있어요', negative: '아니요', negativeReason: '본인 명의의 기부 내역이 있어야 공제를 받을 수 있어요.' },
      { message: '기부금 영수증을 발급받으셨나요?', positive: '네, 받았어요', negative: '아직 없어요', negativeReason: '기부처에서 기부금 영수증을 발급받아야 해요.' },
      { message: '간소화 서비스에서 영수증 반영 여부를 확인하셨나요?', positive: '네, 확인했어요', negative: '아직 확인하지 않았어요', negativeReason: '누락된 영수증은 직접 제출해야 할 수 있어요.' },
    ],
  }),
  'sme-tax-reduction-ai': makeConversation({
    title: '중소기업 취업자 소득세 감면',
    intro: '중소기업 재취업 이력을 바탕으로 소득세 감면 가능성을 확인해볼게요.',
    result: '회사 확인서와 취업일 증빙을 준비하면 감면 신청을 검토할 수 있어요.',
    action: 'apply',
    questions: [
      { message: '현재 재직 중인 회사가 중소기업에 해당하나요?', positive: '네, 맞아요', negative: '아니요 또는 잘 모르겠어요', negativeReason: '회사에서 중소기업 해당 여부를 먼저 확인해주세요.' },
      { message: '경력단절 후 다시 취업한 경우에 해당하나요?', positive: '네, 해당해요', negative: '아니요', negativeReason: '현재 추천은 경력단절여성 재취업 요건을 기준으로 안내하고 있어요.' },
      { message: '회사에 감면 신청서와 증빙을 제출할 수 있나요?', positive: '네, 제출할게요', negative: '지금은 어려워요', negativeReason: '감면 적용을 위해 회사 제출 절차가 필요해요.' },
    ],
  }),
  'single-parent-childcare-ai': makeConversation({
    title: '한부모가족 아동양육비',
    intro: '자녀 양육비를 매월 지원받을 수 있는지 확인해볼게요.',
    result: '자녀 연령과 소득인정액을 기준으로 주민센터 또는 복지로 신청을 준비할 수 있어요.',
    action: 'policy',
    questions: [
      { message: '현재 한부모가족에 해당하나요?', positive: '네, 해당해요', negative: '아니요', negativeReason: '이 지원은 한부모가족을 대상으로 해요.' },
      { message: '양육 중인 자녀가 만 18세 미만인가요?', positive: '네, 맞아요', negative: '아니요', negativeReason: '지원 대상 자녀의 연령 기준을 확인해야 해요.' },
      { message: '소득인정액 기준을 확인해볼까요?', positive: '네, 확인할게요', negative: '나중에 확인할게요', negativeReason: '최종 신청 전 가구 소득인정액 확인이 필요해요.' },
    ],
  }),
  'culture-card-ai': makeConversation({
    title: '문화누리카드',
    intro: '아이와 함께 문화생활에 사용할 수 있는 지원 카드 대상인지 확인해볼게요.',
    result: '대상 증빙을 준비하면 카드 발급과 사용처 확인을 진행할 수 있어요.',
    action: 'policy',
    questions: [
      { message: '기초생활수급자 또는 차상위계층에 해당하나요?', positive: '네, 해당해요', negative: '아니요 또는 잘 모르겠어요', negativeReason: '문화누리카드는 지원 대상 자격 확인이 필요해요.' },
      { message: '본인 명의 문화누리카드를 아직 발급받지 않으셨나요?', positive: '네, 아직 없어요', negative: '이미 발급받았어요', negativeReason: '이미 카드가 있다면 신규 발급보다 잔액과 충전일을 확인해주세요.' },
      { message: '가까운 사용처와 신청 방법을 확인해볼까요?', positive: '네, 확인할게요', negative: '나중에 볼게요', negativeReason: '발급 전에 신청 기간과 수령 방법을 확인하면 좋아요.' },
    ],
  }),
  'bucheon-family-ai': makeConversation({
    title: '부천시 한부모 가구 생활안심 지원',
    intro: '부천시에 거주하는 한부모 가구가 확인할 지역 지원을 살펴볼게요.',
    result: '거주지와 한부모 가구 증빙을 준비해 최신 부천시 공고를 확인할 수 있어요.',
    action: 'policy',
    questions: [
      { message: '현재 경기 부천시에 거주하고 있나요?', positive: '네, 거주 중이에요', negative: '아니요', negativeReason: '이 지원은 부천시 거주 가구를 대상으로 해요.' },
      { message: '한부모가족 증명서를 준비할 수 있나요?', positive: '네, 가능해요', negative: '아직 없어요', negativeReason: '지역 지원 신청에 한부모가족 증빙이 필요할 수 있어요.' },
      { message: '최신 모집 공고와 신청 기간을 확인해볼까요?', positive: '네, 확인할게요', negative: '나중에 볼게요', negativeReason: '지역 사업은 공고별 기간과 지원 내용이 달라 최신 확인이 필요해요.' },
    ],
  }),
}

export const kimgodsaengAdditionalAiBenefits: AiBenefit[] = [
  { id: 'housing-subscription-ai', type: 'tax', icon: '🏦', iconBg: '#DBEAFE', title: '주택청약종합저축', subtitle: '무주택확인서 제출 여부 확인', statusLabel: '조건 확인 가능', statusColor: '#2563EB', amount: 1200000, amountLabel: '최대 소득공제 금액', aiReason: '청약저축 납입 내역을 바탕으로 공제 가능성을 확인해요.', conditions: [] },
  { id: 'hometown-donation-ai', type: 'tax', icon: '🎁', iconBg: '#FCE7F3', title: '고향사랑기부제', subtitle: '세액공제·답례품 확인', statusLabel: '조건 확인 가능', statusColor: '#2563EB', amount: 130000, amountLabel: '예상 혜택', aiReason: '기부 전 예상 혜택과 신청 조건을 확인해요.', conditions: [] },
  { id: 'student-loan-ai', type: 'tax', icon: '🎓', iconBg: '#D1FAE5', title: '학자금 대출 상환액', subtitle: '교육비 세액공제 확인', statusLabel: '조건 확인 가능', statusColor: '#2563EB', amount: 0, amountLabel: '상환액 기준 공제', aiReason: '학자금 대출 상환액의 공제 가능성을 확인해요.', conditions: [] },
  { id: 'pension-irp-ai', type: 'tax', icon: '📈', iconBg: '#FEE2E2', title: '연금저축·IRP', subtitle: '추가 납입 전략 확인', statusLabel: '조건 확인 가능', statusColor: '#2563EB', amount: 0, amountLabel: '납입액 기준 공제', aiReason: '연금계좌 납입액과 남은 공제 한도를 확인해요.', conditions: [] },
  { id: 'tomorrow-card-ai', type: 'policy', icon: '💳', iconBg: '#EDE9FE', title: '국민내일배움카드', subtitle: '직업훈련비 지원 확인', statusLabel: '조건 확인 가능', statusColor: '#16A34A', amount: 0, amountLabel: '훈련과정별 차등 지원', aiReason: '직무 교육 계획에 맞는 훈련비 지원을 확인해요.', conditions: [] },
  { id: 'youth-dream-account-ai', type: 'policy', icon: '🏦', iconBg: '#DBEAFE', title: '청년주택드림청약통장', subtitle: '가입·전환 조건 확인', statusLabel: '조건 확인 가능', statusColor: '#16A34A', amount: 0, amountLabel: '금리·청약 혜택', aiReason: '무주택 청년 가입 요건을 확인해요.', conditions: [] },
  { id: 'youth-leap-account-ai', type: 'policy', icon: '📈', iconBg: '#D1FAE5', title: '청년도약계좌', subtitle: '정부기여금·비과세 확인', statusLabel: '조건 확인 가능', statusColor: '#16A34A', amount: 0, amountLabel: '소득별 차등 지원', aiReason: '청년도약계좌 가입 요건을 확인해요.', conditions: [] },
]

export const hanbeoteamAdditionalAiBenefits: AiBenefit[] = [
  { id: 'dependent-parent-ai', type: 'tax', icon: '👵', iconBg: '#EDE9FE', title: '따로 사는 부모님 인적공제', subtitle: '생활비 이체 기반 확인', statusLabel: '조건 확인 가능', statusColor: '#2563EB', amount: 1500000, amountLabel: '1인 공제 금액', aiReason: '부모님 생활비 이체 내역을 바탕으로 인적공제 가능성을 확인해요.', conditions: [] },
  { id: 'donation-ai', type: 'tax', icon: '🤝', iconBg: '#FCE7F3', title: '기부금 세액공제', subtitle: '영수증 반영 여부 확인', statusLabel: '조건 확인 가능', statusColor: '#2563EB', amount: 0, amountLabel: '기부액 기준 공제', aiReason: '기부금 영수증 반영 여부를 확인해요.', conditions: [] },
  { id: 'sme-tax-reduction-ai', type: 'tax', icon: '🏢', iconBg: '#FEE2E2', title: '중소기업 취업자 소득세 감면', subtitle: '경력단절 재취업 요건 확인', statusLabel: '조건 확인 가능', statusColor: '#2563EB', amount: 2000000, amountLabel: '최대 감면 금액', aiReason: '재직 회사와 재취업 조건을 바탕으로 감면 가능성을 확인해요.', conditions: [] },
  { id: 'single-parent-childcare-ai', type: 'policy', icon: '👩‍👧', iconBg: '#D1FAE5', title: '한부모가족 아동양육비', subtitle: '월 양육비 지원 확인', statusLabel: '조건 확인 가능', statusColor: '#16A34A', amount: 210000, amountLabel: '월 지원 금액', aiReason: '한부모가족의 자녀 연령과 소득인정액을 확인해요.', conditions: [] },
  { id: 'culture-card-ai', type: 'policy', icon: '🎨', iconBg: '#EDE9FE', title: '문화누리카드', subtitle: '카드 발급 대상 확인', statusLabel: '조건 확인 가능', statusColor: '#16A34A', amount: 130000, amountLabel: '연 지원 금액', aiReason: '문화누리카드 발급 대상과 신청 방법을 확인해요.', conditions: [] },
  { id: 'bucheon-family-ai', type: 'policy', icon: '🏠', iconBg: '#FEF3C7', title: '부천시 한부모 생활안심 지원', subtitle: '지역 지원 공고 확인', statusLabel: '조건 확인 가능', statusColor: '#16A34A', amount: 0, amountLabel: '공고별 차등 지원', aiReason: '부천시 거주 한부모 가구가 확인할 지역 지원을 살펴봐요.', conditions: [] },
]
