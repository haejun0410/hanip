import type { PolicyDetail } from '../pages/Policy/policyData'
import type { AiBenefit } from '../types/aiBenefit'

export const HANBEOTEAM_NAME = '한버팀'

export const hanbeoteamHome = {
  totalBenefit: '315',
  amountLabel: '총 받을 수 있는 혜택',
  headline: '놓칠 뻔한 혜택이<br/><span style="color:#3B6FE8">총 315만 원</span>이에요!',
  summary: '절세(혜택) 추천 항목 3개',
  benefits: [
    { title: '근로장려금 및 자녀장려금', amount: '최대 300만 원', route: '/recommend/eitc-child' },
    { title: '한부모 소득공제', amount: '100만 원 추가 공제', route: '/recommend/single-parent' },
    { title: '취학 전 아동 학원비 세액공제', amount: '결제액의 15% 공제', route: '/recommend/preschool-tuition' },
  ],
  knowledge: {
    title: '안경 및 렌즈<br />의료비 공제 가능해요',
    desc: '시력교정용 안경과 렌즈 구입비도 공제 대상이에요.',
    route: '/recommend/glasses',
  },
}

export const hanbeoteamCalendarEvents = {
  '2025-05-01': [
    { id: 'hb1', type: 'tax' as const, badge: '세금', badgeColor: 'badge-orange', emoji: '💰', title: '근로·자녀장려금 정기 신청 시작', period: '5월 정기 신청', route: '/recommend/eitc-child' },
  ],
  '2025-05-14': [
    { id: 'hb2', type: 'tax' as const, badge: '세금', badgeColor: 'badge-orange', emoji: '💰', title: '근로·자녀장려금 신청 마감 D-3', period: '마감 D-3', route: '/recommend/eitc-child' },
    { id: 'hb3', type: 'policy' as const, badge: '복지', badgeColor: 'badge-green', emoji: '👩‍👧', title: '한부모가족 아동양육비 입금 확인', period: '21만 원 입금', route: '/policy/2' },
  ],
  '2025-05-20': [
    { id: 'hb4', type: 'policy' as const, badge: '복지', badgeColor: 'badge-green', emoji: '🎨', title: '문화누리카드 신청 기간', period: '이번 달 신청 가능', route: '/policy/3' },
  ],
  '2025-05-31': [
    { id: 'hb5', type: 'tax' as const, badge: '세금', badgeColor: 'badge-orange', emoji: '🚨', title: '근로·자녀장려금 정기 신청 마감', period: '오늘 마감!', route: '/recommend/eitc-child' },
    { id: 'hb6', type: 'policy' as const, badge: '복지', badgeColor: 'badge-green', emoji: '👩‍👧', title: '한부모가족 신청 요건 갱신일', period: '서류 확인', route: '/policy/2' },
  ],
}

export const hanbeoteamRecommendations = [
  { id: 'eitc-child', emoji: '💰', label: '근로·자녀장려금', amount: '최대 300만원', tag: '#마이데이터 예상액', iconBg: '#FEF3C7' },
  { id: 'single-parent', emoji: '👩‍👧', label: '한부모 소득공제', amount: '100만원', tag: '#추가공제', iconBg: '#DBEAFE' },
  { id: 'dependent-parent', emoji: '👵', label: '따로 사는 부모님 인적공제', amount: '1인 150만원', tag: '#자주 놓치는 항목', iconBg: '#EDE9FE' },
  { id: 'preschool-tuition', emoji: '🥋', label: '취학 전 아동 학원비', amount: '15% 공제', tag: '#교육비 세액공제', iconBg: '#D1FAE5' },
  { id: 'donation', emoji: '🤝', label: '기부금 세액공제', amount: '15~30%', tag: '#기부금 공제', iconBg: '#FCE7F3' },
  { id: 'sme-tax-reduction', emoji: '🏢', label: '중소기업 취업자 감면', amount: '최대 200만원', tag: '#경력단절여성', iconBg: '#FEE2E2' },
]

