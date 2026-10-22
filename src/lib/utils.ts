import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { AuthRole } from '@/store/useAuthStore';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Map auth role to URL prefix segment */
export function getRolePrefix(role: AuthRole | string): string {
  const map: Record<string, string> = {
    hr: 'hr',
    trainer: 'trainer',
    trainee: 'trainee',
    ld_team: 'ld',
    spv: 'spv',
  };
  return map[role] ?? 'ld';
}