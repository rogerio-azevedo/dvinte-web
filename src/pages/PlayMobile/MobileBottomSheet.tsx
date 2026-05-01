import type { ReactNode } from 'react'

interface MobileBottomSheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  /**
   * Altura principal do drawer (tailwind). Padrão ~75% da viewport para o miolo
   * poder usar `flex-1` / scroll sem colapsar.
   */
  heightClass?: string
  /** Teto opcional menor que height (ex.: `max-h-[92dvh]`) quando precisar limitar em telas baixas. */
  maxHeightClass?: string
  /** Se false, o título some da barra (fica sr-only + Fechar) — evita duplicar com o conteúdo. */
  showHeaderTitle?: boolean
}

/**
 * Drawer tipo bottom sheet; altura padrão maior no mobile para caber selects e dados.
 * O `<aside>` usa altura preferencial (`h-*`) porque com só `max-h` + `min-h` + `flex-1`
 * nos filhos o flex shrink-wrapping faz o painel colapsar próximo ao mínimo.
 */
export default function MobileBottomSheet({
  open,
  title,
  onClose,
  children,
  heightClass = 'h-[75dvh]',
  maxHeightClass = 'max-h-[92dvh]',
  showHeaderTitle = true,
}: MobileBottomSheetProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[45] flex flex-col justify-end bg-black/45"
      role="presentation"
      data-playmobile-sheet="true"
      onClick={onClose}
      onKeyDown={e => e.key === 'Escape' && onClose()}
    >
      <aside
        className={`animate-in fade-in slide-in-from-bottom duration-200 flex w-full shrink-0 flex-col overflow-hidden rounded-t-2xl border border-stone-200/80 bg-stone-50 shadow-[0_-8px_40px_rgba(0,0,0,0.25)] ${heightClass} ${maxHeightClass} min-h-[36dvh]`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="playmobile-sheet-title"
        onClick={e => e.stopPropagation()}
      >
        <div
          className={`flex shrink-0 items-center border-b border-stone-200/90 bg-white/95 px-3 py-2 ${
            showHeaderTitle ? 'justify-between' : 'justify-end'
          }`}
        >
          <h2
            id="playmobile-sheet-title"
            className={
              showHeaderTitle
                ? 'text-base font-semibold text-slate-800'
                : 'sr-only'
            }
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-[#8e0e00] hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8e0e00]/40"
          >
            Fechar
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </aside>
    </div>
  )
}
