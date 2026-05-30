import type { PolicyDetail } from '../pages/Policy/policyData'
import type { AiBenefit } from '../types/aiBenefit'

export const KIMGODSAENG_NAME = '김갓생'

export const kimgodsaengHome = {
  totalBenefit: '145',
  amountLabel: '예상 환급액',
  headline: '예상 환급액은<br/><span style="color:#3B6FE8">총 145만 원</span>이에요!',
  summary: '절세(혜택) 추천 항목 3개',
  benefits: [
    { title: '월세액 세액공제', amount: '월세의 17% 공제', route: '/recommend/monthly-rent' },
    { title: '주택청약종합저축 소득공제', amount: '납입액의 40% 공제', route: '/recommend/housing-subscription' },
    { title: '고향사랑기부제', amount: '10만 원 기부로 13만 원 혜택', route: '/recommend/hometown-donation' },
  ],
  knowledge: {
    title: '안경 및 렌즈<br />의료비 공제 가능해요',
    desc: '안경점 결제 내역은 직접 챙기면 환급액이 늘 수 있어요.',
    route: '/recommend/glasses-medical',
  },
}

export const kimgodsaengCalendarEvents = {
  '2025-10-20': [
    { id: 'kg1', type: 'tax' as const, badge: '세금', badgeColor: 'badge-orange', emoji: '📊', title: '국세청 연말정산 미리보기 오픈', period: '소비 비율 확인', route: '/recommend/card-strategy' },
  ],
  '2025-11-01': [
    { id: 'kg2', type: 'tax' as const, badge: '세금', badgeColor: 'badge-orange', emoji: '🧾', title: '연말정산 미리보기 점검', period: '체크카드 전환 추천', route: '/recommend/card-strategy' },
  ],
  '2025-12-20': [
    { id: 'kg3', type: 'tax' as const, badge: '세금', badgeColor: 'badge-orange', emoji: '🏦', title: '무주택확인서 은행 제출 준비', period: '12/31 마감', route: '/recommend/housing-subscription' },
  ],
  '2025-12-31': [
    { id: 'kg4', type: 'tax' as const, badge: '세금', badgeColor: 'badge-orange', emoji: '🚨', title: '청약저축 소득공제 무주택확인서 제출 마감', period: '오늘 마감!', route: '/recommend/housing-subscription' },
  ],
}

export const kimgodsaengRecommendations = [
  { id: 'monthly-rent', emoji: '🏠', label: '월세액 세액공제', amount: '최대 17%', tag: '#월세 환급', iconBg: '#FEF3C7' },
  { id: 'housing-subscription', emoji: '🏦', label: '주택청약종합저축', amount: '40% 공제', tag: '#무주택확인서', iconBg: '#DBEAFE' },
  { id: 'hometown-donation', emoji: '🎁', label: '고향사랑기부제', amount: '13만원 혜택', tag: '#10만원 기부', iconBg: '#FCE7F3' },
  { id: 'glasses-medical', emoji: '👓', label: '안경/렌즈 의료비', amount: '연 50만원', tag: '#직접 등록', iconBg: '#EDE9FE' },
  { id: 'student-loan', emoji: '🎓', label: '학자금 대출 상환액', amount: '15% 공제', tag: '#교육비 세액공제', iconBg: '#D1FAE5' },
  { id: 'pension-irp', emoji: '📈', label: '연금저축/IRP', amount: '최대 900만원', tag: '#13월의 월급', iconBg: '#FEE2E2' },
]