export const hanbeoteamRecommendationDetails = {
  'eitc-child': {
    category: '장려금', categoryColor: 'badge-orange',
    emoji: '💰', title: '근로장려금 및 자녀장려금',
    subtitle: '연소득 약 2,600만 원, 한부모 가구 조건을 바탕으로\n예상 수령액을 자동 계산했어요.',
    tag: '#조세특례제한법 제100조의2·제100조의27',
    currentAmount: 240, maxAmount: 300,
    warning: '5월 정기 신청 마감이 가까워요.\n홈택스 소득 자료와 가족관계 정보를 확인해 주세요.',
    targetDesc: '저소득 근로 가구와 자녀 양육 가구의 소득을 지원하는 장려금입니다.',
    targetItems: [
      { icon: '💼', label: '중소기업 사무직', sub: '근로소득 확인' },
      { icon: '👧', label: '자녀 1명', sub: '자녀장려금 대상' },
      { icon: '🏦', label: '마이데이터', sub: '예상액 자동계산' },
    ],
    conditions: ['조세특례제한법 제100조의2 근로장려세제 지급 근거', '조세특례제한법 제100조의27 자녀장려세제 지급 근거', '연소득, 재산, 부양자녀 요건 확인 필요'],
    steps: [{ label: '소득 확인', desc: '홈택스 자료\n자동 확인' }, { label: '신청서 제출', desc: '정기 신청\n진행' }, { label: '심사·지급', desc: '예상 수령액\n확정' }],
  },
  'single-parent': {
    category: '소득공제', categoryColor: 'badge-blue',
    emoji: '👩‍👧', title: '한부모 소득공제',
    subtitle: '부녀자 공제보다 유리한 한부모 공제를\n자동으로 추천했어요.',
    tag: '#소득세법 제51조',
    currentAmount: 100, maxAmount: 100,
    warning: '부녀자 공제와 중복될 때는 한부모 공제가 우선 적용돼요.',
    targetDesc: '배우자가 없고 기본공제대상자인 직계비속이 있는 거주자가 대상입니다.',
    targetItems: [{ icon: '👩‍👧', label: '한부모 가정', sub: '자녀 1명' }, { icon: '📄', label: '가족관계', sub: '자동 확인' }, { icon: '💸', label: '추가공제', sub: '연 100만원' }],
    conditions: ['소득세법 제51조 제1항 제3호에 따른 연 100만원 추가공제', '부녀자 공제 50만원과 중복 시 한부모 공제 우선', '기본공제대상 자녀 요건 확인 필요'],
    steps: [{ label: '가족 확인', desc: '정부24\n자료 확인' }, { label: '유리한 공제', desc: '한부모 공제\n자동 선택' }, { label: '연말정산', desc: '추가공제\n반영' }],
  },
  'dependent-parent': {
    category: '인적공제', categoryColor: 'badge-purple',
    emoji: '👵', title: '따로 사는 부모님 인적공제',
    subtitle: '주소가 달라도 생활비를 보내드리고 있다면\n부양가족 공제 가능성을 확인할 수 있어요.',
    tag: '#소득세법 제50조·시행령 제106조',
    currentAmount: 150, maxAmount: 300,
    warning: '부모님께 매달 이체한 내역이 있어요.\n소득요건과 나이요건을 확인해 보세요.',
    targetDesc: '주거 형편상 별거 중인 부모님을 실제 부양한다면 1인당 150만원 기본공제 가능성이 있습니다.',
    targetItems: [{ icon: '🏠', label: '별거 부모님', sub: '주거형편상 별거' }, { icon: '💳', label: '생활비 송금', sub: '은행 이체 확인' }, { icon: '📌', label: '나이·소득', sub: '만 60세 이상 등' }],
    conditions: ['소득세법 제50조 기본공제 대상 여부 확인', '시행령 제106조 주거형편상 별거 인정', '연간 소득금액 100만원 이하 등 소득요건 확인'],
    steps: [{ label: '이체내역', desc: '주거래은행\n확인' }, { label: '부모님 요건', desc: '나이·소득\n확인' }, { label: '공제 반영', desc: '인적공제\n추가' }],
  },
  'preschool-tuition': {
    category: '교육비 공제', categoryColor: 'badge-green',
    emoji: '🥋', title: '취학 전 아동 학원비/체육시설 수강료',
    subtitle: '태권도장, 미술학원 등 아이 교육비도\n세액공제로 돌려받을 수 있어요.',
    tag: '#소득세법 제59조의4',
    currentAmount: 45, maxAmount: 300,
    warning: '카드 내역에 잡히지 않은 특별활동비나 현장체험학습비가 있으면 추가 공제가 가능해요.',
    targetDesc: '초등학교 입학 전 아동을 위해 학원 및 체육시설에 지급한 교육비가 대상입니다.',
    targetItems: [{ icon: '🥋', label: '체육시설', sub: '태권도장 등' }, { icon: '🎨', label: '학원비', sub: '미술·음악 등' }, { icon: '🧾', label: '계좌이체', sub: '증빙 추가' }],
    conditions: ['소득세법 제59조의4 제3항 제1호 가목', '연 300만원 한도 내 15% 세액공제', '취학 전 아동 교육비에 해당해야 함'],
    steps: [{ label: '영수증 준비', desc: '학원·체육시설\n증빙' }, { label: '누락 확인', desc: '계좌이체\n추가' }, { label: '공제 신청', desc: '교육비\n세액공제' }],
  },
  donation: {
    category: '기부금 공제', categoryColor: 'badge-purple',
    emoji: '🤝', title: '기부금 세액공제',
    subtitle: '종교단체, 자선단체 기부금도\n세액공제 대상인지 확인해요.',
    tag: '#소득세법 제34조·제59조의4',
    currentAmount: 12, maxAmount: 80,
    warning: '기부금 영수증이 누락되면 공제를 못 받을 수 있어요.',
    targetDesc: '법정·지정기부금 지출액의 15%, 고액기부 시 최대 30%까지 세액공제될 수 있습니다.',
    targetItems: [{ icon: '⛪', label: '종교단체', sub: '기부금 영수증' }, { icon: '🏥', label: '복지법인', sub: '지정기부금' }, { icon: '🧾', label: '증빙자료', sub: '간소화 확인' }],
    conditions: ['소득세법 제59조의4 제4항', '소득세법 제34조 기부금의 소득공제 등', '기부처 유형별 공제 한도 확인 필요'],
    steps: [{ label: '기부처 확인', desc: '법정·지정\n구분' }, { label: '영수증 조회', desc: '간소화\n확인' }, { label: '공제 반영', desc: '세액공제\n적용' }],
  },
  'sme-tax-reduction': {
    category: '소득세 감면', categoryColor: 'badge-red',
    emoji: '🏢', title: '중소기업 취업자 소득세 감면',
    subtitle: '중소기업 재취업 요건에 해당하면\n근로소득세 감면을 받을 수 있어요.',
    tag: '#조세특례제한법 제30조',
    currentAmount: 70, maxAmount: 200,
    warning: '경력단절여성 재취업 요건 충족 여부를 회사 서류와 함께 확인해 보세요.',
    targetDesc: '경력단절여성이 중소기업에 재취업한 경우 3년간 소득세 70% 감면 가능성이 있습니다.',
    targetItems: [{ icon: '🏢', label: '중소기업', sub: '재직 확인' }, { icon: '👩', label: '경력단절', sub: '요건 검토' }, { icon: '💸', label: '감면한도', sub: '연 200만원' }],
    conditions: ['조세특례제한법 제30조 중소기업 취업자 소득세 감면', '경력단절여성은 3년간 70% 감면 가능', '회사 확인서와 취업일 요건 확인 필요'],
    steps: [{ label: '회사 확인', desc: '중소기업\n여부' }, { label: '요건 검토', desc: '경력단절\n증빙' }, { label: '감면 신청', desc: '원천징수\n반영' }],
  },
}

