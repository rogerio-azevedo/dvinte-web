import { useEffect, useRef } from 'react'
import { Image, Transformer } from 'react-konva'
import Konva from 'konva'
import useImage from 'use-image'

import api from '../../../services/api'

interface CharTokenProps {
  image: string
  id: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  onSelect: () => void
  isSelected: boolean
  draggable: boolean
  opacity: number
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
}: CharTokenProps) {
  const shapeRef = useRef<any>(null)
  const trRef = useRef<any>(null)

  const grid = 1

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

  async function handleDragEnd(e: Konva.KonvaEventObject<DragEvent>) {
    e.target.to({
      duration: 0.7,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 5,
      shadowOffsetY: 5,

      x: Math.round(e.target.x() / grid) * grid,
      y: Math.round(e.target.y() / grid) * grid,
    })

    const tokenData = {
      id: Number(e.target.id()) || e.target.id(),
      x: e.target.x(),
      y: e.target.y(),
    }

    // Salva no banco (o backend já emite via Socket.IO)
    await api.put('chartokens', tokenData)
  }

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
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
    <>
      <Image
        draggable={draggable}
        id={id.toString()}
        x={x}
        y={y}
        image={tokenImg}
        width={width}
        height={height}
        scaleX={1}
        // offsetX={68 / 2}
        // offsetY={68 / 2}
        rotation={rotation}
        shadowOpacity={0.6}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onTransformEnd={handleTransform}
        shadowBlur={10}
        innerRadius={20}
        outerRadius={40}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        opacity={opacity}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  )
}
