// icons.jsx — maps icon names (saved in the database) to lucide icons
import {
  Target, Users, TrendingUp, BarChart3, Wallet, Briefcase, ShieldCheck,
  Lightbulb, LineChart, Check, Award, Trophy, FileText, Star, Calendar,
  Sparkles, Handshake, CircleDollarSign, Coins,
  BadgeCheck, PenLine, ClipboardList, Building2, Globe, Rocket, Heart,
} from 'lucide-react'

// the icon choices shown in the admin forms (value = what is stored in the DB)
export const ICON_OPTIONS = [
  { value: 'target', label: 'Target' },
  { value: 'users', label: 'Users / Team' },
  { value: 'trending-up', label: 'Trending up' },
  { value: 'bar-chart', label: 'Bar chart' },
  { value: 'line-chart', label: 'Line chart' },
  { value: 'wallet', label: 'Wallet / Money' },
  { value: 'coins', label: 'Coins' },
  { value: 'circle-dollar', label: 'Dollar circle' },
  { value: 'briefcase', label: 'Briefcase' },
  { value: 'building', label: 'Building' },
  { value: 'shield', label: 'Shield' },
  { value: 'lightbulb', label: 'Lightbulb' },
  { value: 'check', label: 'Check' },
  { value: 'award', label: 'Award' },
  { value: 'trophy', label: 'Trophy' },
  { value: 'star', label: 'Star' },
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'file-text', label: 'Document' },
  { value: 'clipboard', label: 'Clipboard' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'globe', label: 'Globe' },
  { value: 'handshake', label: 'Handshake' },
  { value: 'rocket', label: 'Rocket' },
  { value: 'pen-line', label: 'Pen' },
  { value: 'badge-check', label: 'Badge' },
  { value: 'heart', label: 'Heart' },
]

const map = {
  target: Target,
  users: Users,
  'trending-up': TrendingUp,
  'bar-chart': BarChart3,
  'line-chart': LineChart,
  wallet: Wallet,
  coins: Coins,
  'circle-dollar': CircleDollarSign,
  briefcase: Briefcase,
  building: Building2,
  shield: ShieldCheck,
  lightbulb: Lightbulb,
  check: Check,
  award: Award,
  trophy: Trophy,
  star: Star,
  sparkles: Sparkles,
  'file-text': FileText,
  clipboard: ClipboardList,
  calendar: Calendar,
  globe: Globe,
  handshake: Handshake,
  rocket: Rocket,
  'pen-line': PenLine,
  'badge-check': BadgeCheck,
  heart: Heart,
}

export function iconByName(name) {
  return map[name] || Sparkles
}