export const hanbeoteamPolicyList = [
  { id: 'care', emoji: '👶', title: '아이돌봄서비스', tag: '생활·복지', tagColor: 'badge-green', deadline: '상시', org: '여성가족부', desc: '맞벌이·한부모 가정의 돌봄 공백을 아이돌보미가 방문해 지원합니다.' },
  { id: 'single-parent-childcare', emoji: '👩‍👧', title: '한부모가족 아동양육비 지원', tag: '생활·복지', tagColor: 'badge-green', deadline: '매월 신청 가능', org: '여성가족부', desc: '저소득 한부모가족의 아동양육비를 월 단위로 지원합니다.' },
  { id: 'culture-card', emoji: '🎨', title: '통합문화이용권 문화누리카드', tag: '문화', tagColor: 'badge-purple', deadline: '2025.11.30', org: '문화체육관광부', desc: '문화예술·여행·체육 활동에 사용할 수 있는 바우처를 지원합니다.' },
  { id: 'bucheon-family', emoji: '🏠', title: '부천시 한부모 가구 생활안심 지원', tag: '지역', tagColor: 'badge-orange', deadline: '상시 확인', org: '부천시', desc: '지역 생활안심 서비스와 복지 신청 정보를 함께 확인합니다.' },
]

export const hanbeoteamPolicyDetails: PolicyDetail[] = [
  {
    id: 'care', category: '생활·복지', badgeColor: 'badge-green', icon: '👶', title: '아이돌봄서비스',
    subtitle: '한부모·맞벌이 가정의 돌봄 공백을 방문 돌봄으로 채워주는 서비스예요',
    period: '상시 신청', dday: '상시', target: '만 12세 이하 아동을 양육하며 돌봄 공백이 있는 한부모 가정',
    amountText: '소득 유형에 따라 시간제·종일제 돌봄 비용 차등 지원', amountHighlight: '정부지원 비율 자동 산정',
    organization: '여성가족부', detailLinks: ['한부모 가정 지원 유형 확인하기', '아이 연령별 이용 가능 시간 확인하기', '본인부담금 예상액 확인하기', '우리 동네 서비스 제공기관 확인하기'],
    steps: ['정부지원 판정', '국민행복카드 준비', '서비스 신청', '아이돌보미 연계'], documents: ['가족관계증명서', '한부모가족 증명서', '소득 확인 자료', '돌봄 공백 증빙'],
    applyUrlLabel: '아이돌봄서비스 바로가기',
  },
  {
    id: 'single-parent-childcare', category: '생활·복지', badgeColor: 'badge-green', icon: '👩‍👧', title: '한부모가족 아동양육비 지원',
    subtitle: '저소득 한부모가족의 자녀 양육비를 매월 지원하는 제도예요',
    period: '매월 신청 가능', dday: '상시', target: '소득인정액 기준을 충족하는 만 18세 미만 자녀 양육 한부모가족',
    amountText: '아동 1인당 월 21만 원 등 가구 조건별 지원', amountHighlight: '월 21만원 입금 확인',
    organization: '여성가족부', detailLinks: ['소득인정액 기준 확인하기', '아동 연령별 지원액 확인하기', '신청 서류 누락 확인하기', '입금일 알림 설정하기'],
    steps: ['자격 확인', '주민센터 신청', '소득 심사', '매월 지급'], documents: ['사회보장급여 신청서', '가족관계증명서', '소득·재산 신고서', '통장 사본'],
    applyUrlLabel: '복지로 바로가기',
  },
  {
    id: 'culture-card', category: '문화', badgeColor: 'badge-purple', icon: '🎨', title: '통합문화이용권 문화누리카드',
    subtitle: '아이와 함께 문화생활에 사용할 수 있는 문화누리카드 지원이에요',
    period: '2025. 02. 01(토) ~ 2025. 11. 30(일)', dday: '신청중', target: '기초생활수급자 및 차상위계층 등 문화누리카드 지원 대상자',
    amountText: '문화예술·여행·체육 활동 이용권 지원', amountHighlight: '연 13만원',
    organization: '문화체육관광부', detailLinks: ['카드 발급 대상 확인하기', '부천시 사용처 확인하기', '아이와 쓸 수 있는 가맹점 보기', '잔액 및 충전일 확인하기'],
    steps: ['대상 확인', '카드 발급', '가맹점 이용', '잔액 확인'], documents: ['신분증', '대상자 증빙', '휴대폰 본인인증', '카드 수령 정보'],
    applyUrlLabel: '문화누리카드 바로가기',
  },
  {
    id: 'bucheon-family', category: '지역', badgeColor: 'badge-orange', icon: '🏠', title: '부천시 한부모 가구 생활안심 지원',
    subtitle: '부천 거주 한부모 가구가 확인할 만한 지역 생활안심 지원 정보예요',
    period: '상시 확인', dday: '확인', target: '경기 부천시에 거주하는 한부모 또는 여성 1인 가구 등 지역 지원 대상',
    amountText: '지역 공고별 지원 물품과 서비스가 달라요', amountHighlight: '부천시 공고 확인 필요',
    organization: '부천시', detailLinks: ['부천시 공고 확인하기', '경기민원24 지원사업 보기', '한부모 가구 우선 대상 여부 확인하기', '신청 가능 기간 알림 받기'],
    steps: ['공고 확인', '대상 여부 확인', '온라인 신청', '지원 수령'], documents: ['주민등록등본', '한부모가족 증명서', '신분증', '신청서'],
    applyUrlLabel: '부천시 바로가기',
  },
]

