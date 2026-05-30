import type { CoachId } from '../context/ChatbotCoachContext'
import { additionalBenefitConversations } from './additionalBenefitChats'

export type CoachVariant = Record<CoachId, string>
export type LocalizedText = string | CoachVariant

export type ConvOption = {
  label: string
  isPositive: boolean
  followUp?: LocalizedText
}

export type ConvQuestion = {
  message: string          // 질문은 항상 명확한 단일 문장
  options: ConvOption[]
}

export type BenefitConversation = {
  intro: LocalizedText
  questions: ConvQuestion[]
  positiveResult: {
    title: LocalizedText
    subtitle: LocalizedText
    actions: Array<{ label: string; action: string }>
  }
  negativeResult: {
    title: LocalizedText
    subtitle: LocalizedText
  }
}

export function resolveText(text: LocalizedText, coachId: CoachId | null): string {
  if (typeof text === 'string') return text
  return coachId ? text[coachId] : text.summary
}

// ─────────────────────────────────────────────────────────────────────
// 김갓생 혜택
// ─────────────────────────────────────────────────────────────────────

export const benefitConversations: Record<string, BenefitConversation> = {
  ...additionalBenefitConversations,

  'rent-tax-ai': {
    intro: {
      easy:     '월세 이체 내역을 찾았어요! 공제 받을 수 있는지 같이 확인해봐요.',
      summary:  '월세 이체 내역이 있어요. 세액공제 가능 여부를 바로 확인해드릴게요.',
      strategy: '월세 이체 내역을 기반으로 세액공제 요건을 하나씩 검토해볼게요.',
    },
    questions: [
      {
        message: '현재 무주택 세대주인가요?',
        options: [
          { label: '네, 맞아요', isPositive: true },
          {
            label: '아니요',
            isPositive: false,
            followUp: {
              easy:     '월세 공제는 무주택 세대주 조건을 먼저 확인해야 해요. 세대 정보를 확인해봐요!',
              summary:  '무주택 세대주 여부를 먼저 확인해주세요.',
              strategy: '무주택 세대주 요건을 충족하는지 확인이 필요합니다.',
            },
          },
        ],
      },
      {
        message: '현재 거주지에 전입신고가 되어 있나요?',
        options: [
          { label: '네, 되어 있어요', isPositive: true },
          {
            label: '아직 안 했어요',
            isPositive: false,
            followUp: {
              easy:     '전입신고 후에 공제 신청이 가능해요. 먼저 주소 등록을 마쳐주세요.',
              summary:  '전입신고를 먼저 하시면 공제 신청이 가능해요.',
              strategy: '전입신고 완료 후 신청을 진행하세요.',
            },
          },
        ],
      },
      {
        message: '임대차계약서 주소와 현재 거주지 주소가 일치하나요?',
        options: [
          { label: '네, 일치해요', isPositive: true },
          {
            label: '주소가 달라요',
            isPositive: false,
            followUp: {
              easy:     '계약서와 전입신고 주소가 같아야 해요. 주소를 정리한 뒤 다시 확인해봐요!',
              summary:  '계약서 주소와 현재 거주지 주소가 일치해야 해요.',
              strategy: '계약서 주소와 주민등록 주소를 일치시킨 후 재확인하세요.',
            },
          },
        ],
      },
    ],
    positiveResult: {
      title: {
        easy:     '공제 받을 수 있어요!',
        summary:  '세액공제 가능해요!',
        strategy: '요건 충족 — 월세 세액공제 신청 가능합니다.',
      },
      subtitle: {
        easy:     '월세 세액공제 받을 수 있어요. 연말정산 때 환급받을 수 있답니다!',
        summary:  '월세액 세액공제 후보로 확인됐어요.',
        strategy: '무주택·전입신고·주소 일치 요건 충족. 연말정산 시 신청하세요.',
      },
      actions: [
        { label: '이체 내역 확인', action: 'transfer' },
        { label: '다음 혜택 보기', action: 'next' },
      ],
    },
    negativeResult: {
      title: {
        easy:     '아직은 조건이 맞지 않아요',
        summary:  '조건을 확인해보세요',
        strategy: '현재 요건 미충족',
      },
      subtitle: {
        easy:     '전입신고나 주소 확인 후 다시 시도해봐요!',
        summary:  '무주택·전입신고·주소 일치 요건을 확인해주세요.',
        strategy: '확인된 미충족 요건을 해소한 뒤 재신청을 권장합니다.',
      },
    },
  },

  'youth-rent-ai': {
    intro: {
      easy:     '청년월세지원이라는 게 있어요! 나라에서 월세를 도와줘요. 받을 수 있는지 볼게요.',
      summary:  '청년월세지원 대상 여부를 확인해드릴게요.',
      strategy: '청년월세지원 신청 요건을 하나씩 검토해볼게요.',
    },
    questions: [
      {
        message: '현재 만 19~34세인가요?',
        options: [
          { label: '네, 맞아요', isPositive: true },
          {
            label: '아니요',
            isPositive: false,
            followUp: {
              easy:     '아쉽게도 이 지원은 만 19~34세 청년만 받을 수 있어요. 다른 혜택을 찾아볼게요!',
              summary:  '청년월세지원은 만 19~34세 대상이에요.',
              strategy: '나이 요건 미충족. 만 19~34세 청년만 신청 가능합니다.',
            },
          },
        ],
      },
      {
        message: '부모님과 따로 거주 중인 무주택 청년인가요?',
        options: [
          { label: '네, 따로 살고 있어요', isPositive: true },
          {
            label: '아니요',
            isPositive: false,
            followUp: {
              easy:     '부모님과 따로 살고 있는 무주택 청년이 신청할 수 있어요.',
              summary:  '부모님과 별도 거주 중인 무주택 청년이어야 해요.',
              strategy: '별도 거주·무주택 요건을 확인해주세요.',
            },
          },
        ],
      },
      {
        message: '가구 소득 기준을 충족하는지 확인해볼까요?',
        options: [
          {
            label: '네, 확인해 주세요',
            isPositive: true,
            followUp: {
              easy:     '확인했어요! 김갓생님은 가구 소득 기준도 충족할 가능성이 높아요.',
              summary:  '가구 소득 기준도 충족 가능성이 높은 것으로 확인됐어요.',
              strategy: '가구 소득 기준 충족 가능성이 높습니다.',
            },
          },
          {
            label: '나중에 확인할게요',
            isPositive: false,
            followUp: {
              easy:     '좋아요. 소득 기준을 확인한 뒤 다시 신청 여부를 살펴봐요!',
              summary:  '가구 소득 기준 확인 후 신청 가능 여부를 안내해드릴게요.',
              strategy: '가구 소득 기준 확인 후 재검토하세요.',
            },
          },
        ],
      },
    ],
    positiveResult: {
      title: {
        easy:     '신청할 수 있어요!',
        summary:  '신청 가능해요!',
        strategy: '요건 충족 — 신청 가능합니다.',
      },
      subtitle: {
        easy:     '청년월세지원 신청 대상이에요. 어서 신청해봐요!',
        summary:  '청년월세지원 신청 대상으로 확인됐어요.',
        strategy: '나이·별도 거주·무주택·소득 요건 확인 완료. 복지로에서 신청하세요.',
      },
      actions: [
        { label: '신청하러 가기', action: 'policy' },
        { label: '다음 혜택 보기', action: 'next' },
      ],
    },
    negativeResult: {
      title: {
        easy:     '아직은 조건이 안 맞아요',
        summary:  '지원 조건을 확인해보세요',
        strategy: '요건 미충족',
      },
      subtitle: {
        easy:     '나이·1인 가구·월세 금액 조건을 다시 확인해봐요!',
        summary:  '나이·별도 거주·무주택·소득 조건을 확인해주세요.',
        strategy: '청년월세지원 요건(나이·무주택·월세) 중 일부 미충족입니다.',
      },
    },
  },

  'glasses-ai': {
    intro: {
      easy:     'OO안경원에서 결제한 내역이 있어요! 공제가 되는지 같이 확인해봐요.',
      summary:  'OO안경원 결제 내역이 있어요. 의료비 공제 가능 여부를 확인할게요.',
      strategy: 'OO안경원 150,000원 결제 내역을 분석했어요. 의료비 세액공제 요건을 검토할게요.',
    },
    questions: [
      {
        message: 'OO안경원 결제가 시력교정용 안경/렌즈 구입비인가요?',
        options: [
          {
            label: '네, 맞아요',
            isPositive: true,
            followUp: {
              easy:     '좋아요! 시력교정용 안경이나 렌즈는 의료비로 인정돼서 공제를 받을 수 있어요.',
              summary:  '시력교정용 안경/렌즈는 의료비 공제 대상이에요.',
              strategy: '시력교정 목적 안경/렌즈 — 의료비 세액공제 대상으로 인정됩니다.',
            },
          },
          {
            label: '아니요, 다른 용도예요',
            isPositive: false,
            followUp: {
              easy:     '시력교정용이 아니면 안타깝게도 의료비 공제가 안 돼요.',
              summary:  '시력교정용이 아닌 경우 공제 대상이 되지 않아요.',
              strategy: '의료 목적이 아닌 구입비는 의료비 세액공제 대상에서 제외됩니다.',
            },
          },
        ],
      },
      {
        message: '본인이나 부양가족을 위해 구입한 안경 또는 렌즈인가요?',
        options: [
          { label: '네, 맞아요', isPositive: true },
          {
            label: '아니요',
            isPositive: false,
            followUp: {
              easy:     '본인이나 부양가족을 위해 구입한 비용인지 먼저 확인해봐야 해요.',
              summary:  '본인 또는 부양가족을 위한 지출인지 확인해주세요.',
              strategy: '공제 대상자를 위한 의료비 지출인지 확인이 필요합니다.',
            },
          },
        ],
      },
      {
        message: '안경원에서 받은 영수증이나 구입 확인서가 있나요?',
        options: [
          { label: '네, 있어요', isPositive: true },
          {
            label: '없어요',
            isPositive: false,
            followUp: {
              easy:     '괜찮아요! 안경원에서 영수증이나 구입 확인서를 다시 받아 등록하면 돼요.',
              summary:  '안경원에서 증빙을 발급받은 뒤 등록해주세요.',
              strategy: '증빙 미보유. 안경원에서 영수증 또는 구입 확인서를 발급받아 등록하세요.',
            },
          },
        ],
      },
    ],
    positiveResult: {
      title: {
        easy:     '공제 받을 수 있어요!',
        summary:  '공제 가능성이 높아요!',
        strategy: '요건 충족 — 의료비 세액공제 신청 가능합니다.',
      },
      subtitle: {
        easy:     '의료비 세액공제 대상이에요. 연말정산에서 돌려받을 수 있어요!',
        summary:  '의료비 세액공제 후보로 확인됐어요.',
        strategy: '시력교정 목적·공제 대상자·증빙서류 요건 충족.',
      },
      actions: [
        { label: '영수증 등록', action: 'receipt' },
        { label: '다음 혜택 보기', action: 'next' },
      ],
    },
    negativeResult: {
      title: {
        easy:     '이번엔 공제가 어렵네요',
        summary:  '공제 가능성이 낮아요',
        strategy: '현재 요건 미충족',
      },
      subtitle: {
        easy:     '영수증을 안경원에서 재발급받아 다시 시도해봐요!',
        summary:  '구입 목적과 대상자를 확인하고 증빙을 준비해주세요.',
        strategy: '증빙서류 확보 후 재시도를 권장합니다.',
      },
    },
  },

  'monthly-transfer-ai': {
    intro: {
      easy:     '매달 같은 금액을 이체하고 있네요! 혹시 월세인지 확인해볼게요.',
      summary:  '매월 고정 이체 내역이 있어요. 월세 공제 가능 여부를 확인할게요.',
      strategy: '매월 700,000원 이체 패턴을 분석했어요. 월세 공제 요건을 검토할게요.',
    },
    questions: [
      {
        message: '이 이체가 집주인(임대인)에게 보내는 월세인가요?',
        options: [
          { label: '네, 월세예요', isPositive: true },
          {
            label: '다른 용도예요',
            isPositive: false,
            followUp: {
              easy:     '월세가 아니면 이 공제는 해당이 안 돼요. 다른 혜택을 찾아볼게요!',
              summary:  '임대인에게 보내는 월세여야 공제가 가능해요.',
              strategy: '월세 이체가 아닌 경우 월세 세액공제 대상에서 제외됩니다.',
            },
          },
        ],
      },
      {
        message: '현재 거주지 주소로 작성된 임대차계약서가 있나요?',
        options: [
          { label: '있어요', isPositive: true },
          {
            label: '없어요',
            isPositive: false,
            followUp: {
              easy:     '현재 거주지 주소가 적힌 계약서가 필요해요. 계약서를 준비한 뒤 다시 확인해봐요!',
              summary:  '현재 거주지 주소가 적힌 임대차계약서를 준비해주세요.',
              strategy: '현재 거주지 주소로 작성된 임대차계약서를 준비한 후 재시도하세요.',
            },
          },
        ],
      },
      {
        message: '현재 거주지에 전입신고가 완료되어 있나요?',
        options: [
          { label: '네, 완료됐어요', isPositive: true },
          {
            label: '아직이에요',
            isPositive: false,
            followUp: {
              easy:     '전입신고 후 공제 신청이 가능해요. 주민센터에서 간단하게 할 수 있어요!',
              summary:  '전입신고 후 공제 신청이 가능해요.',
              strategy: '전입신고는 월세 공제 필수 조건입니다. 완료 후 신청하세요.',
            },
          },
        ],
      },
    ],
    positiveResult: {
      title: {
        easy:     '월세 공제 받을 수 있어요!',
        summary:  '월세 공제 가능해요!',
        strategy: '요건 충족 — 월세 세액공제 신청 가능합니다.',
      },
      subtitle: {
        easy:     '월세 이체 내역으로 공제를 받을 수 있어요. 연말정산 때 챙겨요!',
        summary:  '월세 공제 신청을 진행해보세요.',
        strategy: '임대인 이체·계약서·전입신고 요건 모두 충족. 연말정산 시 신청하세요.',
      },
      actions: [
        { label: '이체 내역 확인', action: 'transfer' },
        { label: '다음 혜택 보기', action: 'next' },
      ],
    },
    negativeResult: {
      title: {
        easy:     '조건을 좀 더 갖춰야 해요',
        summary:  '조건을 충족하면 가능해요',
        strategy: '요건 미충족',
      },
      subtitle: {
        easy:     '계약서 작성이나 전입신고 후 다시 확인해봐요!',
        summary:  '전입신고, 계약서 준비 후 다시 확인해보세요.',
        strategy: '계약서·전입신고 등 필수 요건 준비 후 재신청을 권장합니다.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────
  // 한버팀 혜택
  // ─────────────────────────────────────────────────────────────────────

  'eitc-ai': {
    intro: {
      easy:     '근로장려금이라고 나라에서 돈을 돌려주는 제도가 있어요! 받을 수 있는지 같이 확인해봐요.',
      summary:  '근로·자녀장려금 신청 가능 여부를 확인해드릴게요.',
      strategy: '근로·자녀장려금 수급 요건을 하나씩 검토해볼게요.',
    },
    questions: [
      {
        message: '작년 가구 총소득이 홑벌이 가구 기준 3,200만원 미만인가요?',
        options: [
          { label: '네, 이하예요', isPositive: true },
          {
            label: '초과해요',
            isPositive: false,
            followUp: {
              easy:     '소득이 그보다 많으면 이 장려금은 받기 어려워요. 다른 혜택을 찾아볼게요!',
              summary:  '소득 기준 초과 시 장려금 수령이 어려울 수 있어요.',
              strategy: '총소득 기준 초과 — 근로장려금 수급이 어렵습니다.',
            },
          },
        ],
      },
      {
        message: '18세 미만 부양자녀가 있나요?',
        options: [
          {
            label: '네, 있어요',
            isPositive: true,
            followUp: {
              easy:     '자녀장려금도 함께 받을 수 있어요! 두 가지 다 신청해요.',
              summary:  '자녀장려금도 함께 신청 가능해요.',
              strategy: '자녀장려금 중복 수령 가능. 근로장려금과 함께 신청하세요.',
            },
          },
          { label: '없어요', isPositive: true },
        ],
      },
      {
        message: '가구 전체 재산이 2억 4천만원 미만인가요?',
        options: [
          { label: '네, 미만이에요', isPositive: true },
          {
            label: '2억 4천만원 이상이에요',
            isPositive: false,
            followUp: {
              easy:     '재산이 2억 4천만원 이상이면 장려금을 받기 어려워요. 다른 공제를 찾아볼게요!',
              summary:  '재산 기준을 초과하면 장려금을 받기 어려워요.',
              strategy: '재산 요건 미충족. 가구 재산이 기준을 초과합니다.',
            },
          },
        ],
      },
    ],
    positiveResult: {
      title: {
        easy:     '신청할 수 있어요!',
        summary:  '신청 가능성이 높아요!',
        strategy: '요건 충족 — 신청 가능합니다.',
      },
      subtitle: {
        easy:     '5월에 홈택스에서 신청하면 장려금을 받을 수 있어요! 놓치지 마세요.',
        summary:  '5월 정기 신청 기간에 홈택스에서 신청하세요.',
        strategy: '소득·가구·재산 요건 확인 완료. 5월 정기 신청 기간을 놓치지 마세요.',
      },
      actions: [
        { label: '홈택스 바로가기', action: 'apply' },
        { label: '다음 혜택 보기', action: 'next' },
      ],
    },
    negativeResult: {
      title: {
        easy:     '조건이 맞지 않아요',
        summary:  '조건을 다시 확인해보세요',
        strategy: '요건 미충족',
      },
      subtitle: {
        easy:     '소득이나 재산 조건이 맞지 않아요. 다른 혜택을 찾아볼게요!',
        summary:  '소득·재산 기준을 충족해야 신청 가능해요.',
        strategy: '소득 또는 재산 요건 미충족. 타 공제 항목을 검토하세요.',
      },
    },
  },

  'single-parent-ai': {
    intro: {
      easy:     '한부모 가정이시면 세금을 더 줄여주는 제도가 있어요! 같이 확인해봐요.',
      summary:  '한부모 소득공제 대상 여부를 확인해드릴게요.',
      strategy: '한부모 소득공제 수급 요건을 검토해볼게요.',
    },
    questions: [
      {
        message: '현재 배우자가 없나요?',
        options: [
          { label: '네, 맞아요', isPositive: true },
          {
            label: '아니요',
            isPositive: false,
            followUp: {
              easy:     '배우자가 있으면 한부모 공제는 해당이 안 돼요. 대신 부녀자 공제를 확인해봐요!',
              summary:  '배우자가 없는 경우에만 한부모 공제가 적용돼요.',
              strategy: '한부모 공제는 배우자가 없는 근로자에게 적용됩니다.',
            },
          },
        ],
      },
      {
        message: '기본공제 대상 자녀가 있나요?',
        options: [
          { label: '네, 있어요', isPositive: true },
          {
            label: '없어요',
            isPositive: false,
            followUp: {
              easy:     '기본공제 대상 자녀가 있어야 한부모 공제를 받을 수 있어요.',
              summary:  '기본공제 대상 자녀가 있어야 한부모 공제를 받을 수 있어요.',
              strategy: '부양자녀 요건 미충족 — 기본공제 대상 자녀가 없으면 적용 불가입니다.',
            },
          },
        ],
      },
      {
        message: '작년 연말정산에서 부녀자 공제를 받으셨나요?',
        options: [
          {
            label: '네, 받았어요',
            isPositive: true,
            followUp: {
              easy:     '한부모 공제가 부녀자 공제보다 더 많이 줄여줘요! 바꿔서 신청하는 게 유리해요.',
              summary:  '한부모 공제(100만원)가 부녀자 공제(50만원)보다 더 유리해요.',
              strategy: '한부모 공제(100만원)가 부녀자 공제(50만원)보다 유리합니다. 변경을 권장합니다.',
            },
          },
          { label: '받지 않았어요', isPositive: true },
        ],
      },
    ],
    positiveResult: {
      title: {
        easy:     '공제 받을 수 있어요!',
        summary:  '공제 대상이에요!',
        strategy: '요건 충족 — 한부모 소득공제 신청 가능합니다.',
      },
      subtitle: {
        easy:     '연 100만원을 소득에서 더 빼줘요. 세금이 줄어들어요!',
        summary:  '연 100만원 추가 공제를 받을 수 있어요.',
        strategy: '한부모 소득공제 100만원 적용 가능. 연말정산 시 반드시 신청하세요.',
      },
      actions: [
        { label: '공제 신청하기', action: 'apply' },
        { label: '다음 혜택 보기', action: 'next' },
      ],
    },
    negativeResult: {
      title: {
        easy:     '조건이 맞지 않아요',
        summary:  '조건을 확인해보세요',
        strategy: '요건 미충족',
      },
      subtitle: {
        easy:     '배우자가 없고 기본공제 대상 자녀가 있어야 해요.',
        summary:  '무배우자 + 기본공제 대상 자녀 조건이 필요해요.',
        strategy: '무배우자·부양자녀 요건 미충족입니다.',
      },
    },
  },

  'care-ai': {
    intro: {
      easy:     '아이돌봄서비스라고 선생님이 집에 와서 아이를 봐주는 서비스예요! 받을 수 있는지 볼게요.',
      summary:  '아이돌봄서비스 신청 가능 여부를 확인해드릴게요.',
      strategy: '아이돌봄서비스 지원 요건을 검토할게요.',
    },
    questions: [
      {
        message: '돌봄이 필요한 만 12세 이하 자녀가 있나요?',
        options: [
          { label: '네, 있어요', isPositive: true },
          {
            label: '없어요',
            isPositive: false,
            followUp: {
              easy:     '만 12살을 넘은 자녀는 이 서비스 대상이 아니에요. 다른 지원을 알아봐요!',
              summary:  '만 12세 이하 자녀가 있어야 서비스 이용이 가능해요.',
              strategy: '연령 요건 미충족. 만 13세 이상은 대상이 아닙니다.',
            },
          },
        ],
      },
      {
        message: '맞벌이·한부모 등으로 돌봄 공백이 있나요?',
        options: [
          {
            label: '네, 돌봄이 필요해요',
            isPositive: true,
            followUp: {
              easy:     '좋아요. 필요한 시간에 아이돌보미 방문을 신청할 수 있어요.',
              summary:  '돌봄 공백이 있는 가정은 서비스를 신청할 수 있어요.',
              strategy: '돌봄 공백 요건 확인 완료. 서비스 신청 절차를 진행할 수 있습니다.',
            },
          },
          {
            label: '돌봄 공백은 없어요',
            isPositive: false,
            followUp: {
              easy:     '지금은 돌봄 공백이 없군요. 필요할 때 다시 확인해봐요!',
              summary:  '돌봄 공백이 생기면 다시 신청 여부를 확인해보세요.',
              strategy: '현재 돌봄 공백 없음. 필요 시 재검토하세요.',
            },
          },
        ],
      },
      {
        message: '아이돌봄서비스 결제에 필요한 국민행복카드가 있나요?',
        options: [
          { label: '네, 있어요', isPositive: true },
          {
            label: '아직 없어요',
            isPositive: false,
            followUp: {
              easy:     '먼저 국민행복카드를 발급받으면 돼요. 카드 준비 후 바로 신청해봐요!',
              summary:  '국민행복카드를 준비한 뒤 서비스를 신청해주세요.',
              strategy: '국민행복카드 발급 후 서비스 신청을 진행하세요.',
            },
          },
        ],
      },
    ],
    positiveResult: {
      title: {
        easy:     '신청할 수 있어요!',
        summary:  '신청 가능해요!',
        strategy: '요건 충족 — 신청 가능합니다.',
      },
      subtitle: {
        easy:     '아이돌봄서비스를 신청할 수 있어요! 필요한 시간에 방문 돌봄을 받아보세요.',
        summary:  '아이돌봄서비스 신청 조건을 확인했어요.',
        strategy: '아동 연령·돌봄 공백·결제수단 확인 완료. 서비스 신청을 진행하세요.',
      },
      actions: [
        { label: '신청하러 가기', action: 'policy' },
        { label: '다음 혜택 보기', action: 'next' },
      ],
    },
    negativeResult: {
      title: {
        easy:     '지금은 조건이 안 맞아요',
        summary:  '서비스 조건을 확인해보세요',
        strategy: '요건 미충족',
      },
      subtitle: {
        easy:     '자녀 연령과 돌봄 필요 여부를 확인하고, 국민행복카드를 준비해주세요.',
        summary:  '자녀 연령·돌봄 공백·국민행복카드 준비 여부를 확인해주세요.',
        strategy: '확인되지 않은 신청 조건을 준비한 뒤 재검토하세요.',
      },
    },
  },

  'baby-supplies-ai': {
    intro: {
      easy:     '최근 기저귀나 육아용품 결제가 자주 보여요. 자녀가 생기셨나요? 받을 수 있는 지원을 같이 확인해봐요.',
      summary:  '최근 육아용품 결제가 반복되어 자녀 관련 지원 가능성을 확인할게요.',
      strategy: '육아용품 반복 결제를 기반으로 자녀 양육 지원 후보를 검토할게요.',
    },
    questions: [
      {
        message: '최근 출생했거나 현재 양육 중인 자녀가 있나요?',
        options: [
          { label: '네, 있어요', isPositive: true },
          {
            label: '아니요',
            isPositive: false,
            followUp: {
              easy:     '알겠어요. 이번 결제는 자녀 양육과 관련 없는 내역으로 정리할게요.',
              summary:  '자녀 양육과 관련 없는 결제로 확인했어요.',
              strategy: '자녀 양육 관련 결제가 아니므로 지원 후보에서 제외합니다.',
            },
          },
        ],
      },
      {
        message: '현재 한부모 가정에 해당하나요?',
        options: [
          { label: '네, 해당해요', isPositive: true },
          {
            label: '아니요',
            isPositive: false,
            followUp: {
              easy:     '괜찮아요. 한부모 지원 외에도 받을 수 있는 육아 지원을 확인해볼게요.',
              summary:  '일반 자녀 양육 지원을 기준으로 다시 확인해볼게요.',
              strategy: '한부모 전용 지원 외 일반 양육 지원 검토가 필요합니다.',
            },
          },
        ],
      },
      {
        message: '한부모가족 아동양육비 지원을 이미 신청하셨나요?',
        options: [
          { label: '아직 신청하지 않았어요', isPositive: true },
          {
            label: '이미 신청했어요',
            isPositive: true,
            followUp: {
              easy:     '좋아요. 지급 내역과 추가로 받을 수 있는 지원을 함께 확인해볼게요.',
              summary:  '기존 신청 내역과 추가 지원 가능성을 함께 확인할게요.',
              strategy: '기존 신청 상태를 반영해 추가 지원 후보를 검토합니다.',
            },
          },
        ],
      },
    ],
    positiveResult: {
      title: {
        easy:     '자녀 지원을 더 확인해볼 수 있어요!',
        summary:  '자녀 관련 지원 후보가 있어요',
        strategy: '자녀 양육 지원 후보 확인 완료',
      },
      subtitle: {
        easy:     '한부모가족 아동양육비와 아이돌봄서비스를 함께 살펴보면 좋아요.',
        summary:  '아동양육비와 아이돌봄서비스 신청 여부를 확인해보세요.',
        strategy: '아동양육비 및 돌봄서비스 신청 상태 확인을 권장합니다.',
      },
      actions: [
        { label: '지원 정책 보러 가기', action: 'policy' },
        { label: '다음 알림 보기', action: 'next' },
      ],
    },
    negativeResult: {
      title: {
        easy:     '이번 결제는 제외할게요',
        summary:  '자녀 지원 후보에서 제외했어요',
        strategy: '지원 후보 제외',
      },
      subtitle: {
        easy:     '다른 카드·계좌 내역에서 놓친 혜택이 있는지 계속 살펴볼게요.',
        summary:  '다른 금융 활동에서 확인할 후보를 계속 찾아볼게요.',
        strategy: '비관련 결제로 분류하고 다른 감지 후보를 검토합니다.',
      },
    },
  },

  'activity-ai': {
    intro: {
      easy:     '취학 전 아이의 학원비나 체육시설 수강료도 공제받을 수 있어요! 확인해볼게요.',
      summary:  '취학 전 아동 교육비 세액공제 가능 여부를 확인할게요.',
      strategy: '취학 전 아동 교육비의 세액공제 요건을 검토할게요.',
    },
    questions: [
      {
        message: '이 결제가 취학 전 자녀의 학원비나 체육시설 수강료인가요?',
        options: [
          { label: '네, 맞아요', isPositive: true },
          {
            label: '아니요',
            isPositive: false,
            followUp: {
              easy:     '초등학교 입학 전 아이 교육비여야 공제가 돼요.',
              summary:  '취학 전 아동 교육비여야 세액공제 대상이 돼요.',
              strategy: '취학 전 아동 교육비 요건 미충족입니다.',
            },
          },
        ],
      },
      {
        message: '영수증이나 결제 내역이 있나요?',
        options: [
          { label: '있어요', isPositive: true },
          {
            label: '없어요',
            isPositive: false,
            followUp: {
              easy:     '어린이집에서 영수증을 받아두시면 공제를 신청할 수 있어요!',
              summary:  '어린이집에서 영수증을 받아두시면 공제 신청이 가능해요.',
              strategy: '증빙 서류 미보유. 교육기관에서 영수증을 발급받아 제출하세요.',
            },
          },
        ],
      },
      {
        message: '연말정산 간소화 서비스에서 이 결제 내역이 조회되나요?',
        options: [
          {
            label: '조회되지 않아요',
            isPositive: true,
            followUp: {
              easy:     '직접 서류를 제출하면 공제받을 수 있어요! 어렵지 않아요.',
              summary:  '직접 서류를 제출하면 공제받을 수 있어요.',
              strategy: '간소화 미반영 교육비는 영수증 직접 제출로 공제 가능합니다.',
            },
          },
          { label: '네, 이미 조회돼요', isPositive: true },
        ],
      },
    ],
    positiveResult: {
      title: {
        easy:     '공제 받을 수 있어요!',
        summary:  '공제 가능성이 높아요!',
        strategy: '요건 충족 — 교육비 세액공제 신청 가능합니다.',
      },
      subtitle: {
        easy:     '교육비 세액공제 대상이에요. 연말정산에서 돌려받을 수 있어요!',
        summary:  '교육비 세액공제 후보로 확인됐어요.',
        strategy: '취학 전 교육비·증빙서류 요건 확인 완료. 간소화 반영 여부에 따라 제출하세요.',
      },
      actions: [
        { label: '영수증 등록', action: 'receipt' },
        { label: '다음 혜택 보기', action: 'next' },
      ],
    },
    negativeResult: {
      title: {
        easy:     '이번엔 공제가 어렵네요',
        summary:  '공제 조건을 확인해보세요',
        strategy: '요건 미충족',
      },
      subtitle: {
        easy:     '취학 전 자녀 교육비여야 하고, 영수증도 필요해요.',
        summary:  '취학 전 자녀 교육비 + 영수증 요건을 확인해주세요.',
        strategy: '교육비 세액공제 요건(취학전 아동·증빙서류) 미충족입니다.',
      },
    },
  },
}
