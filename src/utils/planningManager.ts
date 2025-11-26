import { Planning } from '../types'

export interface PlanningProgress {
  [planningId: string]: {
    [dayNum: number]: boolean
  }
}

export function getPlanningProgress(): PlanningProgress {
  const stored = localStorage.getItem('math-planner-progress')
  if (!stored) return {}
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

export function savePlanningProgress(progress: PlanningProgress): void {
  localStorage.setItem('math-planner-progress', JSON.stringify(progress))
}

export function getPlanningDayStatus(planningId: string, dayNum: number): boolean {
  const progress = getPlanningProgress()
  return progress[planningId]?.[dayNum] || false
}

export function togglePlanningDay(planningId: string, dayNum: number): void {
  const progress = getPlanningProgress()
  if (!progress[planningId]) {
    progress[planningId] = {}
  }
  progress[planningId][dayNum] = !progress[planningId][dayNum]
  savePlanningProgress(progress)
}

export function resetPlanning(planningId: string): void {
  const progress = getPlanningProgress()
  progress[planningId] = {}
  savePlanningProgress(progress)
}

export function getPlanningCompletionPercentage(planning: Planning): number {
  const progress = getPlanningProgress()
  const planningProgress = progress[planning.id] || {}
  const completedDays = Object.values(planningProgress).filter(Boolean).length
  return Math.round((completedDays / planning.days.length) * 100)
}

export function isPlanningFullyCompleted(planning: Planning): boolean {
  const progress = getPlanningProgress()
  const planningProgress = progress[planning.id] || {}
  return planning.days.every(day => planningProgress[day.dayNum] === true)
}
