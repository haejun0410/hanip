import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { type CoachId, useChatbotCoach } from '../../context/ChatbotCoachContext'
import { HANBEOTEAM_NAME } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME } from '../../data/kimgodsaeng'

const quickReplies = [
  '지금 신청 가능한 혜택이 있어?',
  '내가 받을 수 있는 정책을 알려줘',
  '종합소득세 신고 기간이 언제야?',
  '소득공제와 세액공제 차이가 뭐야?',
  '교육비 공제는 어떻게 받아?',
]

type AnswerData = { answer: string; sources: string[] }
type ByCoach = Record<CoachId, AnswerData>

// ── 키워드 매칭 답변 (ragAnswers) ───────────────────────────
const ragAnswers: Record<string, ByCoach> = {
  '한부모 소득공제랑 부녀자 소득공제 둘 다 받을 수 있어?': {
    easy: {
      answer: '두 공제는 동시에 받을 수 없어요.\n\n한버팀님은 한부모 공제 100만 원을 받으시면 돼요. 부녀자 공제 50만 원보다 더 많이 돌아와요.',
      sources: [],
    },
    summary: {
      answer: '한부모 공제와 부녀자 공제는 중복 적용 불가예요.\n\n• 한부모 공제: 100만 원 → 추천\n• 부녀자 공제: 50만 원\n\n둘 중 하나만 선택되고, 한버팀님은 한부모 공제가 유리해요.',
      sources: [],
    },
    strategy: {
      answer: '자료 3건을 먼저 확인했어요.\n\n결론부터 말하면 둘 다 동시에 받을 수는 없어요.\n한버팀님은 자녀 1명을 부양하는 한부모 가정이라 부녀자 공제 50만 원보다 한부모 공제 100만 원이 더 유리해요.\n그래서 앱에서는 한부모 공제를 우선 추천해요.',
      sources: ['소득세법 제51조 제1항 제3호', '소득세법 제51조 제2항', '정부24 가족관계 스크래핑 결과'],
    },
  },
  '친정 엄마가 아이를 봐주시는데, 따로 살아도 인적공제 받을 수 있어?': {
    easy: {
      answer: '주소가 달라도 받을 수 있어요!\n\n조건이 두 가지예요.\n1. 엄마가 만 60세 이상\n2. 연소득이 100만 원 이하\n\n두 가지가 맞으면 1인당 150만 원 공제가 돼요.',
      sources: [],
    },
    summary: {
      answer: '별거해도 부양가족 공제 가능해요.\n\n조건:\n• 만 60세 이상\n• 연간 소득 100만 원 이하\n• 실질적으로 생활비 부양 확인\n\n충족 시 기본공제 150만 원 적용돼요.',
      sources: [],
    },
    strategy: {
      answer: '은행 이체내역과 인적공제 규정을 함께 대조했어요.\n\n가능성이 있어요. 주소가 달라도 주거 형편상 따로 살고, 실제로 생활비를 보태드리는 경우에는 부양가족 공제를 검토할 수 있어요.\n다만 어머님이 만 60세 이상이고 연간 소득금액 100만 원 이하인지 확인해야 해요.\n조건을 충족하면 1인당 150만 원 기본공제 후보가 됩니다.',
      sources: ['소득세법 제50조', '소득세법 시행령 제106조', '주거래은행 정기 이체내역'],
    },
  },
  '근로장려금 신청 대상인지 조건을 3줄로 요약해 줘.': {
    easy: {
      answer: '근로장려금은 일하는데 소득이 많지 않은 분께 드리는 돈이에요.\n\n한버팀님은 한부모 가정이라 조건이 잘 맞아요. 5월 31일까지 신청하면 돼요!',
      sources: [],
    },
    summary: {
      answer: '신청 대상이에요. 핵심 3가지예요.\n\n1. 근로소득 기준으로 장려금 검토 대상\n2. 한부모 + 자녀 1명 → 자녀장려금도 함께 신청 가능\n3. 마감: 5월 31일 (홈택스 정기신청)',
      sources: [],
    },
    strategy: {
      answer: '홈택스 소득자료와 가족관계 정보를 기준으로 요약했어요.\n\n1. 한버팀님은 연소득 약 2,600만 원의 근로소득자로 장려금 검토 대상이에요.\n2. 한부모 가정과 자녀 1명 정보가 확인되어 자녀장려금도 함께 검토돼요.\n3. 최종 대상 여부는 가구원 재산 합계와 5월 정기신청 서류 확인 후 확정됩니다.',
      sources: ['조세특례제한법 제100조의2', '조세특례제한법 제100조의27', '홈택스 근로소득 스크래핑 결과'],
    },
  },
  '연말정산이 13월의 월급이라던데 나 세금 토해낼 수도 있어?': {
    easy: {
      answer: '네, 가능해요.\n\n회사가 세금을 매달 조금씩 미리 떼두는데, 1년치를 비교해서 더 냈으면 돌려받고 덜 냈으면 더 내요.\n\n김갓생님은 예상 환급액이 145만 원이에요!',
      sources: [],
    },
    summary: {
      answer: '세금 추가 납부 가능성 있어요.\n\n원리: 월급 세금 합계 vs 실제 납부세액 차이 정산.\n현재 예상: 환급 145만 원.\n월세·청약·카드 공제 챙기면 더 늘어요.',
      sources: [],
    },
    strategy: {
      answer: '국세청 급여자료와 카드 사용 흐름을 먼저 봤어요.\n\n네, 토해낼 수도 있어요. 회사가 매달 월급에서 세금을 대략 떼어가는데, 연말정산 때 실제 공제보다 덜 냈다고 계산되면 추가 납부가 생겨요.\n반대로 월세, 청약저축, 기부금, 안경 구입비 같은 공제를 잘 챙기면 이미 낸 세금 일부를 돌려받을 수 있어요.\n김갓생님은 현재 기준 예상 환급액이 145만 원으로 잡혀 있어요.',
      sources: ['국세청 연말정산 미리보기 자료', '소득세법 특별세액공제 항목', '마이데이터 급여·카드 사용내역'],
    },
  },
  '체크카드 쓰면 돈 돌려준다던데 신용카드는 아예 쓰면 안 돼?': {
    easy: {
      answer: '신용카드 써도 괜찮아요!\n\n다만 월급의 25%보다 더 쓴 뒤로는 체크카드가 공제를 더 많이 해줘요.\n\n김갓생님은 이미 그 기준을 넘어서, 지금부터는 체크카드를 쓰는 게 유리해요.',
      sources: [],
    },
    summary: {
      answer: '신용카드도 공제되지만, 기준 초과 후엔 체크카드가 유리해요.\n\n• 총급여 25% 이내: 신용이든 체크든 무관\n• 25% 초과분: 체크카드 공제율이 2배\n\n지금 기준치 초과 → 체크카드 전환 권장.',
      sources: [],
    },
    strategy: {
      answer: '카드사 사용액 비율과 신용카드 공제 규칙을 같이 확인했어요.\n\n신용카드를 아예 끊을 필요는 없어요. 보통 총급여의 25%를 넘긴 뒤부터 공제 효과가 커지고, 그 이후에는 체크카드·현금영수증 공제율이 더 유리해요.\n김갓생님은 이번 달 신용카드 지출이 기준치를 넘어서, 남은 기간은 체크카드로 돌리는 전략을 추천해요.',
      sources: ['소득세법 신용카드 등 사용금액 소득공제 기준', '카드사 월별 사용 비율', '국세청 연말정산 미리보기 소비 분석'],
    },
  },
  '안경 맞춘 것도 세금 깎아준다던데 영수증 버렸으면 어떡해?': {
    easy: {
      answer: '버려도 괜찮아요!\n\n안경점에 다시 달라고 하거나, 카드 결제 내역으로 증명할 수 있어요.\n1명당 연 50만 원까지 돌려받을 수 있어요.',
      sources: [],
    },
    summary: {
      answer: '영수증 없어도 공제 가능해요.\n\n• 공제 대상: 시력교정용 안경·렌즈, 1인당 연 50만 원 한도\n• 대안: 카드 결제내역으로 재증빙\n• 앱에서 15만 원 결제내역 발견 → 공제 후보 등록 예정',
      sources: [],
    },
    strategy: {
      answer: 'OO안경원 결제내역과 의료비 공제 문서를 같이 조회했어요.\n\n시력보정용 안경이나 콘택트렌즈라면 1명당 연 50만 원 한도에서 의료비 세액공제 대상이에요.\n영수증을 버렸어도 안경점에 재발급을 요청하거나 카드 결제내역으로 구매처를 확인한 뒤 증빙을 다시 받을 수 있어요.\n앱에서는 발견된 15만 원 결제내역을 영수증 등록 후보로 올려둘게요.',
      sources: ['소득세법 제59조의4', '소득세법 시행령 제118조의5 제1항 제4호', '카드사 OO안경원 15만 원 결제내역'],
    },
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

function findRagAnswer(userName: string, coachId: CoachId, text: string): AnswerData | undefined {
  const normalized = text.replace(/\s/g, '').toLowerCase()
  const matchers = ragMatchers[userName as keyof typeof ragMatchers] ?? []
  const scored = matchers
    .map((matcher) => ({
      answerKey: matcher.answerKey,
      score: matcher.keywords.filter((kw) => normalized.includes(kw.replace(/\s/g, '').toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score)
  if ((scored[0]?.score ?? 0) < 2) return undefined
  return ragAnswers[scored[0].answerKey]?.[coachId]
}

// ── 빠른 질문 프리셋 답변 ────────────────────────────────────
const quickReplyAnswers: Record<string, Record<string, ByCoach>> = {
  '지금 신청 가능한 혜택이 있어?': {
    [HANBEOTEAM_NAME]: {
      easy: {
        answer: '지금 바로 챙길 수 있는 혜택이 있어요!\n\n1. 근로장려금 — 5월 31일까지 신청해야 해요.\n2. 아동수당 — 매달 나오는데, 주소 바꾼 적 있으면 다시 확인해보세요.\n3. 한부모 양육비 지원 — 조건이 맞으면 매달 20만 원이에요.',
        sources: [],
      },
      summary: {
        answer: '신청 가능한 혜택 3가지예요.\n\n1. 근로장려금 → 마감 5월 31일\n2. 아동수당 → 주소 변경 이력 확인 필요\n3. 한부모가족 양육비 → 월 20만 원, 소득 기준 확인 필요\n\n근로장려금이 제일 급해요.',
        sources: [],
      },
      strategy: {
        answer: '마이데이터와 신청 기간 정보를 확인했어요.\n\n지금 바로 챙길 수 있는 혜택이 3가지예요.\n\n1. 근로장려금 — 5월 1일~31일 정기신청 기간이에요. 소득 기준으로 검토 대상이에요.\n2. 아동수당 — 매월 자동 지급이지만 주소 변경 이력이 있으면 재확인이 필요해요.\n3. 한부모가족 양육비 지원 — 소득 기준 충족 시 월 20만 원 지원돼요.\n\n이 중 근로장려금 마감이 5월 31일로 제일 급해요.',
        sources: ['마이데이터 가족관계 정보', '홈택스 소득자료', '복지로 지원금 조회 결과'],
      },
    },
    [KIMGODSAENG_NAME]: {
      easy: {
        answer: '지금 챙길 수 있는 혜택이 있어요!\n\n1. 월세 공제 — 내년 연말정산 때 월세의 17%를 돌려받을 수 있어요.\n2. 청약저축 — 매달 넣는 돈의 40%가 공제돼요.\n3. K-패스 — 버스·지하철 20~53% 적립이에요.',
        sources: [],
      },
      summary: {
        answer: '신청 가능한 혜택 3가지예요.\n\n1. 월세 세액공제 → 연 월세의 17%\n2. 주택청약저축 소득공제 → 납입액 40%\n3. K-패스 교통카드 → 월 15회 이상 시 20~53% 적립\n\n모두 별도 서류 없이 등록만으로 돼요.',
        sources: [],
      },
      strategy: {
        answer: '마이데이터와 지원금 현황을 확인했어요.\n\n1. 월세 세액공제 — 연 월세의 17% 공제, 내년 연말정산 때 신청해요.\n2. 주택청약종합저축 소득공제 — 납입액의 40%까지 공제돼요.\n3. K-패스 교통카드 — 월 15회 이상 대중교통 이용 시 20~53% 적립이에요.\n\n세 가지 모두 별도 서류 없이 등록만으로 혜택을 받을 수 있어요.',
        sources: ['마이데이터 주거지 정보', '청약저축 납입 내역', '국토교통부 K-패스 안내'],
      },
    },
    default: {
      easy: {
        answer: '지금 챙길 수 있는 공제가 있어요!\n\n1. 의료비 — 병원비가 많으면 돌려받을 수 있어요.\n2. 카드 공제 — 많이 쓸수록 돌려받아요.\n3. 보험료 — 매달 내는 보험료도 공제 대상이에요.',
        sources: [],
      },
      summary: {
        answer: '주요 공제 항목 3가지예요.\n\n1. 의료비 세액공제 — 총급여의 3% 초과분의 15%\n2. 신용·체크카드 소득공제 — 총급여 25% 초과분부터\n3. 보험료 세액공제 — 보장성 보험의 12%\n\n정확한 금액은 내 정보 등록 후 확인 가능해요.',
        sources: [],
      },
      strategy: {
        answer: '등록된 정보를 기준으로 확인했어요.\n\n지금 일반적으로 챙길 수 있는 공제 항목이에요.\n\n1. 의료비 세액공제 — 총급여의 3% 초과분부터 15% 공제받을 수 있어요.\n2. 신용·체크카드 소득공제 — 총급여의 25% 초과 사용분부터 적용돼요.\n3. 보험료 세액공제 — 납입한 보장성 보험료의 12~15% 공제 가능해요.\n\n정확한 금액 계산은 내 정보를 먼저 등록하시면 더 구체적으로 알려드릴게요.',
        sources: ['소득세법 특별세액공제 항목', '국세청 연말정산 간소화 자료'],
      },
    },
  },
  '내가 받을 수 있는 정책을 알려줘': {
    [HANBEOTEAM_NAME]: {
      easy: {
        answer: '받을 수 있는 정책이 여러 개 있어요!\n\n1. 근로장려금 — 최대 300만 원\n2. 자녀장려금 — 최대 100만 원\n3. 한부모 양육비 — 매달 20만 원\n4. 아이 학원비 공제 — 낸 금액의 15%\n\n1번과 2번은 같이 신청할 수 있어요.',
        sources: [],
      },
      summary: {
        answer: '한버팀님 해당 정책 4가지예요.\n\n1. 근로장려금 — 최대 300만 원, 5월 신청\n2. 자녀장려금 — 최대 100만 원, 5월 신청\n3. 한부모가족 양육비 — 월 20만 원\n4. 취학 전 학원비 세액공제 — 결제액 15%\n\n1·2번은 동시 신청 가능.',
        sources: [],
      },
      strategy: {
        answer: '한버팀님 프로필을 바탕으로 정리했어요.\n\n1. 근로장려금 — 최대 300만 원, 5월 정기신청\n2. 자녀장려금 — 자녀 1명 기준 최대 100만 원\n3. 한부모가족 아동양육비 — 월 20만 원, 소득 기준 확인 필요\n4. 취학 전 아동 학원비 세액공제 — 결제액의 15%\n\n1번과 2번은 함께 신청할 수 있어요.',
        sources: ['조세특례제한법 제100조의2', '여성가족부 한부모가족 지원사업', '정부24 가족관계 스크래핑'],
      },
    },
    [KIMGODSAENG_NAME]: {
      easy: {
        answer: '받을 수 있는 정책이 있어요!\n\n1. 청년 월세 지원 — 조건이 맞으면 매달 20만 원\n2. 청년 내일저축계좌 — 내가 10만 원 내면 정부가 30만 원 줘요\n3. 고향사랑기부제 — 10만 원 내고 13만 원 혜택 받아요\n4. K-패스 — 교통비 20~53% 적립',
        sources: [],
      },
      summary: {
        answer: '김갓생님 해당 정책 4가지예요.\n\n1. 청년 월세 특별지원 — 월 최대 20만 원\n2. 청년 내일저축계좌 — 월 10만 원 저축 시 30만 원 매칭\n3. 고향사랑기부제 — 세액공제 + 답례품 합산 13만 원\n4. K-패스 — 월 15회 이상 시 20~53% 적립\n\n2번은 신청 기간 한정.',
        sources: [],
      },
      strategy: {
        answer: '김갓생님 상황에 맞는 정책을 찾았어요.\n\n1. 청년 월세 한시 특별지원 — 월 최대 20만 원, 소득 기준 확인 필요\n2. 청년 내일저축계좌 — 월 10만 원 저축 시 정부가 30만 원 매칭\n3. 고향사랑기부제 — 10만 원 기부 시 세액공제 + 답례품으로 13만 원 혜택\n4. K-패스 교통카드 — 월 15회 이상 이용 시 20~53% 적립\n\n2번은 신청 기간이 한정되어 있으니 꼭 확인해보세요.',
        sources: ['국토교통부 청년월세 지원사업', '보건복지부 청년 내일저축계좌', '행정안전부 고향사랑기부제'],
      },
    },
    default: {
      easy: {
        answer: '대표적인 정책을 알려드릴게요!\n\n1. 청년 내일채움공제 — 2년 일하면 최대 1,200만 원\n2. 청약저축 공제 — 무주택자라면 돌려받을 수 있어요\n3. 건강보험료 환급 — 작년보다 소득이 줄었으면 자동으로 돌아와요\n\n내 정보를 등록하면 더 정확하게 알려드려요.',
        sources: [],
      },
      summary: {
        answer: '기본 정보 기준 정책 3가지예요.\n\n1. 청년 내일채움공제 — 2년 근속 시 최대 1,200만 원\n2. 주택청약저축 소득공제 — 무주택 세대주, 연 최대 96만 원\n3. 건강보험료 환급 — 소득 감소 시 자동 환급\n\n정확한 조건은 정보 등록 후 확인 가능.',
        sources: [],
      },
      strategy: {
        answer: '기본 정보를 바탕으로 안내드려요.\n\n1. 청년 내일채움공제 — 2년 근속 시 최대 1,200만 원\n2. 주택청약종합저축 소득공제 — 무주택 세대주라면 연 최대 96만 원\n3. 건강보험료 환급 — 전년도 소득 대비 과납 시 자동 환급\n4. 보험료 세액공제 — 보장성 보험 납입액의 12%\n\n정확한 조건 확인은 내 정보를 먼저 등록하시면 더 구체적으로 알려드릴게요.',
        sources: ['고용노동부 청년 지원사업 안내', '국세청 연말정산 주요 공제항목'],
      },
    },
  },
  '종합소득세 신고 기간이 언제야?': {
    default: {
      easy: {
        answer: '매년 5월이에요!\n\n5월 1일부터 5월 31일까지 신고하면 돼요.\n\n직장에 다니고 다른 소득이 없는 분은 회사에서 알아서 해주기 때문에 따로 안 해도 돼요. 부업이나 프리랜서 소득이 있으면 꼭 해야 해요!',
        sources: [],
      },
      summary: {
        answer: '종합소득세 신고 기간 안내예요.\n\n• 일반: 5월 1일~31일\n• 성실신고확인 대상자: 6월 30일까지\n\n근로소득만 있으면 연말정산으로 처리되어 별도 신고 불필요. 부업·프리랜서 소득 있으면 반드시 신고해야 해요.',
        sources: [],
      },
      strategy: {
        answer: '종합소득세 신고 기간을 안내해 드릴게요.\n\n매년 5월 1일부터 5월 31일까지예요.\n성실신고확인 대상자는 6월 30일까지 연장돼요.\n\n근로소득만 있는 분은 연말정산으로 처리되기 때문에 5월 신고가 따로 필요하지 않은 경우가 많아요. 부업이나 프리랜서 소득이 있다면 반드시 신고하셔야 해요.',
        sources: ['소득세법 제70조', '국세청 종합소득세 신고 안내', '홈택스 신고 일정'],
      },
    },
  },
  '소득공제와 세액공제 차이가 뭐야?': {
    default: {
      easy: {
        answer: '쉽게 설명해 드릴게요!\n\n소득공제 — 세금을 계산하기 전에 소득에서 빼줘요. 소득이 높을수록 유리해요.\n\n세액공제 — 세금을 계산한 다음에 세금에서 직접 빼줘요. 소득이 낮아도 같은 효과예요.\n\n보통 세액공제가 체감상 더 직접적이에요!',
        sources: [],
      },
      summary: {
        answer: '두 공제의 핵심 차이예요.\n\n소득공제: 세금 계산 전 소득에서 차감 (신용카드, 인적공제 등)\n세액공제: 세금 계산 후 세액에서 직접 차감 (의료비, 교육비, 보험료 등)\n\n세액공제가 체감 효과가 더 직접적이고, 저소득층에게 유리해요.',
        sources: [],
      },
      strategy: {
        answer: '두 가지 공제 방식의 차이를 설명해 드릴게요.\n\n소득공제는 세금 계산 전에 소득에서 먼저 빼주는 방식이에요. 신용카드 소득공제, 인적공제 등이 여기에 해당해요. 소득이 높을수록 공제 효과가 커져요.\n\n세액공제는 세금을 계산한 이후에 세액에서 직접 빼주는 방식이에요. 의료비, 교육비, 보험료 세액공제가 여기에 해당해요. 소득 수준에 관계없이 공제율이 동일해서 체감 효과가 더 직접적이에요.',
        sources: ['소득세법 제51조 (소득공제)', '소득세법 제59조의4 (세액공제)', '국세청 세금 용어 사전'],
      },
    },
  },
  '교육비 공제는 어떻게 받아?': {
    [HANBEOTEAM_NAME]: {
      easy: {
        answer: '아이 학원비나 어린이집 비용을 돌려받을 수 있어요!\n\n연말정산 때 국세청 홈페이지에서 자동으로 잡혀요. 잡히지 않는 게 있으면 영수증을 직접 챙겨서 제출하면 돼요.\n\n1명당 연 300만 원까지, 15%를 돌려받아요.',
        sources: [],
      },
      summary: {
        answer: '취학 전 아동 교육비 공제 안내예요.\n\n• 대상: 학원비, 어린이집 보육료 (만 6세 이하)\n• 한도: 1인당 연 300만 원\n• 공제율: 15%\n• 방법: 연말정산 간소화 서비스 자동 수집 (누락 시 영수증 직접 첨부)',
        sources: [],
      },
      strategy: {
        answer: '한버팀님 상황에 맞게 안내할게요.\n\n취학 전 아동(만 6세 이하)의 학원비와 어린이집 보육료는 1인당 연 300만 원까지 15% 세액공제가 적용돼요.\n\n연말정산 때 국세청 간소화 서비스에서 자료를 불러오거나, 영수증이 누락된 경우 해당 기관에서 직접 발급받아 제출하면 돼요.\n\n어린이집 특별활동비 중 카드로 결제한 내역이 앱에서 확인됐어요.',
        sources: ['소득세법 제59조의4 제1항', '국세청 교육비 세액공제 안내', '카드사 어린이집 결제내역'],
      },
    },
    [KIMGODSAENG_NAME]: {
      easy: {
        answer: '본인 교육비도 공제가 돼요!\n\n대학원 등록금이나 자격증 교육비가 해당돼요. 냈던 금액의 15%를 돌려받을 수 있어요.\n\n연말정산 때 자동으로 잡히는 경우가 많으니 확인해보세요.',
        sources: [],
      },
      summary: {
        answer: '본인 교육비 공제 안내예요.\n\n• 대상: 대학원 등록금, 직업능력개발 훈련비\n• 한도: 없음 (전액 공제)\n• 공제율: 15%\n• 방법: 연말정산 간소화 자동 반영 (누락 시 영수증 첨부)',
        sources: [],
      },
      strategy: {
        answer: '교육비 공제 방법을 안내해 드릴게요.\n\n본인 교육비는 대학원 등록금, 직업능력개발 훈련 비용이 해당돼요. 공제율은 15%이며 본인 교육비는 한도 없이 전액 공제돼요.\n\n연말정산 간소화 서비스에서 자동으로 반영되는 경우가 많아요. 간소화에 없는 영수증은 직접 첨부하셔야 해요.',
        sources: ['소득세법 제59조의4 제1항', '국세청 교육비 세액공제 안내'],
      },
    },
    default: {
      easy: {
        answer: '교육비를 냈으면 돌려받을 수 있어요!\n\n자녀 학원비, 대학교 등록금, 본인 자격증 교육비가 모두 해당돼요.\n연말정산 때 홈택스에서 자동으로 잡혀요.',
        sources: [],
      },
      summary: {
        answer: '교육비 공제 기본 정보예요.\n\n• 취학 전~고등학생 자녀: 1인당 300만~900만 원 한도, 15%\n• 본인 대학원: 한도 없이 전액, 15%\n• 방법: 연말정산 간소화 자동 수집, 누락 시 영수증 첨부',
        sources: [],
      },
      strategy: {
        answer: '교육비 공제 방법을 안내해 드릴게요.\n\n취학 전 아동·초중고 자녀 교육비는 연 300만~900만 원 한도에서 15% 세액공제를 받을 수 있어요.\n본인이 직접 낸 대학원 등록금은 한도 없이 전액 공제 대상이에요.\n\n연말정산 간소화 서비스에서 대부분 자동 수집되고, 누락된 항목은 영수증을 직접 첨부해서 제출하면 돼요.',
        sources: ['소득세법 제59조의4 제1항 제2호', '국세청 교육비 세액공제 안내'],
      },
    },
  },
}

function findQuickAnswer(userName: string, coachId: CoachId, text: string): AnswerData | undefined {
  const qMap = quickReplyAnswers[text]
  if (!qMap) return undefined
  const byCoach = qMap[userName] ?? qMap['default']
  if (!byCoach) return undefined
  return byCoach[coachId]
}

type Message = { role: 'user' | 'ai'; text: string; sources?: string[]; loading?: boolean }

export default function ChatbotPage() {
  const navigate = useNavigate()
  const { userName } = useAuth()
  const { selectedCoach } = useChatbotCoach()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [quickOpen, setQuickOpen] = useState(true)
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

  const coachId = selectedCoach.id

  const sendMessage = (text: string) => {
    if (!text.trim() || isSearching) return
    const ragAnswer = findQuickAnswer(userName, coachId, text) ?? findRagAnswer(userName, coachId, text)
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
      { delay: 850,  text: '관련 법령과 마이데이터를 검색하고 있어요...' },
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
          ? { role: 'ai', text: ragAnswer.answer, sources: ragAnswer.sources.length > 0 ? ragAnswer.sources : undefined }
          : msg
      )))
      setIsSearching(false)
    }, 3450)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ background: 'white', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700 }}>{selectedCoach.name}</p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selectedCoach.level} · {selectedCoach.tags[0]}</p>
        </div>
        <button onClick={() => navigate('/chatbot/init')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-secondary)' }}>변경</button>
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
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
              {msg.sources && msg.sources.length > 0 && (
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

      </div>

      {/* ── 빠른 질문 패널 ── */}
      <div style={{ background: 'white', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <button
          onClick={() => setQuickOpen(o => !o)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>빠른 질문</span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            style={{ transition: 'transform 0.2s', transform: quickOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ overflow: 'hidden', maxHeight: quickOpen ? `${replies.length * 44}px` : '0px', transition: 'max-height 0.25s ease', borderTop: quickOpen ? '1px solid var(--border)' : 'none' }}>
          {replies.map((reply, i) => (
            <button
              key={reply}
              onClick={() => { sendMessage(reply); setQuickOpen(false) }}
              disabled={isSearching}
              style={{ width: '100%', padding: '11px 16px', background: 'white', border: 'none', borderBottom: i < replies.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: isSearching ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 13, textAlign: 'left', color: 'var(--text-primary)', opacity: isSearching ? 0.6 : 1 }}
            >
              <span>{reply}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ))}
        </div>
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
