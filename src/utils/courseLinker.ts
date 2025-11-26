import { TreeNode, Course, ImageFile } from '../types'

export interface CourseSelection {
  courses: Course[]
  totalImages: number
}

export function getAllCoursesFromFolder(folderId: string, tree: TreeNode[]): Course[] {
  const courses: Course[] = []
  
  function traverse(nodes: TreeNode[]) {
    for (const node of nodes) {
      if (node.id === folderId) {
        collectCoursesFromNode(node, courses)
        return
      }
      if (node.children) {
        traverse(node.children)
      }
    }
  }
  
  traverse(tree)
  return courses
}

function collectCoursesFromNode(node: TreeNode, courses: Course[]) {
  if (node.type === 'course' && node.course) {
    courses.push(node.course)
  }
  if (node.children) {
    for (const child of node.children) {
      collectCoursesFromNode(child, courses)
    }
  }
}

export function getAllCourses(tree: TreeNode[]): Course[] {
  const courses: Course[] = []
  
  function traverse(nodes: TreeNode[]) {
    for (const node of nodes) {
      if (node.type === 'course' && node.course) {
        courses.push(node.course)
      }
      if (node.children) {
        traverse(node.children)
      }
    }
  }
  
  traverse(tree)
  return courses
}

export function getAllFolders(tree: TreeNode[]): TreeNode[] {
  const folders: TreeNode[] = []
  
  function traverse(nodes: TreeNode[]) {
    for (const node of nodes) {
      if (node.type === 'folder') {
        folders.push(node)
        if (node.children) {
          traverse(node.children)
        }
      }
    }
  }
  
  traverse(tree)
  return folders
}

export function findCourseById(courseId: string, tree: TreeNode[]): Course | null {
  function traverse(nodes: TreeNode[]): Course | null {
    for (const node of nodes) {
      if (node.type === 'course' && node.course?.id === courseId) {
        return node.course
      }
      if (node.children) {
        const found = traverse(node.children)
        if (found) return found
      }
    }
    return null
  }
  
  return traverse(tree)
}

export function extractTextFromCourses(courses: Course[]): string {
  const textParts: string[] = []
  
  for (const course of courses) {
    textParts.push(`=== ${course.title} ===\n`)
    if (course.content) {
      textParts.push(course.content)
    }
    
    for (const pdf of course.pdfs) {
      if (pdf.extractedText) {
        textParts.push(`\n--- ${pdf.name} ---\n`)
        textParts.push(pdf.extractedText)
      }
    }
    
    textParts.push('\n\n')
  }
  
  return textParts.join('\n')
}

export function extractImagesFromCourses(courses: Course[]): ImageFile[] {
  const images: ImageFile[] = []
  
  for (const course of courses) {
    images.push(...course.images)
  }
  
  return images
}

export function transcribeContentToFormat(content: string): string {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line)
  
  const sections = {
    conceptsCles: [] as string[],
    applications: [] as string[],
    aReviser: [] as string[]
  }
  
  let currentSection: 'conceptsCles' | 'applications' | 'aReviser' = 'conceptsCles'
  
  for (const line of lines) {
    const lower = line.toLowerCase()
    
    if (lower.includes('application') || lower.includes('exemple') || lower.includes('exercice')) {
      currentSection = 'applications'
    } else if (lower.includes('réviser') || lower.includes('revoir') || lower.includes('important')) {
      currentSection = 'aReviser'
    } else if (lower.includes('définition') || lower.includes('concept') || lower.includes('propriété')) {
      currentSection = 'conceptsCles'
    }
    
    if (line.startsWith('##') || line.startsWith('###') || line.startsWith('#')) {
      const cleanTitle = line.replace(/^#+\s*/, '')
      sections[currentSection].push(cleanTitle)
    } else if (line.length > 20 && !line.startsWith('*') && !line.startsWith('-')) {
      sections[currentSection].push(line)
    }
  }
  
  const formatted: string[] = []
  
  if (sections.conceptsCles.length > 0) {
    formatted.push('📚 CONCEPTS CLÉS')
    formatted.push('')
    sections.conceptsCles.slice(0, 10).forEach(item => {
      formatted.push(`• ${item}`)
    })
    formatted.push('')
  }
  
  if (sections.applications.length > 0) {
    formatted.push('🎯 APPLICATIONS')
    formatted.push('')
    sections.applications.slice(0, 8).forEach(item => {
      formatted.push(`• ${item}`)
    })
    formatted.push('')
  }
  
  if (sections.aReviser.length > 0) {
    formatted.push('⚠️ À RÉVISER')
    formatted.push('')
    sections.aReviser.slice(0, 5).forEach(item => {
      formatted.push(`• ${item}`)
    })
  }
  
  return formatted.join('\n')
}
