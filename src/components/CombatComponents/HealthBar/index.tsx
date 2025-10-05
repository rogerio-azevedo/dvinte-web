import React from 'react'
import { Rect, Group, Text } from 'react-konva'

interface HealthBarProps {
  x: number
  y: number
  width: number
  currentHealth?: number
  maxHealth?: number
  label?: string | null
  visible?: boolean
}

const HealthBar: React.FC<HealthBarProps> = ({
  x,
  y,
  width,
  currentHealth,
  maxHealth,
  label,
  visible = true,
}) => {
  if (!visible) {
    return null
  }

  // Se tem label mas não tem character, mostra só o label (sem barra de HP)
  const showOnlyLabel = label && !maxHealth

  // Se não tem nem label nem maxHealth, não mostra nada
  if (!showOnlyLabel && (!maxHealth || maxHealth <= 0)) {
    return null
  }

  const barHeight = 18
  const barY = y - barHeight - 6
  const healthPercentage = maxHealth
    ? Math.max(0, Math.min(1, (currentHealth || 0) / maxHealth))
    : 0

  // Cores baseadas na porcentagem de vida
  const getHealthColor = (percentage: number): string => {
    if (percentage > 0.6) return '#4ade80' // Verde
    if (percentage > 0.3) return '#fbbf24' // Amarelo
    return '#ef4444' // Vermelho
  }

  const healthColor = getHealthColor(healthPercentage)

  // Determina o texto a ser exibido
  let displayText = ''
  if (showOnlyLabel) {
    // Apenas label (monstro/NPC sem HP)
    displayText = label || ''
  } else {
    // Apenas HP (para personagens)
    displayText = `${currentHealth}/${maxHealth}`
  }

  return (
    <Group listening={false}>
      {/* Fundo da barra (cinza escuro) */}
      <Rect
        x={x}
        y={barY}
        width={width}
        height={barHeight}
        fill={showOnlyLabel ? '#6b7280' : '#374151'}
        cornerRadius={3}
        stroke="#1f2937"
        strokeWidth={1}
        listening={false}
      />

      {/* Barra de vida atual - só renderiza se não for apenas label */}
      {!showOnlyLabel && (
        <Rect
          x={x + 2}
          y={barY + 2}
          width={Math.max(0, (width - 4) * healthPercentage)}
          height={barHeight - 4}
          fill={healthColor}
          cornerRadius={2}
          listening={false}
        />
      )}

      {/* Sombra do texto (para melhor contraste) */}
      <Text
        x={x + 1}
        y={barY + 2}
        width={width}
        height={barHeight - 2}
        text={displayText}
        fontSize={12}
        fontFamily="Arial, sans-serif"
        fontStyle="bold"
        fill="#000000"
        align="center"
        verticalAlign="middle"
        listening={false}
      />

      {/* Texto principal */}
      <Text
        x={x}
        y={barY + 1}
        width={width}
        height={barHeight - 2}
        text={displayText}
        fontSize={12}
        fontFamily="Arial, sans-serif"
        fontStyle="bold"
        fill="#ffffff"
        align="center"
        verticalAlign="middle"
        listening={false}
      />

      {/* Borda externa */}
      <Rect
        x={x}
        y={barY}
        width={width}
        height={barHeight}
        stroke="#000000"
        strokeWidth={1}
        cornerRadius={3}
        fill="transparent"
        listening={false}
      />
    </Group>
  )
}

export default HealthBar
