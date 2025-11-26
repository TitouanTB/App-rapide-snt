import { useState } from 'react'
import { BookOpenIcon, CalendarIcon, MessageSquareIcon } from 'lucide-react'
import { LibraryTab } from './components/LibraryTab'
import { PlanningTab } from './components/PlanningTab'
import { AssistantTab } from './components/AssistantTab'
import { AdminPanel } from './components/AdminPanel'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Library, Planning, ChatMessage } from './types'
import { initialLibrary } from './data/plans'

type Tab = 'library' | 'planning' | 'assistant'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('library')
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [library, setLibrary] = useLocalStorage<Library>('math-planner-library', initialLibrary)
  const [plannings, setPlannings] = useLocalStorage<Planning[]>('math-planner-plannings', [])
  const [activePlanningId, setActivePlanningId] = useLocalStorage<string | null>(
    'math-planner-active-planning-id',
    null
  )
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>(
    'math-planner-chat-history',
    []
  )

  const handleLoadPlanning = (planning: Planning) => {
    const existingIndex = plannings.findIndex(p => p.id === planning.id)
    if (existingIndex >= 0) {
      const updatedPlannings = [...plannings]
      updatedPlannings[existingIndex] = planning
      setPlannings(updatedPlannings)
    } else {
      setPlannings([...plannings, planning])
    }
    setActivePlanningId(planning.id)
    setActiveTab('planning')
  }

  const handleLogoTripleClick = () => {
    setIsAdminOpen(true)
  }

  const handleCreatePlanning = (planning: Planning) => {
    setPlannings([...plannings, planning])
    setActivePlanningId(planning.id)
    setActiveTab('planning')
  }

  const handleDeletePlanning = (planningId: string) => {
    setPlannings(plannings.filter(p => p.id !== planningId))
    if (activePlanningId === planningId) {
      setActivePlanningId(plannings.length > 1 ? plannings[0].id : null)
    }
  }

  const tabs = [
    { id: 'library' as Tab, name: 'Bibliothèque', icon: BookOpenIcon },
    { id: 'planning' as Tab, name: 'Planning', icon: CalendarIcon },
    { id: 'assistant' as Tab, name: 'Assistant', icon: MessageSquareIcon },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-lg cursor-pointer"
                onClick={(e) => {
                  if (e.detail === 3) {
                    handleLogoTripleClick()
                  }
                }}
              >
                <BookOpenIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Math Revision Planner</h1>
                <p className="text-sm text-gray-600">Planifiez vos révisions efficacement</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-button flex items-center gap-2 ${
                    isActive ? 'tab-button-active' : 'tab-button-inactive'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="min-h-[calc(100vh-240px)]">
          {activeTab === 'library' && (
            <LibraryTab library={library} onUpdateLibrary={setLibrary} />
          )}
          {activeTab === 'planning' && (
            <PlanningTab
              plannings={plannings}
              activePlanningId={activePlanningId}
              onSetActivePlanning={setActivePlanningId}
              onDeletePlanning={handleDeletePlanning}
            />
          )}
          {activeTab === 'assistant' && (
            <AssistantTab
              chatHistory={chatHistory}
              onUpdateChatHistory={setChatHistory}
              onLoadPlanning={handleLoadPlanning}
            />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Math Revision Planner - Tous vos plannings de révision en un seul endroit 📚
          </p>
        </div>
      </footer>

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onCreatePlanning={handleCreatePlanning}
        library={library}
      />
    </div>
  )
}

export default App
