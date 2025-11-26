import { useState } from 'react'
import { XIcon, PlusIcon, Loader2Icon } from 'lucide-react'
import { parseRawText } from '../utils/textParser'
import { Planning } from '../types'

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  onCreatePlanning: (planning: Planning) => void
}

export function AdminPanel({ isOpen, onClose, onCreatePlanning }: AdminPanelProps) {
  const [rawText, setRawText] = useState('')
  const [chapterName, setChapterName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('')

  const processingMessages = [
    'Analyse du contenu...',
    'Extraction des concepts clés...',
    'Génération du planning...',
    'Structuration des tâches...',
    'Parsing du texte...',
    'Formatage des sections...',
    'Optimisation de la révision...',
    'Finalisation du planning...',
  ]

  const handleCreatePlanning = async () => {
    if (!rawText.trim()) {
      alert('Veuillez entrer du texte pour créer un planning')
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
    
    const planning = parseRawText(rawText, chapterName || undefined)
    onCreatePlanning(planning)
    
    setRawText('')
    setChapterName('')
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
                    <div className="bg-gradient-to-r from-primary-500 to-primary-700 h-full rounded-full animate-pulse" 
                         style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom du chapitre (optionnel)
                </label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Chapitre 2 – Géométrie"
                  value={chapterName}
                  onChange={(e) => setChapterName(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si vide, le nom sera détecté automatiquement depuis le texte
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contenu du cours (format libre)
                </label>
                <textarea
                  className="input-field w-full resize-none font-mono text-sm"
                  rows={16}
                  placeholder="Collez ici le contenu de votre cours en format libre...

Exemple:
Les forces sont des interactions. Il y a 3 types: contact, distance, gravité.
Les forces ont magnitude et direction.

Calcul de force:
F = m × a
Avec F en Newton, m en kg, a en m/s²

Applications pratiques...
"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Le texte sera automatiquement formaté et structuré en planning de révision
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Fonctionnement</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Le texte brut sera analysé et formaté automatiquement</li>
                  <li>• Les concepts clés seront extraits intelligemment</li>
                  <li>• Un planning sur 7 jours sera généré avec des tâches structurées</li>
                  <li>• Le planning apparaîtra dans l'onglet "Planning"</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {!isProcessing && (
          <div className="bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-between">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              onClick={handleCreatePlanning}
              className="btn-primary flex items-center gap-2"
              disabled={!rawText.trim()}
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
