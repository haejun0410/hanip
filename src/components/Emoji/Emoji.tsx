import {
  Banknote, Home, Landmark, CreditCard, Stethoscope, TrendingUp,
  Baby, Palette, Hospital, Briefcase, FileText, Handshake,
  User, Users, Dumbbell, Building2, Gift, Glasses, GraduationCap,
  Target, Bot, Lock, PartyPopper, BarChart3, Link, Receipt,
  AlertTriangle, CheckCircle2, Key, MapPin, Sparkles, Building,
  ShoppingBag, Wallet, PiggyBank, HeartPulse, BookOpen, Star,
  type LucideIcon,
} from 'lucide-react'

const EMOJI_ICON_MAP: Record<string, LucideIcon> = {
  '💰': ShoppingBag,
  '🏠': Home,
  '🏡': Home,
  '🏦': Landmark,
  '💳': CreditCard,
  '🩺': Stethoscope,
  '📈': TrendingUp,
  '👶': Baby,
  '🎨': Palette,
  '🏥': Hospital,
  '💼': Briefcase,
  '📄': FileText,
  '💸': Banknote,
  '🤝': Handshake,
  '👵': User,
  '🥋': Dumbbell,
  '🏢': Building2,
  '🎁': Gift,
  '👓': Glasses,
  '🎓': GraduationCap,
  '🎯': Target,
  '🤖': Bot,
  '🔐': Lock,
  '🎉': PartyPopper,
  '📊': BarChart3,
  '🔗': Link,
  '🏛️': Building,
  '🧾': Receipt,
  '⚠️': AlertTriangle,
  '✅': CheckCircle2,
  '🔑': Key,
  '📌': MapPin,
  '✨': Sparkles,
  '👩‍👧': Users,
  '💵': Wallet,
  '🐷': PiggyBank,
  '❤️': HeartPulse,
  '📚': BookOpen,
  '⭐': Star,
}

interface EmojiProps {
  char: string
  size?: number
  color?: string
  style?: React.CSSProperties
}

export default function Emoji({ char, size = 22, color = 'var(--primary)', style }: EmojiProps) {
  const IconComponent = EMOJI_ICON_MAP[char]
  if (!IconComponent) return <span style={{ fontSize: size * 0.9, ...style }}>{char}</span>
  return <IconComponent size={size} color={color} strokeWidth={1.8} style={style} />
}
