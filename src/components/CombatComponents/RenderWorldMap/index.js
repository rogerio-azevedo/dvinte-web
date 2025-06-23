import React, { useState, useEffect } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import useImage from 'use-image'

import { connect, socket } from '../../../services/socket'

import { Container } from './styles'

import api from '../../../services/api'

export default function RenderWorldMap() {
  // const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [mapData, setMapData] = useState({})
  const [stageScale, setStageScale] = useState(1)
  const [stageX, setStageX] = useState(0)
  const [stageY, setStageY] = useState(0)

  async function getMap() {
    const response = await api.get('maps/1')
    setMapData(response.data)
  }

  function handleWheel(e) {
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
    const handleMaps = Maps => setMapData(Maps)

    socket.on('map.message', handleMaps)

    return () => socket.off('map.message', handleMaps)
  }, [mapData])

  useEffect(() => {
    getMap()
    connect()
  }, []) // eslint-disable-line

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
