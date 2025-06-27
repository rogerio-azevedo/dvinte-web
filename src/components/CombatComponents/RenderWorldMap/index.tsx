/* eslint-disable no-console */

import React, { useState, useEffect } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import useImage from 'use-image'

import { connect, socket } from '../../../services/socket'

import { Container } from './styles'

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

  const getMap = async (): Promise<void> => {
    try {
      const response = await api.get('maps/1')
      setMapData(response.data || {})
    } catch (error) {
      console.error('Erro ao carregar mapa mundial:', error)
    }
  }

  const handleWheel = (e: any): void => {
    e.evt.preventDefault()

    const scaleBy = 1.08
    const stage = e.target.getStage()
    const oldScale = stage.scaleX()
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    }

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy

    setStageScale(newScale)

    setStageX(
      -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale
    )

    setStageY(
      -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    )
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

  const [map] = useImage(mapData?.world || '/tir-nakhor.png')

  return (
    <Container>
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
            width={window.innerWidth}
            height={window.innerHeight}
          />
        </Layer>
      </Stage>
    </Container>
  )
}

export default RenderWorldMap
