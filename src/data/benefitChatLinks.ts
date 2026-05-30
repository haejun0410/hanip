const RECOMMENDATION_CHAT_LINKS: Record<string, string> = {
  'monthly-rent': 'rent-tax-ai',
  'housing-subscription': 'housing-subscription-ai',
  'hometown-donation': 'hometown-donation-ai',
  'glasses-medical': 'glasses-ai',
  'student-loan': 'student-loan-ai',
  'pension-irp': 'pension-irp-ai',
  'eitc-child': 'eitc-ai',
  'single-parent': 'single-parent-ai',
  'dependent-parent': 'dependent-parent-ai',
  'preschool-tuition': 'activity-ai',
  donation: 'donation-ai',
  'sme-tax-reduction': 'sme-tax-reduction-ai',
}

const POLICY_CHAT_LINKS: Record<string, string> = {
  'tomorrow-card': 'tomorrow-card-ai',
  'youth-rent-support': 'youth-rent-ai',
  'youth-dream-account': 'youth-dream-account-ai',
  'youth-leap-account': 'youth-leap-account-ai',
  care: 'care-ai',
  'single-parent-childcare': 'single-parent-childcare-ai',
  'culture-card': 'culture-card-ai',
  'bucheon-family': 'bucheon-family-ai',
}

export function getRecommendationChatId(id?: string) {
  return id ? RECOMMENDATION_CHAT_LINKS[id] : undefined
}

export function getPolicyChatId(id?: string) {
  return id ? POLICY_CHAT_LINKS[id] : undefined
}