export const kimgodsaengRecommendationDetails = {
  'monthly-rent': {
    category: '주거비 공제', categoryColor: 'badge-orange',
    emoji: '🏠', title: '월세액 세액공제',
    subtitle: '서울 자취 월세 이체내역을 바탕으로\n예상 환급액을 계산했어요.',
    tag: '#조세특례제한법 제95조의2',
    currentAmount: 85, maxAmount: 145,
    warning: '연봉 5,500만 원 이하라면 월세액 17% 공제 대상이에요.\n전입신고와 임대차계약서 주소를 확인해 주세요.',
    targetDesc: '무주택 세대주인 근로자가 국민주택규모 등 요건을 갖춘 주택에 낸 월세가 대상입니다.',
    targetItems: [
      { icon: '🏠', label: '월세 이체', sub: '은행 내역 확인' },
      { icon: '📄', label: '임대차계약서', sub: '주소 일치' },
      { icon: '✅', label: '전입신고', sub: '공제 요건' },
    ],
    conditions: ['총급여 8천만 원 이하 근로자 월세액 세액공제', '총급여 5,500만 원 이하 구간은 17% 적용', '연 1,000만 원 한도 내 월세액 공제'],
    steps: [{ label: '계약서 확인', desc: '주소·면적\n확인' }, { label: '월세 내역', desc: '은행 이체\n증빙' }, { label: '공제 신청', desc: '연말정산\n반영' }],
  },
  'housing-subscription': {
    category: '소득공제', categoryColor: 'badge-blue',
    emoji: '🏦', title: '주택청약종합저축 소득공제',
    subtitle: '총급여 7천만 원 이하 무주택 세대주라면\n납입액의 40%를 소득공제 받을 수 있어요.',
    tag: '#조세특례제한법 제87조',
    currentAmount: 48, maxAmount: 120,
    warning: '무주택확인서를 은행에 제출해야 공제가 적용돼요.\n12월 말 전에 등록 여부를 확인하세요.',
    targetDesc: '무주택 세대주 등이 주택청약종합저축에 납입한 금액이 대상입니다.',
    targetItems: [
      { icon: '🏦', label: '청약저축', sub: '연 300만원 한도' },
      { icon: '🏠', label: '무주택', sub: '세대주 요건' },
      { icon: '📌', label: '확인서', sub: '은행 제출' },
    ],
    conditions: ['총급여 7천만 원 이하 근로소득자', '해당 과세기간 중 무주택 세대주 등', '연 납입액 300만 원 한도, 40% 소득공제'],
    steps: [{ label: '은행 확인', desc: '청약통장\n보유' }, { label: '무주택확인서', desc: '은행 제출\n등록' }, { label: '소득공제', desc: '연말정산\n자동 반영' }],
  },
  'hometown-donation': {
    category: '기부금 공제', categoryColor: 'badge-purple',
    emoji: '🎁', title: '고향사랑기부제',
    subtitle: '10만 원을 기부하면 세액공제와 답례품까지\n약 13만 원어치 혜택을 받을 수 있어요.',
    tag: '#조세특례제한법 제58조',
    currentAmount: 10, maxAmount: 13,
    warning: '10만 원 이하 기부금은 전액에 가까운 세액공제가 적용돼요.\n답례품 포인트도 함께 챙기세요.',
    targetDesc: '원하는 지방자치단체에 기부하고 세액공제와 답례품 혜택을 받는 제도입니다.',
    targetItems: [
      { icon: '🎁', label: '답례품', sub: '3만원 상당' },
      { icon: '💸', label: '세액공제', sub: '10만원 구간' },
      { icon: '🏙️', label: '지자체 선택', sub: '주소지 제외' },
    ],
    conditions: ['10만 원 이하 기부 시 고향사랑 기부금 × 110분의 100 세액공제', '10만 원 초과분은 구간별 공제율 적용', '주소지 관할 지자체에는 기부 불가'],
    steps: [{ label: '지자체 선택', desc: '원하는 지역\n선택' }, { label: '10만원 기부', desc: '카드·계좌\n납부' }, { label: '답례품 신청', desc: '포인트\n사용' }],
  },
  'glasses-medical': {
    category: '의료비 공제', categoryColor: 'badge-blue',
    emoji: '👓', title: '시력보정용 안경/콘택트렌즈',
    subtitle: 'OO안경원 결제 15만 원을\n의료비 세액공제로 연결할 수 있어요.',
    tag: '#소득세법 시행령 제118조의5',
    currentAmount: 15, maxAmount: 50,
    warning: '간소화 서비스에 누락될 수 있어요.\n안경점 결제 영수증을 직접 등록해 주세요.',
    targetDesc: '시력보정용 안경 또는 콘택트렌즈 구입비는 1명당 연 50만원 한도 내 의료비에 포함됩니다.',
    targetItems: [
      { icon: '👓', label: '안경', sub: '시력보정용' },
      { icon: '💧', label: '콘택트렌즈', sub: '렌즈 구입비' },
      { icon: '🧾', label: '영수증', sub: '직접 등록' },
    ],
    conditions: ['소득세법 제59조의4 의료비 세액공제', '시력보정용 안경 또는 콘택트렌즈 1명당 연 50만원 한도', '미용 목적 선글라스 등은 제외'],
    steps: [{ label: '결제내역 확인', desc: '안경점\n15만원' }, { label: '영수증 등록', desc: '직접 첨부\n가능' }, { label: '의료비 반영', desc: '세액공제\n추가' }],
  },
  'student-loan': {
    category: '교육비 공제', categoryColor: 'badge-green',
    emoji: '🎓', title: '학자금 대출 원리금 상환액',
    subtitle: '취업 후 갚기 시작한 학자금 대출 상환액도\n교육비 세액공제 대상이에요.',
    tag: '#소득세법 제59조의4',
    currentAmount: 18, maxAmount: 120,
    warning: '상환 연체로 인한 추가 금액은 제외될 수 있어요.',
    targetDesc: '본인을 위해 지급한 대통령령으로 정하는 학자금 대출 원리금 상환액이 대상입니다.',
    targetItems: [
      { icon: '🎓', label: '학자금 대출', sub: '본인 상환' },
      { icon: '💳', label: '원리금', sub: '상환액 확인' },
      { icon: '📚', label: '교육비', sub: '15% 공제' },
    ],
    conditions: ['소득세법 제59조의4 제3항 교육비 세액공제', '본인 학자금 대출 원리금 상환액 15% 공제', '연체료 등 제외 항목 확인 필요'],
    steps: [{ label: '상환액 조회', desc: '대출기관\n확인' }, { label: '간소화 확인', desc: '누락 여부\n점검' }, { label: '공제 반영', desc: '교육비\n세액공제' }],
  },
  'pension-irp': {
    category: '연금 공제', categoryColor: 'badge-red',
    emoji: '📈', title: '연금저축/IRP 세액공제',
    subtitle: '공기업 취업 후 여유 자금으로\n13월의 월급을 미리 키울 수 있어요.',
    tag: '#소득세법 제59조의3',
    currentAmount: 36, maxAmount: 148,
    warning: '총급여 5,500만 원 이하라면 연금계좌 납입액 15% 공제 구간이에요.',
    targetDesc: '연금저축계좌와 퇴직연금계좌 납입액은 한도 내에서 세액공제됩니다.',
    targetItems: [
      { icon: '📈', label: '연금저축', sub: '연 600만원' },
      { icon: '💼', label: 'IRP', sub: '합산 900만원' },
      { icon: '💰', label: '세액공제', sub: '12~15%' },
    ],
    conditions: ['소득세법 제59조의3 연금계좌세액공제', '연금저축 600만원, 연금저축+퇴직연금 합산 900만원 한도', '총급여 5,500만원 이하 근로자는 15% 공제 구간'],
    steps: [{ label: '여유자금 확인', desc: '월 납입액\n설정' }, { label: '계좌 개설', desc: '연금저축\n또는 IRP' }, { label: '세액공제', desc: '연말정산\n반영' }],
  },
}

