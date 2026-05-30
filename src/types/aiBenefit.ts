export type AiBenefitType = 'tax' | 'policy' | 'hidden'

export type AiBenefit = {
  id: string
  type: AiBenefitType
  icon: string
  iconBg: string
  title: string
  subtitle: string
  statusLabel: string
  statusColor: string
  amount: number
  amountLabel: string
  aiReason: string
  conditions: string[]
}
