import LogBoard from '../../components/CombatComponents/LogBoard'
import MobileBottomSheet from './MobileBottomSheet'

interface LogSheetProps {
  open: boolean
  onClose: () => void
}

export default function LogSheet({ open, onClose }: LogSheetProps) {
  return (
    <MobileBottomSheet open={open} title="Logs" onClose={onClose}>
      <div className="flex min-h-0 flex-1 flex-col px-3 py-4 pb-8">
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg">
          <LogBoard />
        </div>
      </div>
    </MobileBottomSheet>
  )
}
