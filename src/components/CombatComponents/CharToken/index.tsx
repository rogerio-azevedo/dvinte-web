import { useEffect, useRef, useState } from 'react'
import { Image, Transformer, Group } from 'react-konva'
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
  const shapeRef = useRef<Konva.Image>(null)
  const trRef = useRef<Konva.Transformer>(null)
  const groupRef = useRef<Konva.Group>(null)

  // Estados para posição em tempo real
  const [currentX, setCurrentX] = useState(x)
  const [currentY, setCurrentY] = useState(y)

  const grid = 68 // Corrigido para usar o grid correto

  // Atualiza posição quando as props mudam
  useEffect(() => {
    setCurrentX(x)
    setCurrentY(y)
  }, [x, y])

  async function handleDragStart(e: Konva.KonvaEventObject<DragEvent>) {
    e.target.setAttrs({
      shadowOffset: {
        x: 15,
        y: 15,
      },
      scaleX: 1.1,
      scaleY: 1.1,
    })
  }

  // Atualiza posição em tempo real durante o drag
  function handleDragMove(e: Konva.KonvaEventObject<DragEvent>) {
    setCurrentX(e.target.x())
    setCurrentY(e.target.y())
  }

  async function handleDragEnd(e: Konva.KonvaEventObject<DragEvent>) {
    const newX = Math.round(e.target.x() / grid) * grid
    const newY = Math.round(e.target.y() / grid) * grid

    // Verifica se a posição está ocupada (se a função foi fornecida)
    if (isPositionOccupied && isPositionOccupied(newX, newY, id)) {
      // Se estiver ocupada, volta para a posição original
      setCurrentX(x)
      setCurrentY(y)
      if (shapeRef.current) {
        shapeRef.current.to({
          duration: 0.3,
          easing: Konva.Easings.ElasticEaseOut,
          scaleX: 1,
          scaleY: 1,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
        })
      }
      return
    }

    // Se a posição estiver livre, move para a nova posição
    setCurrentX(newX)
    setCurrentY(newY)
    if (shapeRef.current) {
      shapeRef.current.to({
        duration: 0.7,
        easing: Konva.Easings.ElasticEaseOut,
        scaleX: 1,
        scaleY: 1,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
      })
    }

    const tokenData = {
      id: Number(e.target.id()) || e.target.id(),
      x: newX,
      y: newY,
    }

    try {
      await api.put('chartokens', tokenData)
    } catch (error) {
      console.error('❌ Token update failed:', error)
    }
  }

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  async function handleTransform(e: Konva.KonvaEventObject<Event>) {
    const tokenData = {
      id: Number(e.target.id()) || e.target.id(),
      x: e.target.x(),
      y: e.target.y(),
      width: e.target.width() * e.target.scaleX(),
      height: e.target.height() * e.target.scaleY(),
      rotation: e.target.rotation(),
    }

    // Salva no banco (o backend já emite via Socket.IO)
    await api.put('chartokens', tokenData)
  }

  const [tokenImg] = useImage(image)

  return (
    <Group
      ref={groupRef}
      x={currentX}
      y={currentY}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      {/* Token principal */}
      <Image
        id={id.toString()}
        x={0} // Relativo ao grupo
        y={0} // Relativo ao grupo
        image={tokenImg}
        width={width}
        height={height}
        scaleX={1}
        rotation={rotation}
        shadowOpacity={0.6}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onTransformEnd={handleTransform}
        shadowBlur={10}
        innerRadius={20}
        outerRadius={40}
        opacity={opacity}
      />

      {/* Barra de vida - sempre sincronizada */}
      {character && character.health > 0 && (
        <HealthBar
          x={0} // Relativo ao grupo
          y={0} // Relativo ao grupo
          width={width}
          currentHealth={character.health_now}
          maxHealth={character.health}
          visible={true}
        />
      )}

      {/* Transformer */}
      {isSelected && <Transformer ref={trRef} />}
    </Group>
  )
}
