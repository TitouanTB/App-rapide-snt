import { useEffect } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CheckCircle2Icon, CircleIcon, CalendarIcon, RefreshCwIcon } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Planning } from '../types'

interface PlanningTabProps {
  planning: Planning | null
  onUpdatePlanning: (planning: Planning) => void
}

export function PlanningTab({ planning, onUpdatePlanning }: PlanningTabProps) {
  useEffect(() => {
    if (planning) {
      const allCompleted = planning.days.every(day => day.completed)
      const someCompleted = planning.days.some(day => day.completed)
      
      if (allCompleted && someCompleted) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#818cf8', '#a5b4fc'],
        })
      }
    }
  }, [planning])

  const toggleDayCompleted = (dayNum: number) => {
    if (!planning) return

    const updatedDays = planning.days.map(day =>
      day.dayNum === dayNum ? { ...day, completed: !day.completed } : day
    )

    onUpdatePlanning({
      ...planning,
      days: updatedDays,
    })
  }

  const resetPlanning = () => {
    if (!planning) return

    const updatedDays = planning.days.map(day => ({
      ...day,
      completed: false,
    }))

    onUpdatePlanning({
      ...planning,
      days: updatedDays,
    })
  }

  if (!planning) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 p-8">
        <div className="text-center max-w-md">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg mb-2">Aucun planning sélectionné</p>
          <p className="text-sm">
            Allez dans l'Assistant et tapez "contrôle chapitre 1" pour charger un planning de révision.
          </p>
        </div>
      </div>
    )
  }

  const completedCount = planning.days.filter(day => day.completed).length
  const totalDays = planning.days.length
  const progress = (completedCount / totalDays) * 100

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{planning.chapterName}</h2>
            <p className="text-sm text-gray-600 mt-1">Plan de révision sur 7 jours</p>
          </div>
          <button
            onClick={resetPlanning}
            className="btn-secondary flex items-center gap-2"
            title="Réinitialiser le planning"
          >
            <RefreshCwIcon className="w-4 h-4" />
            Réinitialiser
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progression: {completedCount}/{totalDays} jours
            </span>
            <span className="text-sm font-medium text-primary-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {planning.days.map(day => (
          <div
            key={day.dayNum}
            className={`card transition-all duration-200 ${
              day.completed ? 'bg-primary-50 border-primary-300' : 'hover:shadow-lg'
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleDayCompleted(day.dayNum)}
                className="mt-1 focus:outline-none"
              >
                {day.completed ? (
                  <CheckCircle2Icon className="w-6 h-6 text-primary-600" />
                ) : (
                  <CircleIcon className="w-6 h-6 text-gray-400 hover:text-primary-600 transition-colors" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold text-gray-900">Jour {day.dayNum}</span>
                  <span className="text-sm text-gray-600">
                    {format(new Date(day.date), 'EEEE d MMMM yyyy', { locale: fr })}
                  </span>
                  {day.completed && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                      Terminé
                    </span>
                  )}
                </div>

                <ul className="space-y-2">
                  {day.tasks.map((task, index) => (
                    <li
                      key={index}
                      className={`text-sm flex items-start gap-2 ${
                        day.completed ? 'text-gray-600 line-through' : 'text-gray-800'
                      }`}
                    >
                      <span className="text-primary-600 font-bold">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {completedCount === totalDays && totalDays > 0 && (
        <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-300 text-center p-8">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-primary-900 mb-2">
            Félicitations !
          </h3>
          <p className="text-gray-700">
            Vous avez terminé tous les jours de révision. Vous êtes prêt(e) pour le contrôle !
          </p>
        </div>
      )}
    </div>
  )
}