export const kimgodsaengPolicyList = [
  { id: 'tomorrow-card', emoji: '💳', title: '국민내일배움카드제 직업훈련비지원', tag: '취업·역량', tagColor: 'badge-purple', deadline: '상시', org: '고용노동부', desc: '직무 역량 향상을 위한 훈련비와 훈련장려금을 지원합니다.' },
  { id: 'youth-rent-support', emoji: '🏠', title: '청년월세 지원사업', tag: '주거', tagColor: 'badge-orange', deadline: '신청중', org: '국토교통부', desc: '월세로 자취하는 청년의 주거비 부담을 줄여주는 지원사업입니다.' },
  { id: 'youth-dream-account', emoji: '🏦', title: '청년주택드림청약통장', tag: '자산형성', tagColor: 'badge-blue', deadline: '상시', org: '국토교통부', desc: '청년층 주거 마련을 위한 고금리 청약통장 전환·가입 정보를 확인합니다.' },
  { id: 'youth-leap-account', emoji: '📈', title: '청년도약계좌', tag: '자산형성', tagColor: 'badge-green', deadline: '월별 신청', org: '서민금융진흥원', desc: '총급여 7,500만 원 이하 청년의 장기 자산형성을 지원합니다.' },
]

export const kimgodsaengPolicyDetails: PolicyDetail[] = [
  {
    id: 'tomorrow-card', category: '취업·역량', badgeColor: 'badge-purple', icon: '💳', title: '국민내일배움카드제 직업훈련비지원',
    subtitle: '공기업 신입 사원도 직무 역량을 키울 때 활용할 수 있는 훈련 지원이에요',
    period: '상시 신청', dday: '상시', target: '직업능력개발훈련이 필요한 청년·재직자 등',
    amountText: '훈련과정별 훈련비 및 일부 훈련장려금 지원', amountHighlight: '훈련비 차등 지원',
    organization: '고용노동부', detailLinks: ['재직자 수강 가능 과정 확인하기', '훈련비 자부담률 확인하기', '디지털·회계 과정 추천 보기', '훈련장려금 조건 확인하기'],
    steps: ['카드 발급', '훈련 과정 선택', '수강 신청', '훈련비 지원'], documents: ['본인 인증', '재직 정보', '훈련과정 신청서', '계좌 정보'],
    applyUrlLabel: '고용24 바로가기',
  },
  {
    id: 'youth-rent-support', category: '주거', badgeColor: 'badge-orange', icon: '🏠', title: '청년월세 지원사업',
    subtitle: '서울에서 월세로 자취하는 사회초년생이 확인할 만한 주거비 지원이에요',
    period: '2025. 02. 01(토) ~ 예산 소진 시', dday: '신청중', target: '월세 거주 청년 중 소득·재산 및 주거 요건을 충족하는 사람',
    amountText: '월세 일부를 일정 기간 지원', amountHighlight: '월 최대 20만원',
    organization: '국토교통부', detailLinks: ['청년 월세 지원 대상 확인하기', '보증금·월세 기준 확인하기', '서울 거주 요건 확인하기', '필요 서류 미리 준비하기'],
    steps: ['요건 확인', '임대차 서류 준비', '온라인 신청', '지급 심사'], documents: ['임대차계약서', '월세 이체내역', '주민등록등본', '소득·재산 확인자료'],
    applyUrlLabel: '복지로 바로가기',
  },
  {
    id: 'youth-dream-account', category: '자산형성', badgeColor: 'badge-blue', icon: '🏦', title: '청년주택드림청약통장',
    subtitle: '연소득 5천만 원 이하 청년이 주거 마련을 준비할 때 확인할 통장이에요',
    period: '상시 가입', dday: '상시', target: '연소득 5천만 원 이하 무주택 청년 등',
    amountText: '일반 청약보다 높은 금리와 청약 연계 혜택', amountHighlight: '전환 가입 가능',
    organization: '국토교통부', detailLinks: ['전환 가입 가능 여부 확인하기', '무주택 요건 확인하기', '월 납입액 추천 받기', '청약 소득공제와 함께 보기'],
    steps: ['요건 확인', '은행 방문/앱 신청', '통장 전환', '월 납입 설정'], documents: ['신분증', '소득 확인자료', '무주택 확인자료', '기존 청약통장 정보'],
    applyUrlLabel: '온통청년 바로가기',
  },
  {
    id: 'youth-leap-account', category: '자산형성', badgeColor: 'badge-green', icon: '📈', title: '청년도약계좌',
    subtitle: '사회초년생의 장기 목돈 마련을 돕는 비과세 자산형성 계좌예요',
    period: '월별 신청', dday: '신청월 확인', target: '총급여 7,500만 원 이하 등 소득 요건을 충족하는 청년',
    amountText: '월 납입금에 정부기여금과 비과세 혜택 제공', amountHighlight: '비과세 혜택',
    organization: '서민금융진흥원', detailLinks: ['총급여 요건 확인하기', '정부기여금 예상액 보기', '은행별 금리 비교하기', '월 납입 가능액 설정하기'],
    steps: ['가입 요건 확인', '은행 앱 신청', '소득 심사', '계좌 개설'], documents: ['본인 인증', '소득 확인자료', '은행 계좌', '청년 연령 확인'],
    applyUrlLabel: '청년도약계좌 바로가기',
  },
]

