import { useState, useRef, useEffect } from 'react'
import { SendIcon, BotIcon, UserIcon, Loader2Icon } from 'lucide-react'
import { ChatMessage, Planning, Library } from '../types'
import { predefinedPlans } from '../data/plans'
import { parseRawText } from '../utils/textParser'
import { findConfigByKeyword, createPlanningFromConfig } from '../utils/planningManager'
import { getAllCourses } from '../utils/courseLinker'

interface AssistantTabProps {
  chatHistory: ChatMessage[]
  onUpdateChatHistory: (history: ChatMessage[]) => void
  onLoadPlanning: (planning: Planning) => void
  library: Library
}

export function AssistantTab({ chatHistory, onUpdateChatHistory, onLoadPlanning, library }: AssistantTabProps) {
  const [inputMessage, setInputMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingMessage, setGeneratingMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const detectPlanningRequest = (message: string): { planning: Planning | null; isNewChapter: boolean; chapterName: string | null } => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('contrôle') || lowerMessage.includes('controle')) {
      if (
        lowerMessage.includes('chapitre 1') ||
        lowerMessage.includes('ch1') ||
        lowerMessage.includes('nombres') ||
        lowerMessage.includes('calculs')
      ) {
        return { 
          planning: predefinedPlans['chapitre-1-nombres-et-calculs'], 
          isNewChapter: false,
          chapterName: null
        }
      }
      
      const chapterMatch = message.match(/chapitre\s*(\d+|[IVX]+)|ch\s*(\d+)|chap\s*(\d+)/i)
      if (chapterMatch) {
        const chapterNum = chapterMatch[1] || chapterMatch[2] || chapterMatch[3]
        return {
          planning: null,
          isNewChapter: true,
          chapterName: `Chapitre ${chapterNum}`
        }
      }
      
      const topicMatch = message.match(/contrôle?\s+(?:sur\s+)?(?:le\s+)?(.+?)(?:\.|$)/i)
      if (topicMatch && topicMatch[1]) {
        const topic = topicMatch[1].trim()
        if (topic.length > 3 && topic.length < 100) {
          return {
            planning: null,
            isNewChapter: true,
            chapterName: topic.charAt(0).toUpperCase() + topic.slice(1)
          }
        }
      }
    }
    
    return { planning: null, isNewChapter: false, chapterName: null }
  }

  const generateResponse = (userMessage: string, planningName?: string): string => {
    const detected = detectPlanningRequest(userMessage)
    
    if (detected.planning || detected.isNewChapter) {
      const name = planningName || detected.chapterName || 'ce chapitre'
      return `J'ai détecté que vous préparez un contrôle sur "${name}". 
      
Je viens de générer un planning de révision sur 7 jours dans l'onglet Planning ! 📅

Ce planning comprend :
- 7 jours de révision structurés
- Des tâches quotidiennes détaillées
- Une progression que vous pouvez suivre

Allez voir l'onglet "Planning" pour découvrir votre plan de révision personnalisé. Bon courage ! 💪`
    }

    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      return `Bonjour ! 👋 Je suis votre assistant de révision en mathématiques.

Pour obtenir un planning de révision, dites-moi simplement sur quel chapitre vous avez un contrôle. Par exemple :
- "J'ai un contrôle sur le chapitre 1"
- "Contrôle nombres et calculs"
- "Je dois réviser le ch1"

Je chargerai automatiquement un planning de révision adapté !`
    }

    if (lowerMessage.includes('aide') || lowerMessage.includes('help') || lowerMessage.includes('comment')) {
      return `Je peux vous aider à obtenir des plannings de révision ! 

Pour cela, mentionnez simplement le chapitre que vous devez réviser dans votre message. Par exemple :
- "Contrôle sur le chapitre 1"
- "Je révise les nombres et calculs"

Actuellement, je peux générer des plannings pour :
- Chapitre 1 – Nombres et calculs

D'autres chapitres peuvent être ajoutés en éditant le fichier src/data/plans.ts`
    }

    if (lowerMessage.includes('merci')) {
      return `De rien ! 😊 N'hésitez pas si vous avez besoin d'autres plannings de révision. Bon courage pour vos révisions !`
    }

    return `Je n'ai pas bien compris votre demande. 

Pour obtenir un planning de révision, mentionnez le chapitre sur lequel vous avez un contrôle. Par exemple : "Contrôle sur le chapitre 1".

Tapez "aide" pour plus d'informations.`
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    onUpdateChatHistory([...chatHistory, userMessage])
    setInputMessage('')

    // Always show 10-second loader with animated messages
    setIsGenerating(true)
    
    const generatingMessages = [
      'Traitement...',
      'Analyse du message...',
      'Recherche d\'informations...',
      'Préparation de la réponse...',
      'Génération en cours...',
      'Finalisation...',
    ]
    
    const totalDuration = 10000
    const messageInterval = totalDuration / generatingMessages.length
    
    let messageIndex = 0
    setGeneratingMessage(generatingMessages[0])
    
    const intervalId = setInterval(() => {
      messageIndex++
      if (messageIndex < generatingMessages.length) {
        setGeneratingMessage(generatingMessages[messageIndex])
      }
    }, messageInterval)
    
    // Wait for 10 seconds
    await new Promise(resolve => setTimeout(resolve, totalDuration))
    
    clearInterval(intervalId)

    // Process the message and generate response
    const config = findConfigByKeyword(inputMessage)
    
    if (config) {
      const allCourses = getAllCourses(library.tree)
      const selectedCourses = allCourses.filter(c => config.courseIds.includes(c.id))
      const newPlanning = createPlanningFromConfig(config, selectedCourses)
      
      onLoadPlanning(newPlanning)
      
      const responseContent = generateResponse(inputMessage, newPlanning.chapterName)
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
      }
      onUpdateChatHistory([...chatHistory, userMessage, assistantMessage])
    } else {
      const detected = detectPlanningRequest(inputMessage)
      
      if (detected.planning) {
        onLoadPlanning(detected.planning)
        
        const responseContent = generateResponse(inputMessage)
        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date().toISOString(),
        }
        onUpdateChatHistory([...chatHistory, userMessage, assistantMessage])
      } else if (detected.isNewChapter) {
        const defaultContent = `Révision ${detected.chapterName}

Concepts principaux à maîtriser
Exercices et applications pratiques
Méthodes de résolution
Formules et théorèmes clés`
        
        const newPlanning = parseRawText(defaultContent, detected.chapterName || undefined)
        onLoadPlanning(newPlanning)
        
        const responseContent = generateResponse(inputMessage, newPlanning.chapterName)
        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date().toISOString(),
        }
        onUpdateChatHistory([...chatHistory, userMessage, assistantMessage])
      } else {
        const responseContent = generateResponse(inputMessage)
        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date().toISOString(),
        }
        onUpdateChatHistory([...chatHistory, userMessage, assistantMessage])
      }
    }
    
    setIsGenerating(false)
    setGeneratingMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="bg-white rounded-t-lg shadow-md p-4 border-b">
        <h2 className="text-xl font-bold text-gray-900">Assistant de Révision</h2>
        <p className="text-sm text-gray-600 mt-1">
          Demandez un planning en mentionnant votre contrôle (ex: "contrôle chapitre 1")
        </p>
      </div>

      <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && !isGenerating && (
          <div className="text-center py-12">
            <BotIcon className="w-16 h-16 mx-auto text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Bienvenue dans l'Assistant !
            </h3>
            <p className="text-gray-600 mb-4">
              Commencez par me dire sur quel chapitre vous avez un contrôle.
            </p>
            <div className="bg-white rounded-lg shadow p-4 max-w-md mx-auto text-left">
              <p className="text-sm text-gray-700 mb-2">Exemples de messages :</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "Contrôle sur le chapitre 1"</li>
                <li>• "Je dois réviser les nombres et calculs"</li>
                <li>• "Contrôle ch1 la semaine prochaine"</li>
              </ul>
            </div>
          </div>
        )}

        {chatHistory.map(message => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <BotIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-xl px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-800 shadow'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
              <div className="flex items-center gap-4">
                <Loader2Icon className="w-10 h-10 text-primary-600 animate-spin flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Traitement en cours...
                  </h4>
                  <p className="text-sm text-primary-600 animate-pulse">
                    {generatingMessage}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-700 h-full rounded-full animate-pulse" 
                       style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white rounded-b-lg shadow-md p-4 border-t">
        <div className="flex gap-3">
          <textarea
            className="flex-1 input-field resize-none"
            rows={2}
            placeholder="Tapez votre message... (ex: contrôle chapitre 1)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={sendMessage}
            className="btn-primary self-end"
            disabled={!inputMessage.trim() || isGenerating}
          >
            {isGenerating ? (
              <Loader2Icon className="w-5 h-5 animate-spin" />
            ) : (
              <SendIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
