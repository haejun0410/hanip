import { hanbeoteamPolicyDetails } from '../../data/hanbeoteam'
import { kimgodsaengPolicyDetails } from '../../data/kimgodsaeng'

export type PolicyDetail = {
  id: string
  category: string
  badgeColor: string
  icon: string
  title: string
  subtitle: string
  period: string
  dday: string
  target: string
  amountText: string
  amountHighlight?: string
  organization: string
  detailLinks: string[]
  steps: string[]
  documents: string[]
  applyUrlLabel: string
}

export const policies: PolicyDetail[] = [
  {
    id: '1',
    category: '교육',
    badgeColor: 'badge-blue',
    icon: '🎓',
    title: '국가장학금 지원',
    subtitle: '대학의 등록금 부담을 줄여주는 국가장학금 정보를 확인해 보세요',
    period: '2025. 05. 21(수) ~ 2025. 06. 20(금)',
    dday: 'D-30',
    target: '대학교 재학생 및 신입생, 대학원생, 학점은행제, 재직자(소득분위 8구간 이하)',
    amountText: '소득구간 1~3구간 기준 · 최대 학비 전액 지원',
    amountHighlight: '최대 570만원',
    organization: '한국장학재단',
    detailLinks: [
      '소득구간별 세부 지원 항목 확인하기',
      '대학·학과별 지원 여부 확인하기',
      '신청 및 처리 일정 확인하기',
      '이 혜택과 함께 받을 수 있는 혜택 확인하기',
    ],
    steps: ['신청서 작성', '서류 제출', '심사 기간', '결과 확인 및 지급'],
    documents: ['가족관계증명서', '재학증명서 또는 입학예정 증빙', '소득 확인 서류', '본인 명의 계좌'],
    applyUrlLabel: '한국장학재단 바로가기',
  },
  {
    id: '2',
    category: '주거',
    badgeColor: 'badge-orange',
    icon: '🏠',
    title: '신혼부부 전세자금 대출',
    subtitle: '신혼부부의 주거비 부담을 낮추는 저금리 전세자금 대출 정보예요',
    period: '2025. 01. 01(수) ~ 2025. 12. 31(수)',
    dday: '상시',
    target: '혼인 7년 이내 신혼부부 또는 3개월 이내 결혼 예정자, 무주택 세대주',
    amountText: '수도권 최대 3억원, 그 외 지역 최대 2억원 한도',
    amountHighlight: '연 1~2%대 금리',
    organization: '주택도시보증공사',
    detailLinks: [
      '소득 및 자산 기준 확인하기',
      '보증 가능 주택 조건 확인하기',
      '취급 은행과 신청 방법 확인하기',
      '주거비와 함께 받을 수 있는 혜택 확인하기',
    ],
    steps: ['대출 가능 조회', '은행 상담', '보증 심사', '대출 실행'],
    documents: ['혼인관계증명서', '주민등록등본', '임대차계약서', '소득 확인 서류'],
    applyUrlLabel: '주택도시기금 바로가기',
  },
  {
    id: '3',
    category: '취업·창업',
    badgeColor: 'badge-purple',
    icon: '💼',
    title: '취업성공 패키지',
    subtitle: '구직 단계에 맞춘 상담, 훈련, 취업 연계를 한 번에 받을 수 있어요',
    period: '2025. 03. 01(토) ~ 2025. 08. 15(금)',
    dday: 'D-10',
    target: '취업을 준비 중인 청년, 장기 구직자, 경력단절자 등 취업 지원이 필요한 사람',
    amountText: '상담, 직업훈련, 취업 알선 및 참여수당 지원',
    amountHighlight: '참여수당 최대 300만원',
    organization: '고용노동부',
    detailLinks: [
      '참여 유형별 지원 내용 확인하기',
      '직업훈련 과정 확인하기',
      '상담 기관과 일정 확인하기',
      '취업 후 연계 혜택 확인하기',
    ],
    steps: ['참여 신청', '상담 배정', '훈련 참여', '취업 연계'],
    documents: ['신분증', '구직신청서', '소득 확인 서류', '교육·경력 증빙'],
    applyUrlLabel: '고용24 바로가기',
  },
  {
    id: '4',
    category: '생활·복지',
    badgeColor: 'badge-green',
    icon: '⚡',
    title: '에너지바우처 지원',
    subtitle: '에너지 취약계층의 전기·가스·난방비 부담을 덜어드려요',
    period: '2025. 05. 01(목) ~ 2025. 05. 31(토)',
    dday: 'D-5',
    target: '기초생활수급자 중 노인, 영유아, 장애인, 임산부 등 세대원 특성 기준 충족 가구',
    amountText: '가구원 수와 계절에 따라 전기·도시가스·지역난방 비용 지원',
    amountHighlight: '가구별 차등 지원',
    organization: '산업통상자원부',
    detailLinks: [
      '가구원 수별 지원 금액 확인하기',
      '사용 가능한 에너지 종류 확인하기',
      '주민센터 신청 일정 확인하기',
      '복지 혜택 중복 가능 여부 확인하기',
    ],
    steps: ['대상 확인', '주민센터 신청', '자격 심사', '바우처 사용'],
    documents: ['신분증', '수급자 증명서', '전기·가스 고객번호', '대리 신청 위임장(해당 시)'],
    applyUrlLabel: '복지로 바로가기',
  },
  {
    id: '5',
    category: '생활',
    badgeColor: 'badge-gray',
    icon: '🧭',
    title: '맞춤 복지 서비스',
    subtitle: '내 상황에 맞는 정부 복지 서비스를 모아 확인할 수 있어요',
    period: '상시 신청',
    dday: '상시',
    target: '소득, 가구, 연령, 건강 상태 등에 따라 복지 혜택 확인이 필요한 누구나',
    amountText: '복지 항목별 지원 금액과 신청 조건이 달라요',
    amountHighlight: '개인별 맞춤 안내',
    organization: '행정안전부',
    detailLinks: [
      '내 조건에 맞는 복지 항목 확인하기',
      '가구 유형별 지원 내용 확인하기',
      '온라인 신청 가능한 서비스 확인하기',
      '놓치기 쉬운 생활 혜택 확인하기',
    ],
    steps: ['조건 입력', '혜택 조회', '신청 항목 선택', '온라인 신청'],
    documents: ['본인 인증 수단', '가구 정보', '소득 확인 서류', '서비스별 추가 서류'],
    applyUrlLabel: '정부24 바로가기',
  },
]

export function getPolicyById(id?: string) {
  return [...policies, ...hanbeoteamPolicyDetails, ...kimgodsaengPolicyDetails].find((policy) => policy.id === id) ?? policies[0]
}