export const hanbeoteamNotices = {
  benefit: [
    { emoji: '💡', bg: '#FEF3C7', title: '한버팀님! 부모님께 매달 이체하신 내역이 있어요.', desc: "'부양가족 인적공제' 대상이 되는지 1분 만에 확인해 볼까요?", sub: '주거래은행 이체 내역 기반 추천', cta: '확인하기', date: '방금 전' },
    { emoji: '🎨', bg: '#DBEAFE', title: '이번 달 문화누리카드 지원금 신청이 시작되었어요.', desc: '아이와 함께 공연, 전시, 체육 활동에 사용할 수 있어요!', sub: '통합문화이용권 신청 가능', cta: '신청 보기', date: '1일 전' },
  ],
  status: [
    { emoji: '✅', desc: '한부모가족 아동양육비 21만 원이 계좌로 정상 입금되었습니다.', date: '2025.05.20', status: '입금완료', statusColor: 'badge-green' },
    { emoji: '🚨', desc: '근로장려금 신청 마감이 딱 3일 남았어요! 터치 한 번으로 쉽게 신청하세요.', date: '2025.05.28', status: '마감임박', statusColor: 'badge-orange' },
  ],
  general: [
    { emoji: '🤖', text: 'AI가 어린이집 특별활동비 이체 내역을 추가 공제 후보로 찾았어요.', date: '오늘' },
    { emoji: '📄', text: '정부24 가족관계 정보 스크래핑이 완료되었습니다.', date: '1일 전' },
  ],
}

