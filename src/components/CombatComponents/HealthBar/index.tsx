import React from 'react'
import { Rect, Group, Text } from 'react-konva'

interface HealthBarProps {
  x: number
  y: number
  width: number
  currentHealth: number
  maxHealth: number
  visible?: boolean
}

const HealthBar: React.FC<HealthBarProps> = ({
  x,
  y,
  width,
  currentHealth,
  maxHealth,
  visible = true,
}) => {
  if (!visible || maxHealth <= 0) {
    return null
  }

  const barHeight = 16 // Aumentado para comportar o texto
  const barY = y - barHeight - 6 // Posiciona a barra acima do token
  const healthPercentage = Math.max(0, Math.min(1, currentHealth / maxHealth))

  // Cores baseadas na porcentagem de vida
  const getHealthColor = (percentage: number): string => {
    if (percentage > 0.6) return '#4ade80' // Verde
    if (percentage > 0.3) return '#fbbf24' // Amarelo
    return '#ef4444' // Vermelho
  }

  const healthColor = getHealthColor(healthPercentage)
  const healthText = `${currentHealth}/${maxHealth}`

  return (
    <Group>
      {/* Fundo da barra (cinza escuro) */}
      <Rect
        x={x}
        y={barY}
        width={width}
        height={barHeight}
        fill="#374151"
        cornerRadius={3}
        stroke="#1f2937"
        strokeWidth={1}
      />

      {/* Barra de vida atual */}
      <Rect
        x={x + 2}
        y={barY + 2}
        width={Math.max(0, (width - 4) * healthPercentage)}
        height={barHeight - 4}
        fill={healthColor}
        cornerRadius={2}
      />

      {/* Texto com os valores */}
      <Text
        x={x}
        y={barY + 2}
        width={width}
        height={barHeight - 4}
        text={healthText}
        fontSize={10}
        fontFamily="Arial"
        fill="#ffffff"
        align="center"
        verticalAlign="middle"
        stroke="#000000"
        strokeWidth={0.3}
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
      />
    </Group>
  )
}

export default HealthBar
