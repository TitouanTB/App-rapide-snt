import { useState, useEffect } from 'react'
import { XIcon, PlusIcon, Loader2Icon, FolderIcon, FileTextIcon } from 'lucide-react'
import { parseRawText } from '../utils/textParser'
import { Planning, Library, Course } from '../types'
import { 
  getAllCourses, 
  getAllFolders, 
  getAllCoursesFromFolder,
  extractTextFromCourses,
  extractImagesFromCourses
} from '../utils/courseLinker'

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  onCreatePlanning: (planning: Planning) => void
  library: Library
}

type SelectionMode = 'course' | 'folder'

export function AdminPanel({ isOpen, onClose, onCreatePlanning, library }: AdminPanelProps) {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('course')
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [selectedFolderId, setSelectedFolderId] = useState<string>('')
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(new Set())
  const [planningName, setPlanningName] = useState('')
  const [planningText, setPlanningText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('')

  const allCourses = getAllCourses(library.tree)
  const allFolders = getAllFolders(library.tree)

  const coursesInFolder = selectedFolderId
    ? getAllCoursesFromFolder(selectedFolderId, library.tree)
    : []

  useEffect(() => {
    if (selectionMode === 'course') {
      setSelectedCourseIds(new Set())
      setSelectedFolderId('')
    } else {
      setSelectedCourseId('')
    }
  }, [selectionMode])

  useEffect(() => {
    if (selectedFolderId && selectionMode === 'folder') {
      const folderCourses = getAllCoursesFromFolder(selectedFolderId, library.tree)
      setSelectedCourseIds(new Set(folderCourses.map(c => c.id)))
    }
  }, [selectedFolderId, library.tree, selectionMode])

  const toggleCourseSelection = (courseId: string) => {
    const newSelection = new Set(selectedCourseIds)
    if (newSelection.has(courseId)) {
      newSelection.delete(courseId)
    } else {
      newSelection.add(courseId)
    }
    setSelectedCourseIds(newSelection)
  }

  const getSelectedCourses = (): Course[] => {
    if (selectionMode === 'course' && selectedCourseId) {
      const course = allCourses.find(c => c.id === selectedCourseId)
      return course ? [course] : []
    }
    if (selectionMode === 'folder' && selectedCourseIds.size > 0) {
      return allCourses.filter(c => selectedCourseIds.has(c.id))
    }
    return []
  }

  const selectedCourses = getSelectedCourses()
  const totalImages = selectedCourses.reduce((sum, c) => sum + c.images.length, 0)

  const processingMessages = [
    'Analyse du contenu...',
    'Extraction des concepts clés...',
    'Liaison des cours sélectionnés...',
    'Extraction des images...',
    'Génération du planning...',
    'Structuration des tâches...',
    'Parsing du texte...',
    'Formatage des sections...',
    'Optimisation de la révision...',
    'Finalisation du planning...',
  ]

  const handleCreatePlanning = async () => {
    if (selectedCourses.length === 0) {
      alert('Veuillez sélectionner au moins un cours')
      return
    }

    if (!planningName.trim()) {
      alert('Veuillez entrer un nom pour le planning')
      return
    }

    setIsProcessing(true)

    const totalDuration = 10000 + Math.random() * 10000
    const messageInterval = totalDuration / processingMessages.length

    let messageIndex = 0
    setProcessingMessage(processingMessages[0])

    const intervalId = setInterval(() => {
      messageIndex++
      if (messageIndex < processingMessages.length) {
        setProcessingMessage(processingMessages[messageIndex])
      }
    }, messageInterval)

    await new Promise(resolve => setTimeout(resolve, totalDuration))

    clearInterval(intervalId)

    const extractedText = extractTextFromCourses(selectedCourses)
    const extractedImages = extractImagesFromCourses(selectedCourses)

    const fullText = planningText.trim()
      ? `${planningText}\n\n${extractedText}`
      : extractedText

    const basePlanning = parseRawText(fullText, planningName)

    const planning: Planning = {
      ...basePlanning,
      id: `planning-${Date.now()}`,
      chapterName: planningName,
      linkedCourseIds: selectedCourses.map(c => c.id),
      linkedImages: extractedImages,
      createdAt: new Date().toISOString(),
    }

    onCreatePlanning(planning)

    setPlanningName('')
    setPlanningText('')
    setSelectedCourseId('')
    setSelectedFolderId('')
    setSelectedCourseIds(new Set())
    setIsProcessing(false)
    setProcessingMessage('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">🔐 Admin Panel</h2>
            <p className="text-sm text-primary-100 mt-1">
              Créer des plannings de révision personnalisés
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-500 rounded-full transition-colors"
            disabled={isProcessing}
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <Loader2Icon className="w-16 h-16 text-primary-600 animate-spin" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Création du planning en cours...
                </h3>
                <p className="text-lg text-primary-600 font-medium animate-pulse">
                  {processingMessage}
                </p>
                <div className="mt-6 max-w-md mx-auto">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-700 h-full rounded-full animate-pulse"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mode de sélection
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectionMode === 'course'}
                      onChange={() => setSelectionMode('course')}
                      className="text-primary-600"
                    />
                    <FileTextIcon className="w-4 h-4" />
                    <span>Sélectionner un cours</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectionMode === 'folder'}
                      onChange={() => setSelectionMode('folder')}
                      className="text-primary-600"
                    />
                    <FolderIcon className="w-4 h-4" />
                    <span>Sélectionner un dossier</span>
                  </label>
                </div>
              </div>

              {selectionMode === 'course' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cours
                  </label>
                  <select
                    className="input-field w-full"
                    value={selectedCourseId}
                    onChange={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedCourseId(e.target.value)
                    }}
                  >
                    <option value="">Sélectionnez un cours...</option>
                    {allCourses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectionMode === 'folder' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dossier
                    </label>
                    <select
                      className="input-field w-full"
                      value={selectedFolderId}
                      onChange={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedFolderId(e.target.value)
                      }}
                    >
                      <option value="">Sélectionnez un dossier...</option>
                      {allFolders.map(folder => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedFolderId && coursesInFolder.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cours dans le dossier (sélectionnez ceux à inclure)
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                        {coursesInFolder.map(course => (
                          <label
                            key={course.id}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCourseIds.has(course.id)}
                              onChange={() => toggleCourseSelection(course.id)}
                              className="text-primary-600"
                            />
                            <FileTextIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{course.title}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedCourses.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Aperçu de la sélection</h4>
                  <p className="text-sm text-green-800">
                    <strong>{selectedCourses.length}</strong> cours sélectionné(s),{' '}
                    <strong>{totalImages}</strong> image(s) trouvée(s)
                  </p>
                  <div className="mt-2 text-xs text-green-700">
                    {selectedCourses.map(c => c.title).join(', ')}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom du planning <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Contrôle Math Chap 2"
                  value={planningName}
                  onChange={(e) => setPlanningName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Texte du planning (optionnel)
                </label>
                <textarea
                  className="input-field w-full resize-none font-mono text-sm"
                  rows={8}
                  placeholder="Ajoutez du texte supplémentaire pour le planning, ou laissez vide pour utiliser uniquement le contenu des cours sélectionnés..."
                  value={planningText}
                  onChange={(e) => setPlanningText(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Le texte sera fusionné avec le contenu des cours sélectionnés
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Fonctionnement</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Sélectionnez un ou plusieurs cours à inclure dans le planning</li>
                  <li>• Le contenu et les images seront automatiquement extraits</li>
                  <li>• Un planning sur 7 jours sera généré avec des tâches structurées</li>
                  <li>• Le planning apparaîtra dans l'onglet "Planning"</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {!isProcessing && (
          <div className="bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-between">
            <button onClick={onClose} className="btn-secondary">
              Annuler
            </button>
            <button
              onClick={handleCreatePlanning}
              className="btn-primary flex items-center gap-2"
              disabled={selectedCourses.length === 0 || !planningName.trim()}
            >
              <PlusIcon className="w-5 h-5" />
              Créer le planning
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
