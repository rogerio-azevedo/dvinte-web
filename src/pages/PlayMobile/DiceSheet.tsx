import GenericDices from '../../components/CombatComponents/GenericDices'
import MobileBottomSheet from './MobileBottomSheet'

interface DiceSheetProps {
  open: boolean
  onClose: () => void
}

export default function DiceSheet({ open, onClose }: DiceSheetProps) {
  return (
    <MobileBottomSheet
      open={open}
      title="Lançador de dados"
      onClose={onClose}
      showHeaderTitle={false}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 pb-6">
        <GenericDices variant="mobile" />
      </div>
    </MobileBottomSheet>
  )
}
