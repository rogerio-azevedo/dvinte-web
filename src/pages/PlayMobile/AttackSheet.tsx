/* eslint-disable @typescript-eslint/no-explicit-any */
import ArmoryDelay from '../../components/CombatComponents/ArmoryDelay'
import LogBoard from '../../components/CombatComponents/LogBoard'
import MobileBottomSheet from './MobileBottomSheet'
import type { Character, WeaponItem } from '../Play/interfaces'

interface AttackSheetProps {
  open: boolean
  onClose: () => void
  character?: Character
  weapons: WeaponItem[]
  user: any
  getCharacter: (user: { id: number }) => Promise<any>
}

export default function AttackSheet({
  open,
  onClose,
  character,
  weapons,
  user,
  getCharacter,
}: AttackSheetProps) {
  return (
    <MobileBottomSheet open={open} title="Painel de Ataque" onClose={onClose}>
      <div className="flex min-h-0 flex-1 flex-col px-2 py-2">
        <div className="shrink-0 border-b border-stone-200/80 pb-2">
          <ArmoryDelay
            character={character}
            weapons={weapons ?? []}
            loadChar={async () => {
              if (!user) return
              await getCharacter({ id: user.id })
            }}
          />
        </div>
        <h3 className="shrink-0 pt-2 text-center text-xs font-semibold text-slate-600">
          Painel Logs
        </h3>
        <div className="relative mt-1.5 min-h-0 flex-1">
          <div className="absolute inset-0 min-h-[120px] overflow-hidden rounded-lg bg-stone-100/90">
            <LogBoard />
          </div>
        </div>
      </div>
    </MobileBottomSheet>
  )
}
