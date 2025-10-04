import { useEffect, useRef, useState } from 'react'
import { Group, Image, Transformer } from 'react-konva'
import Konva from 'konva'
import useImage from 'use-image'

import api from '../../../services/api'
import HealthBar from '../HealthBar'

interface CharTokenProps {
  image: string
  id: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  onSelect: () => void
  isSelected: boolean | undefined
  draggable: boolean
  opacity: number
  isPositionOccupied?: (
    x: number,
    y: number,
    excludeTokenId?: number
  ) => boolean
  character?: {
    id: number
    name: string
    level: number
    health: number
    health_now: number
    user_id: number
  }
}

export default function CharToken({
  image,
  id,
  x,
  y,
  width,
  height,
  rotation,
  onSelect,
  isSelected,
  draggable,
  opacity,
  isPositionOccupied,
  character,
}: CharTokenProps) {
  const groupRef = useRef<Konva.Group>(null)
  const trRef = useRef<Konva.Transformer>(null)

  // Estado para posição da barra durante o drag
  const [dragBarX, setDragBarX] = useState<number | null>(null)
  const [dragBarY, setDragBarY] = useState<number | null>(null)

  const grid = 75

  // Reseta posição temporária quando as props x/y mudam (atualização do socket)
  useEffect(() => {
    if (dragBarX !== null || dragBarY !== null) {
      setDragBarX(null)
      setDragBarY(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y])

  async function handleDragStart(e: Konva.KonvaEventObject<DragEvent>) {
    e.target.setAttrs({
      shadowOffset: {
        x: 15,
        y: 15,
      },
      scaleX: 1.05,
      scaleY: 1.05,
    })
  }

  function handleDragMove(e: Konva.KonvaEventObject<DragEvent>) {
    const offsetX = width / 2
    const offsetY = height / 2

    // Posição do Group durante o drag
    const groupX = e.target.x()
    const groupY = e.target.y()

    // Converte para coordenadas do banco (canto superior esquerdo)
    const dbX = groupX - offsetX
    const dbY = groupY - offsetY

    // Atualiza posição temporária da barra
    setDragBarX(dbX)
    setDragBarY(dbY)
  }

  async function handleDragEnd(e: Konva.KonvaEventObject<DragEvent>) {
    const offsetX = width / 2
    const offsetY = height / 2

    // Posição ajustada do Group no canvas
    const groupX = e.target.x()
    const groupY = e.target.y()

    // Converte de volta para coordenadas do banco (remove o offset)
    const dbX = groupX - offsetX
    const dbY = groupY - offsetY

    // Aplica snap to grid nas coordenadas do banco
    const snappedDbX = Math.round(dbX / grid) * grid
    const snappedDbY = Math.round(dbY / grid) * grid

    // Converte de volta para posição do Group (adiciona o offset)
    const snappedGroupX = snappedDbX + offsetX
    const snappedGroupY = snappedDbY + offsetY

    // Verifica se a posição está ocupada (usando coordenadas do banco)
    if (isPositionOccupied && isPositionOccupied(snappedDbX, snappedDbY, id)) {
      // Se estiver ocupada, volta para a posição original
      const originalAdjustedX = x + offsetX
      const originalAdjustedY = y + offsetY
      e.target.to({
        duration: 0.3,
        easing: Konva.Easings.ElasticEaseOut,
        scaleX: 1,
        scaleY: 1,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        x: originalAdjustedX,
        y: originalAdjustedY,
      })
      // Reseta posição temporária imediatamente (não houve mudança)
      setDragBarX(null)
      setDragBarY(null)
      return
    }

    // Atualiza a barra para a posição final snapped
    setDragBarX(snappedDbX)
    setDragBarY(snappedDbY)

    // Se a posição estiver livre, move para a nova posição
    e.target.to({
      duration: 0.7,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
      x: snappedGroupX,
      y: snappedGroupY,
    })

    // NÃO reseta aqui - deixa o useEffect resetar quando x/y forem atualizados pelo socket

    // Salva coordenadas do banco (sem offset)
    const tokenData = {
      id: Number(e.target.id()) || e.target.id(),
      x: snappedDbX,
      y: snappedDbY,
    }

    try {
      await api.put('chartokens', tokenData)
    } catch (error) {
      console.error('❌ Token update failed:', error)
    }
  }

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  async function handleTransform(e: Konva.KonvaEventObject<Event>) {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    // Calcula novo width e height
    const newWidth = width * scaleX
    const newHeight = height * scaleY

    // Calcula offset baseado nas novas dimensões
    const offsetX = newWidth / 2
    const offsetY = newHeight / 2

    // Converte de volta para coordenadas do banco (remove o offset)
    const dbX = node.x() - offsetX
    const dbY = node.y() - offsetY

    const tokenData = {
      id: Number(node.id()) || node.id(),
      x: dbX,
      y: dbY,
      width: newWidth,
      height: newHeight,
      rotation: node.rotation(),
    }

    // Salva no banco (o backend já emite via Socket.IO)
    await api.put('chartokens', tokenData)
  }

  const [tokenImg] = useImage(image)

  // Calcula offset para rotação no centro
  const offsetX = width / 2
  const offsetY = height / 2

  // Centro do token no canvas (onde o Group será posicionado)
  const tokenCenterX = x + offsetX
  const tokenCenterY = y + offsetY

  // Posição da barra: usa posição temporária durante drag, senão usa props
  const barX = dragBarX !== null ? dragBarX : x
  const barY = dragBarY !== null ? dragBarY : y

  return (
    <>
      {/* Token - Group permite rotação no centro, hitbox exata do token */}
      <Group
        id={id.toString()}
        x={tokenCenterX}
        y={tokenCenterY}
        offsetX={offsetX}
        offsetY={offsetY}
        rotation={rotation}
        draggable={draggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransform}
        ref={groupRef}
      >
        <Image
          image={tokenImg}
          width={width}
          height={height}
          shadowOpacity={0.6}
          shadowBlur={10}
          shadowOffsetX={5}
          shadowOffsetY={5}
          opacity={opacity}
        />
      </Group>

      {/* Barra de vida - FORA do Group, sempre horizontal e acima do token */}
      {character && character.health > 0 && opacity > 0.1 && (
        <HealthBar
          x={barX}
          y={barY}
          width={width}
          currentHealth={character.health_now}
          maxHealth={character.health}
          visible={true}
        />
      )}

      {/* Transformer */}
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}
