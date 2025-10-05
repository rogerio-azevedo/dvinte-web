/* eslint-disable no-console */

import React, { useState, useEffect } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import useImage from 'use-image'

import { connect, socket } from '../../../services/socket'

import api from '../../../services/api'

// Interfaces
interface MapData {
  world?: string
}

const RenderWorldMap: React.FC = () => {
  // const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [mapData, setMapData] = useState<MapData>({})
  const [stageScale, setStageScale] = useState(1)
  const [stageX, setStageX] = useState(0)
  const [stageY, setStageY] = useState(0)
  const [mapDimensions, setMapDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const getMap = async (): Promise<void> => {
    try {
      const response = await api.get('maps/1')
      setMapData(response.data || {})
    } catch (error) {
      console.error('Erro ao carregar mapa mundial:', error)
    }
  }

  const handleWheel = (e: KonvaEventObject<WheelEvent>): void => {
    e.evt.preventDefault()

    const scaleBy = 1.08
    const stage = e.target.getStage()
    if (!stage) return

    const oldScale = stage.scaleX()
    const pointerPos = stage.getPointerPosition()
    if (!pointerPos) return

    const mousePointTo = {
      x: pointerPos.x / oldScale - stage.x() / oldScale,
      y: pointerPos.y / oldScale - stage.y() / oldScale,
    }

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy

    setStageScale(newScale)

    setStageX(-(mousePointTo.x - pointerPos.x / newScale) * newScale)

    setStageY(-(mousePointTo.y - pointerPos.y / newScale) * newScale)
  }

  useEffect(() => {
    const handleMaps = (Maps: MapData) => setMapData(Maps)

    socket.on('map.message', handleMaps)

    return () => {
      socket.off('map.message', handleMaps)
    }
  }, [mapData])

  useEffect(() => {
    getMap()
    connect()
  }, [])

  const [map] = useImage(mapData?.world || '')

  // Calcular dimensões do mapa quando a imagem carregar
  useEffect(() => {
    if (map) {
      const imgWidth = map.width
      const imgHeight = map.height
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      // Calcular escala para preencher a tela mantendo proporção
      const scaleX = screenWidth / imgWidth
      const scaleY = screenHeight / imgHeight
      const scale = Math.max(scaleX, scaleY) // Usar o maior para preencher toda a tela

      setMapDimensions({
        width: imgWidth * scale,
        height: imgHeight * scale,
      })
    }
  }, [map])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Stage
        x={stageX}
        y={stageY}
        scaleX={stageScale}
        scaleY={stageScale}
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={handleWheel}
        draggable
        // onDragEnd={e => {
        //   setStagePos(e.currentTarget.position())
        // }}
        onContextMenu={e => {
          e.evt.preventDefault()
        }}
      >
        <Layer>
          <Image
            image={map}
            opacity={1}
            width={mapDimensions.width}
            height={mapDimensions.height}
          />
        </Layer>
      </Stage>
    </div>
  )
}

export default RenderWorldMap
