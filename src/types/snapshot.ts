import { Beneficiary } from '@/types/beneficiary.ts'

export type Snapshot = { totalTokenAllocation: number, allocationTypes: Record<string, number>, stats: { businessClassPass: number, commonCards: number, uncommonCards: number, specialCards: number, epicCards: number, rareCards: number, legendaryCards: number, mythicalCards: number } }

export type Allocation = { totalTokenAllocation: number, beneficiaryType: Beneficiary }
