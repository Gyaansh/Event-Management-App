import {
  Cpu,
  Music2,
  Briefcase,
  Palette,
  Trophy,
  UtensilsCrossed,
  GraduationCap,
  HeartPulse,
  Sparkles,
} from 'lucide-react';

export const CATEGORY_META = {
  Technology: { icon: Cpu, className: 'bg-blue-50 text-blue-700' },
  Music: { icon: Music2, className: 'bg-violet-50 text-violet-700' },
  Business: { icon: Briefcase, className: 'bg-amber-50 text-amber-700' },
  'Arts & Culture': { icon: Palette, className: 'bg-rose-50 text-rose-700' },
  Sports: { icon: Trophy, className: 'bg-emerald-50 text-emerald-700' },
  'Food & Drink': { icon: UtensilsCrossed, className: 'bg-orange-50 text-orange-700' },
  Education: { icon: GraduationCap, className: 'bg-cyan-50 text-cyan-700' },
  'Health & Wellness': { icon: HeartPulse, className: 'bg-pink-50 text-pink-700' },
};

export function getCategoryMeta(category) {
  return CATEGORY_META[category] || { icon: Sparkles, className: 'bg-secondary text-secondary-foreground' };
}
