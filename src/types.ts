export interface Course {
  id: string
  title: string
  content: string
  pdfs: PDFFile[]
}

export interface PDFFile {
  id: string
  name: string
  extractedText: string
  uploadedAt: string
}

export interface TreeNode {
  id: string
  name: string
  type: 'folder' | 'course'
  children?: TreeNode[]
  course?: Course
}

export interface Library {
  tree: TreeNode[]
}

export interface PlanningDay {
  dayNum: number
  date: string
  tasks: string[]
  completed: boolean
}

export interface Planning {
  chapterId: string
  chapterName: string
  days: PlanningDay[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AppState {
  library: Library
  activePlanning: Planning | null
  chatHistory: ChatMessage[]
}
