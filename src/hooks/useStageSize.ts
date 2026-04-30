import { useState, useEffect, type RefObject } from 'react'

export function useStageSize(ref: RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver(entries => {
      if (entries.length > 0) {
        const { width, height } = entries[0].contentRect
        setSize({ width, height })
      }
    })

    observer.observe(ref.current)

    // Initial size
    if (ref.current) {
      setSize({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      })
    }

    return () => observer.disconnect()
  }, [ref])

  return size
}
