import { Planning } from '../types'

interface ParsedSection {
  title: string
  points: string[]
  details: string[]
}

export function parseRawText(rawText: string, chapterName?: string): Planning {
  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  const sections = extractSections(lines)
  const keywords = extractKeywords(rawText)
  const structuredContent = formatIntoStructure(sections, keywords)
  
  const finalChapterName = chapterName || detectChapterName(lines) || 'Nouveau chapitre'
  const days = generateSevenDayPlan(structuredContent)
  
  const chapterId = `chapter-${Date.now()}`
  const planningId = `planning-${Date.now()}`
  
  return {
    id: planningId,
    chapterId,
    chapterName: finalChapterName,
    days,
    linkedCourseIds: [],
    linkedImages: [],
    createdAt: new Date().toISOString(),
  }
}

function detectChapterName(lines: string[]): string | null {
  for (const line of lines.slice(0, 5)) {
    if (line.length > 5 && line.length < 100) {
      if (
        /^chapitre|^ch\d|^leçon|^cours|^partie/i.test(line) ||
        /\d+\s*[-–—]\s*/i.test(line)
      ) {
        return line
      }
    }
  }
  
  if (lines[0] && lines[0].length < 100) {
    return lines[0]
  }
  
  return null
}

function extractSections(lines: string[]): ParsedSection[] {
  const sections: ParsedSection[] = []
  let currentSection: ParsedSection | null = null
  
  for (const line of lines) {
    if (isSectionTitle(line)) {
      if (currentSection) {
        sections.push(currentSection)
      }
      currentSection = {
        title: cleanText(line),
        points: [],
        details: [],
      }
    } else if (currentSection) {
      if (line.length > 80) {
        currentSection.details.push(cleanText(line))
      } else {
        currentSection.points.push(cleanText(line))
      }
    } else {
      if (!currentSection) {
        currentSection = {
          title: 'Introduction',
          points: [],
          details: [],
        }
      }
      currentSection.points.push(cleanText(line))
    }
  }
  
  if (currentSection) {
    sections.push(currentSection)
  }
  
  return sections
}

function isSectionTitle(line: string): boolean {
  if (line.length < 5 || line.length > 100) return false
  
  if (/^#+\s/.test(line)) return true
  if (/^[A-ZÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]/.test(line) && line.split(' ').length <= 8) return true
  if (/^\d+\.|\d+\)/.test(line)) return true
  if (line.endsWith(':')) return true
  
  return false
}

function extractKeywords(text: string): string[] {
  const words = text.split(/\s+/)
  const wordFrequency: Record<string, number> = {}
  
  for (const word of words) {
    const cleanWord = word
      .toLowerCase()
      .replace(/[^a-zàâäéèêëïîôùûüÿç]/g, '')
    
    if (cleanWord.length > 4) {
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1
    }
  }
  
  const capitalizedWords = text.match(/\b[A-ZÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ][a-zàâäéèêëïîôùûüÿç]{3,}\b/g) || []
  
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)
  
  const uniqueKeywords = new Set([...sortedWords, ...capitalizedWords.map(w => w.toLowerCase())])
  
  return Array.from(uniqueKeywords).slice(0, 8)
}

function cleanText(text: string): string {
  return text
    .replace(/^[#*\-•\d+.)]+\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatIntoStructure(sections: ParsedSection[], keywords: string[]): string[] {
  const formatted: string[] = []
  
  for (const section of sections) {
    formatted.push(section.title)
    
    for (const point of section.points) {
      if (point.length > 10) {
        formatted.push(`  • ${point}`)
      }
    }
    
    for (const detail of section.details) {
      const summary = summarizeLongText(detail, keywords)
      if (summary) {
        formatted.push(`    - ${summary}`)
      }
    }
  }
  
  return formatted
}

function summarizeLongText(text: string, keywords: string[]): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  if (sentences.length === 0) return text.slice(0, 100)
  
  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase()
    for (const keyword of keywords) {
      if (lowerSentence.includes(keyword)) {
        return sentence.trim().slice(0, 120)
      }
    }
  }
  
  return sentences[0].trim().slice(0, 100)
}

function generateSevenDayPlan(structuredContent: string[]): any[] {
  const days = []
  const contentPerDay = Math.ceil(structuredContent.length / 7)
  
  const dayTemplates = [
    {
      prefix: 'Revoir les définitions de base',
      suffix: 'Faire les exercices 1 à 5',
    },
    {
      prefix: 'Approfondir les concepts clés',
      suffix: 'Exercices 10 à 15',
    },
    {
      prefix: 'Réviser les applications pratiques',
      suffix: 'Quiz en ligne et exercices 20 à 25',
    },
    {
      prefix: 'Étudier les cas complexes',
      suffix: 'Exercices 30 à 35, fiche de synthèse',
    },
    {
      prefix: 'Faire un contrôle blanc chronométré',
      suffix: 'Corriger et analyser les erreurs',
    },
    {
      prefix: 'Réviser les points faibles',
      suffix: 'Refaire les exercices difficiles',
    },
    {
      prefix: 'Relecture rapide de toutes les fiches',
      suffix: 'Révision des formules clés, se reposer',
    },
  ]
  
  for (let i = 0; i < 7; i++) {
    const startIndex = i * contentPerDay
    const endIndex = Math.min((i + 1) * contentPerDay, structuredContent.length)
    const dayContent = structuredContent.slice(startIndex, endIndex)
    
    const tasks: string[] = []
    const template = dayTemplates[i]
    
    if (i === 0 && dayContent.length > 0) {
      tasks.push(`${template.prefix} : ${dayContent[0]}`)
    } else {
      tasks.push(template.prefix)
    }
    
    for (let j = 0; j < Math.min(dayContent.length, 3); j++) {
      if (dayContent[j] && !dayContent[j].startsWith(' ')) {
        tasks.push(dayContent[j])
      }
    }
    
    tasks.push(template.suffix)
    
    days.push({
      dayNum: i + 1,
      date: new Date(Date.now() + 86400000 * i).toISOString(),
      tasks: tasks.slice(0, 5),
      completed: false,
    })
  }
  
  return days
}