export const kimgodsaengNotices = {
  benefit: [
    { emoji: '💡', bg: '#FEF3C7', title: '이번 달 신용카드 지출액이 기준치를 넘었어요!', desc: '내일부터는 체크카드를 써야 연말정산 때 돈을 더 받을 가능성이 커져요.', sub: '카드 사용 비율 자동 분석', cta: '소비 전략 보기', date: '방금 전' },
    { emoji: '👓', bg: '#DBEAFE', title: '김갓생님, 안경점에서 결제한 15만 원이 있어요.', desc: '연말정산에 반영할까요? 터치하여 1분 만에 영수증을 등록하세요.', sub: 'OO안경원 결제 내역 발견', cta: '영수증 등록', date: '오늘' },
  ],
  status: [
    { emoji: '✅', desc: '고향사랑기부제 10만 원 납부가 완료되어, 연말정산 100% 세액공제 항목에 자동 추가되었습니다.', date: '2025.11.18', status: '반영완료', statusColor: 'badge-green' },
    { emoji: '📝', desc: '집주인 눈치 볼 필요 없어요! 월세 현금영수증 발급 신청이 국세청에 정상 접수되었습니다.', date: '2025.12.02', status: '접수완료', statusColor: 'badge-blue' },
  ],
  general: [
    { emoji: '📊', text: '국세청 연말정산 미리보기에서 예상 환급액 145만 원을 확인했어요.', date: '오늘' },
    { emoji: '🏦', text: '청약저축 소득공제를 받으려면 무주택확인서 제출 여부를 확인하세요.', date: '2일 전' },
  ],
}

