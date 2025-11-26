export interface Course {
  id: string
  title: string
  content: string
  pdfs: PDFFile[]
  images: ImageFile[]
}

export interface PDFFile {
  id: string
  name: string
  extractedText: string
  uploadedAt: string
}

export interface ImageFile {
  id: string
  name: string
  dataUrl: string
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
  id: string
  chapterId: string
  chapterName: string
  days: PlanningDay[]
  linkedCourseIds: string[]
  linkedImages: ImageFile[]
  createdAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AppState {
  library: Library
  plannings: Planning[]
  activePlanningId: string | null
  chatHistory: ChatMessage[]
}
