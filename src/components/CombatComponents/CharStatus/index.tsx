import React from 'react'

interface CharacterStatus {
  fortitude: number
  reflex: number
  will: number
  charInit: number
  melee: number
  ranged: number
  totalCa: number
  health: number
  healthNow: number
}

interface CharStatusProps {
  charStatus: CharacterStatus | null
}

interface StatItem {
  label: string
  value: number
}

const CharStatus: React.FC<CharStatusProps> = ({ charStatus }) => {
  const rows: StatItem[][] = [
    [
      { label: 'Fortitude', value: charStatus?.fortitude ?? 0 },
      { label: 'Reflexos', value: charStatus?.reflex ?? 0 },
      { label: 'Vontade', value: charStatus?.will ?? 0 },
    ],
    [
      { label: 'Iniciativa', value: charStatus?.charInit ?? 0 },
      { label: 'Melee', value: charStatus?.melee ?? 0 },
      { label: 'Ranged', value: charStatus?.ranged ?? 0 },
    ],
    [
      { label: 'CA', value: charStatus?.totalCa ?? 0 },
      { label: 'PV', value: charStatus?.health ?? 0 },
      { label: 'PV Atual', value: charStatus?.healthNow ?? 0 },
    ],
  ]

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-sm border border-stone-200">
      <div className="flex flex-col gap-3">
        {rows.map((group, gi) => (
          <div key={gi} className="grid grid-cols-3 gap-2">
            {group.map(stat => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-[11px] font-semibold text-[#8e0e00]">
                  {stat.label}
                </span>
                <div className="flex h-9 w-full items-center justify-center rounded-md border border-stone-200 bg-stone-50 text-base font-bold text-[#8e0e00] shadow-sm">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CharStatus
