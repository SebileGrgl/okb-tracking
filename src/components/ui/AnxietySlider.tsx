import { ANXIETY_COLORS } from '../../utils/constants'

interface AnxietySliderProps {
  value: number
  onChange: (value: number) => void
}

export default function AnxietySlider({ value, onChange }: AnxietySliderProps) {
  const color = ANXIETY_COLORS[value] ?? '#22c55e'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-bold transition-colors duration-300"
          style={{ backgroundColor: color }}
        >
          {value}
        </div>
      </div>

      <div className="relative px-1">
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="anxiety-slider w-full"
          style={{ '--thumb-color': color } as React.CSSProperties}
        />
        <div className="flex justify-between mt-1.5 px-0.5">
          <span className="text-xs text-gray-400">Hafif</span>
          <span className="text-xs text-gray-400">Şiddetli</span>
        </div>
      </div>
    </div>
  )
}
