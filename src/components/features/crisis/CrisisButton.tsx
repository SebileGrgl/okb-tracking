import { useNavigate, useLocation } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../../utils/cn'

export default function CrisisButton() {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/kriz') return null

  return (
    <button
      onClick={() => navigate('/kriz')}
      className={cn(
        'fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40',
        'flex items-center gap-2 pl-3 pr-4 py-2.5',
        'bg-amber-500 hover:bg-amber-600 active:scale-95',
        'text-white text-sm font-medium rounded-full shadow-lg',
        'transition-all duration-150',
      )}
      aria-label="Kriz modu"
    >
      <AlertCircle size={17} />
      <span>Çok zorlanıyorum</span>
    </button>
  )
}
