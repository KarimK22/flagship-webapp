import type { Ref } from 'vue'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Updater } from '@tanstack/vue-query'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const addColorOpacity = (color: string, opacity: number) => {
  return `${color}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')}`
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function valueUpdater<T extends Updater<any, any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}