export const hanbeoteamAiBenefits: AiBenefit[] = [
  {
    id: 'eitc-ai',
    type: 'tax',
    icon: '💰',
    iconBg: '#FEF3C7',
    title: '근로·자녀장려금',
    subtitle: '소득·가족요건 충족 가능성 높음',
    statusLabel: '가능성 높음',
    statusColor: '#16A34A',
    amount: 2400000,
    amountLabel: '예상 수령 금액',
    aiReason: '연소득 2,600만원, 자녀 1명 한부모 가구 조건을 분석했어요. 5월 정기 신청 기간 내 신청이 가능합니다.',
    conditions: ['연소득 2,600만원 이하인가요?', '부양자녀가 있는 가구인가요?', '재산 합계 2억원 미만인가요?'],
  },
  {
    id: 'single-parent-ai',
    type: 'tax',
    icon: '👩‍👧',
    iconBg: '#DBEAFE',
    title: '한부모 소득공제',
    subtitle: '부녀자 공제 대신 한부모 공제 적용 가능',
    statusLabel: '적용 가능',
    statusColor: '#2563EB',
    amount: 1000000,
    amountLabel: '추가 공제 금액',
    aiReason: '가족관계 데이터에서 한부모 가정 조건이 확인됐어요. 부녀자 공제보다 한부모 공제가 유리합니다.',
    conditions: ['배우자가 없는 세대주인가요?', '기본공제 대상 자녀가 있나요?', '연말정산 시 적용 여부를 확인하셨나요?'],
  },
  {
    id: 'care-ai',
    type: 'policy',
    icon: '👶',
    iconBg: '#D1FAE5',
    title: '아이돌봄서비스',
    subtitle: '한부모 가정 우선 지원 대상',
    statusLabel: '신청 가능',
    statusColor: '#16A34A',
    amount: 0,
    amountLabel: '소득 유형별 차등 지원',
    aiReason: '한부모 가정 조건으로 아이돌봄서비스 우선 신청 대상입니다. 정부지원 비율이 자동 산정돼요.',
    conditions: ['만 12세 이하 자녀가 있나요?', '한부모가족 증명서를 발급받으셨나요?', '국민행복카드를 보유하고 있나요?'],
  },
  {
    id: 'activity-ai',
    type: 'hidden',
    icon: '🎨',
    iconBg: '#EDE9FE',
    title: '어린이집 특별활동비 결제',
    subtitle: '교육비 세액공제 후보',
    statusLabel: '누락 가능성',
    statusColor: '#D97706',
    amount: 300000,
    amountLabel: '공제 가능 금액',
    aiReason: '카드 내역에서 어린이집 특별활동비 결제가 감지됐어요. 연말정산 간소화에 반영되지 않는 경우가 있습니다.',
    conditions: ['취학 전 아동 교육비인가요?', '영수증이 있나요?', '간소화 서비스에서 확인되지 않았나요?'],
  },
]
