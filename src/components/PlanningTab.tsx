import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  CheckCircle2Icon,
  CircleIcon,
  CalendarIcon,
  RefreshCwIcon,
  Trash2Icon,
  ChevronDownIcon,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { Planning } from '../types'
import {
  getPlanningDayStatus,
  togglePlanningDay,
  resetPlanning,
  getPlanningCompletionPercentage,
  isPlanningFullyCompleted,
} from '../utils/planningManager'

interface PlanningTabProps {
  plannings: Planning[]
  activePlanningId: string | null
  onSetActivePlanning: (planningId: string | null) => void
  onDeletePlanning: (planningId: string) => void
}

export function PlanningTab({
  plannings,
  activePlanningId,
  onSetActivePlanning,
  onDeletePlanning,
}: PlanningTabProps) {
  const [, setRefreshKey] = useState(0)

  const activePlanning = plannings.find(p => p.id === activePlanningId) || null

  useEffect(() => {
    if (activePlanning && isPlanningFullyCompleted(activePlanning)) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#818cf8', '#a5b4fc'],
      })
    }
  }, [activePlanning])

  const handleToggleDay = (dayNum: number) => {
    if (!activePlanning) return
    togglePlanningDay(activePlanning.id, dayNum)
    setRefreshKey(k => k + 1)
  }

  const handleResetPlanning = () => {
    if (!activePlanning) return
    if (confirm(`Voulez-vous vraiment réinitialiser le planning "${activePlanning.chapterName}" ?`)) {
      resetPlanning(activePlanning.id)
      setRefreshKey(k => k + 1)
    }
  }

  const handleDeletePlanning = () => {
    if (!activePlanning) return
    if (confirm(`Voulez-vous vraiment supprimer le planning "${activePlanning.chapterName}" ?`)) {
      onDeletePlanning(activePlanning.id)
    }
  }

  if (plannings.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 p-8">
        <div className="text-center max-w-md">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg mb-2">Aucun planning disponible</p>
          <p className="text-sm">
            Utilisez le panneau Admin (triple-clic sur le logo) pour créer votre premier planning.
          </p>
        </div>
      </div>
    )
  }

  if (!activePlanning) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 p-8">
        <div className="text-center max-w-md">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg mb-2">Sélectionnez un planning ci-dessous</p>
          <div className="mt-6 space-y-2">
            {plannings.map(planning => (
              <button
                key={planning.id}
                onClick={() => onSetActivePlanning(planning.id)}
                className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{planning.chapterName}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(planning.createdAt), "d MMMM yyyy 'à' HH:mm", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary-600">
                      {getPlanningCompletionPercentage(planning)}%
                    </span>
                    <p className="text-xs text-gray-500">complété</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const completionPercentage = getPlanningCompletionPercentage(activePlanning)
  const isFullyCompleted = isPlanningFullyCompleted(activePlanning)
  const completedCount = activePlanning.days.filter(day =>
    getPlanningDayStatus(activePlanning.id, day.dayNum)
  ).length

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Planning actif
        </label>
        <div className="relative">
          <select
            className="input-field w-full appearance-none pr-10"
            value={activePlanningId || ''}
            onChange={(e) => onSetActivePlanning(e.target.value || null)}
          >
            {plannings.map(planning => (
              <option key={planning.id} value={planning.id}>
                {planning.chapterName} - {getPlanningCompletionPercentage(planning)}% complété
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{activePlanning.chapterName}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Plan de révision sur {activePlanning.days.length} jours
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Créé le {format(new Date(activePlanning.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleResetPlanning}
              className="btn-secondary flex items-center gap-2 text-sm"
              title="Réinitialiser ce planning"
            >
              <RefreshCwIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
            <button
              onClick={handleDeletePlanning}
              className="btn-secondary flex items-center gap-2 text-sm text-red-600 hover:bg-red-50"
              title="Supprimer ce planning"
            >
              <Trash2Icon className="w-4 h-4" />
              <span className="hidden sm:inline">Supprimer</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progression: {completedCount}/{activePlanning.days.length} jours
            </span>
            <span className="text-sm font-medium text-primary-700">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {activePlanning.linkedCourseIds.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-800">
              📚 Ce planning est lié à <strong>{activePlanning.linkedCourseIds.length}</strong> cours
              {activePlanning.linkedImages.length > 0 &&
                ` et contient ${activePlanning.linkedImages.length} image(s)`}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {activePlanning.days.map(day => {
          const isDayCompleted = getPlanningDayStatus(activePlanning.id, day.dayNum)
          return (
            <div
              key={day.dayNum}
              className={`card transition-all duration-200 ${
                isDayCompleted ? 'bg-primary-50 border-primary-300' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleDay(day.dayNum)}
                  className="mt-1 focus:outline-none"
                >
                  {isDayCompleted ? (
                    <CheckCircle2Icon className="w-6 h-6 text-primary-600" />
                  ) : (
                    <CircleIcon className="w-6 h-6 text-gray-400 hover:text-primary-600 transition-colors" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-lg font-bold text-gray-900">Jour {day.dayNum}</span>
                    <span className="text-sm text-gray-600">
                      {format(new Date(day.date), 'EEEE d MMMM yyyy', { locale: fr })}
                    </span>
                    {isDayCompleted && (
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
                          isDayCompleted ? 'text-gray-600 line-through' : 'text-gray-800'
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
          )
        })}
      </div>

      {activePlanning.linkedImages.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📸 Images liées ({activePlanning.linkedImages.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {activePlanning.linkedImages.map(image => (
              <div key={image.id} className="border rounded-lg overflow-hidden">
                <img
                  src={image.dataUrl}
                  alt={image.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 bg-gray-50">
                  <p className="text-xs text-gray-600 truncate">{image.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isFullyCompleted && (
        <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-300 text-center p-8">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-primary-900 mb-2">Félicitations !</h3>
          <p className="text-gray-700">
            Vous avez terminé tous les jours de révision. Vous êtes prêt(e) pour le contrôle !
          </p>
        </div>
      )}
    </div>
  )
}