export const kimgodsaengAiBenefits: AiBenefit[] = [
  {
    id: 'rent-tax-ai',
    type: 'tax',
    icon: '🏠',
    iconBg: '#FEF3C7',
    title: '월세액 세액공제',
    subtitle: '월세 이체 내역 기반 분석',
    statusLabel: '가능성 높음',
    statusColor: '#16A34A',
    amount: 240000,
    amountLabel: '예상 절세 금액',
    aiReason: '매월 고정 월세 이체 내역이 확인됐어요. 전입신고와 임대차계약서 주소 일치 여부를 확인해 주세요.',
    conditions: ['무주택 세대주인가요?', '전입신고가 되어 있나요?', '임대차계약서 주소와 실거주지가 일치하나요?'],
  },
  {
    id: 'youth-rent-ai',
    type: 'policy',
    icon: '🏢',
    iconBg: '#DBEAFE',
    title: '청년월세지원',
    subtitle: '청년 주거비 부담 완화 사업',
    statusLabel: '신청 가능',
    statusColor: '#2563EB',
    amount: 240000,
    amountLabel: '최대 지원 금액',
    aiReason: '26세 1인 가구 월세 거주 조건으로 청년월세지원 신청 대상입니다. 국토교통부 사업 기준으로 분석했어요.',
    conditions: ['만 19~34세인가요?', '무주택 청년 1인 가구인가요?', '월세 60만원 이하인가요?'],
  },
  {
    id: 'glasses-ai',
    type: 'hidden',
    icon: '👓',
    iconBg: '#EDE9FE',
    title: 'OO안경원 150,000원',
    subtitle: '의료비 세액공제 후보',
    statusLabel: '누락 가능성',
    statusColor: '#D97706',
    amount: 150000,
    amountLabel: '공제 가능 금액',
    aiReason: 'OO안경원에서 150,000원이 결제된 내역이 있어요. 시력교정용 안경/렌즈 구입비일 가능성이 있습니다.',
    conditions: ['시력교정용 안경/렌즈인가요?', '영수증이 있나요?', '본인 또는 부양가족 지출인가요?'],
  },
  {
    id: 'monthly-transfer-ai',
    type: 'hidden',
    icon: '🏦',
    iconBg: '#D1FAE5',
    title: '매월 700,000원 이체',
    subtitle: '월세 공제 후보',
    statusLabel: '추가 공제 가능',
    statusColor: '#16A34A',
    amount: 700000,
    amountLabel: '공제 가능 금액',
    aiReason: '매월 고정 이체 내역이 확인됐어요. 월세 공제 신청 시 추가 환급액이 늘 수 있어요.',
    conditions: ['임대인 계좌로의 월세 이체인가요?', '임대차계약서가 있나요?', '전입신고가 완료되었나요?'],
  },
]
