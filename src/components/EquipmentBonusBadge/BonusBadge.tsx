import React from 'react'

interface BonusBadgeProps {
  label: string
  value: number | string
  color?: string
}

const BonusBadge: React.FC<BonusBadgeProps> = ({
  label,
  value,
  color = 'bg-gray-100 text-gray-700',
}) => {
  // Não renderiza se o valor for 0 ou string vazia
  if (
    value === 0 ||
    value === '0' ||
    value === '' ||
    value === null ||
    value === undefined
  ) {
    return null
  }

  // Formata o valor para exibição
  const displayValue =
    typeof value === 'number' && value > 0 ? `+${value}` : value

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${color}`}
    >
      {label} {displayValue}
    </span>
  )
}

export default BonusBadge
