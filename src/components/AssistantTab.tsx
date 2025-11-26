import { useState, useRef, useEffect } from 'react'
import { SendIcon, BotIcon, UserIcon } from 'lucide-react'
import { ChatMessage, Planning } from '../types'
import { predefinedPlans } from '../data/plans'

interface AssistantTabProps {
  chatHistory: ChatMessage[]
  onUpdateChatHistory: (history: ChatMessage[]) => void
  onLoadPlanning: (planning: Planning) => void
}

export function AssistantTab({ chatHistory, onUpdateChatHistory, onLoadPlanning }: AssistantTabProps) {
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const detectPlanningRequest = (message: string): Planning | null => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('contrôle') || lowerMessage.includes('controle')) {
      if (
        lowerMessage.includes('chapitre 1') ||
        lowerMessage.includes('ch1') ||
        lowerMessage.includes('nombres') ||
        lowerMessage.includes('calculs')
      ) {
        return predefinedPlans['chapitre-1-nombres-et-calculs']
      }
    }
    
    return null
  }

  const generateResponse = (userMessage: string): string => {
    const detectedPlanning = detectPlanningRequest(userMessage)
    
    if (detectedPlanning) {
      return `J'ai détecté que vous préparez un contrôle sur "${detectedPlanning.chapterName}". 
      
Je viens de charger un planning de révision sur 7 jours dans l'onglet Planning ! 📅

Ce planning comprend :
- ${detectedPlanning.days.length} jours de révision
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

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    const detectedPlanning = detectPlanningRequest(inputMessage)
    if (detectedPlanning) {
      onLoadPlanning(detectedPlanning)
    }

    const responseContent = generateResponse(inputMessage)
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString(),
    }

    onUpdateChatHistory([...chatHistory, userMessage, assistantMessage])
    setInputMessage('')
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
        {chatHistory.length === 0 && (
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
            disabled={!inputMessage.trim()}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
