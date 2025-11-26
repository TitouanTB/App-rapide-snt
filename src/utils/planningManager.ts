import { Planning, Course } from '../types'
import { parseRawText } from './textParser'
import { extractTextFromCourses, extractImagesFromCourses } from './courseLinker'

export interface PlanningConfig {
  id: string
  name: string
  keyword: string
  courseIds: string[]
  createdAt: string
}

export interface PlanningProgress {
  [planningId: string]: {
    [dayNum: number]: boolean
  }
}

export function getPlanningConfigs(): PlanningConfig[] {
  const stored = localStorage.getItem('planning-configs')
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function savePlanningConfigs(configs: PlanningConfig[]): void {
  localStorage.setItem('planning-configs', JSON.stringify(configs))
}

export function addPlanningConfig(config: Omit<PlanningConfig, 'id' | 'createdAt'>): PlanningConfig {
  const configs = getPlanningConfigs()
  const newConfig: PlanningConfig = {
    ...config,
    id: `cfg-${Date.now()}`,
    createdAt: new Date().toISOString()
  }
  configs.push(newConfig)
  savePlanningConfigs(configs)
  return newConfig
}

export function findConfigByKeyword(message: string): PlanningConfig | null {
  const configs = getPlanningConfigs()
  const lowerMessage = message.toLowerCase()
  
  for (const config of configs) {
    const lowerKeyword = config.keyword.toLowerCase()
    if (lowerMessage.includes(lowerKeyword)) {
      return config
    }
  }
  
  return null
}

export function createPlanningFromConfig(config: PlanningConfig, courses: Course[]): Planning {
  const extractedText = extractTextFromCourses(courses)
  const extractedImages = extractImagesFromCourses(courses)
  
  const basePlanning = parseRawText(extractedText, config.name)
  
  const planning: Planning = {
    ...basePlanning,
    id: `planning-${Date.now()}`,
    chapterName: config.name,
    linkedCourseIds: config.courseIds,
    linkedImages: extractedImages,
    createdAt: new Date().toISOString(),
  }
  
  return planning
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
