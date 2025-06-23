import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Stage, Layer, Line, Image, Rect } from 'react-konva'
import useImage from 'use-image'
// import Dices from '~/components/Dices'

import { fogPersistRequest } from '../../../store/modules/menu/actions'

import { connect, socket } from '../../../services/socket'

import CharToken from '../../../components/CombatComponents/CharToken'
import { Container } from './styles'

import api from '../../../services/api'

export default function RenderMap({ tokens = [], allowDrag }) {
  const profile = useSelector(state => state.user.profile)
  const { fogLevel, eraserSize } = useSelector(state => state.menu)
  const { fogPersist } = useSelector(state => state.menu)

  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [stageScale, setStageScale] = useState(1)
  const [stageX, setStageX] = useState(0)
  const [stageY, setStageY] = useState(0)
  const [lines, setLines] = useState(fogPersist)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedId, selectShape] = useState(null)
  const [mapData, setMapData] = useState({})
  const [myToken, setMyToken] = useState({})

  const dispatch = useDispatch()
  const { is_gm } = profile
  const grid = 68
  const gridWidth =
    mapData?.width > mapData?.height ? mapData?.width : mapData?.height

  const linesA = []
  const linesB = []

  for (let i = 0; i < gridWidth / grid; i++) {
    linesA.push(
      <Line
        key={`${i}v`}
        strokeWidth={1}
        stroke={'white'}
        opacity={0.7}
        points={[i * grid, 0, i * grid, gridWidth]}
      />
    )

    linesB.push(
      <Line
        key={`${i}h`}
        strokeWidth={1}
        stroke={'white'}
        opacity={0.7}
        points={[0, i * grid, gridWidth, i * grid]}
      />
    )
  }

  async function getMap() {
    const response = await api.get('maps/1')
    setMapData(response?.data)
  }

  function handleWheel(e) {
    // Sempre permitir zoom independente do modo
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
    socket.on('map.message', data => {
      setMapData(data)

      if (data.portrait !== '') {
        setStagePos({ x: 0, y: 0 })
      }
    })
  }, [mapData])

  useEffect(() => {
    getMap()
    connect()

    async function getcharToken() {
      const response = await api.get(`combats/${profile.id}`)

      setMyToken(response.data.Cod)
    }

    getcharToken()
  }, []) // eslint-disable-line

  function handleMouseDown(e) {
    if (e.evt.button === 2 && !allowDrag) {
      setIsDrawing(true)

      const pointer = e.target.getStage().getPointerPosition()

      const newLines = lines?.concat({
        id: Date.now(),
        tool: 'eraser',
        points: [pointer.x, pointer.y],
      })
      setLines(newLines)
    }
  }

  function handleMouseUp(e) {
    const clickedOnEmpty = e.target !== e.target.getStage()
    if (clickedOnEmpty) {
      selectShape(null)
    }

    if (isDrawing) {
      setIsDrawing(false)
      socket.emit('line.message', lines)
    }
  }

  function handleMouseMove(e) {
    if (!isDrawing) {
      return
    }

    if (!is_gm) {
      return
    }

    const pointer = e.target.getStage().getPointerPosition()
    const newLines = lines?.slice()
    const lastLine = {
      ...newLines[newLines?.length - 1],
    }
    lastLine.size = eraserSize
    lastLine.points = lastLine?.points.concat([pointer.x, pointer.y])
    newLines[newLines.length - 1] = lastLine
    setLines(newLines)
  }

  useEffect(() => {
    socket.on('line.message', data => {
      setLines(data)
    })
  }, [lines])

  useMemo(() => {
    dispatch(fogPersistRequest(lines))
  }, [lines, dispatch])

  const [map] = useImage(mapData?.battle)

  const [portrait] = useImage(mapData?.portrait || '')

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
        draggable={allowDrag}
        onDragEnd={e => {
          if (allowDrag) {
            setStageX(e.currentTarget.x())
            setStageY(e.currentTarget.y())
          }
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onContextMenu={e => {
          e.evt.preventDefault()
        }}
      >
        <Layer>
          <Image
            image={map}
            opacity={1}
            // width={window.innerWidth}
            // height={window.innerHeight}
            width={(mapData?.width || 1200) * 0.6}
            height={(mapData?.height || 800) * 0.6}
          />
        </Layer>

        <Layer opacity={mapData?.grid ? 1 : 0}>
          {linesA}
          {linesB}
        </Layer>

        <Layer>
          <Rect
            x={0}
            y={0}
            // width={mapData?.width}
            // height={mapData?.height}
            width={mapData?.width || 1200}
            height={mapData?.height || 800}
            fill={is_gm ? '#ff0000 ' : '#333'}
            opacity={
              mapData?.fog && is_gm
                ? fogLevel / 100
                : mapData?.fog && !is_gm
                ? 1
                : 0
            }
          />

          {lines?.map(line => (
            <Line
              x={stagePos.x}
              y={stagePos.y}
              key={line?.id}
              strokeWidth={line?.size}
              stroke={'black'}
              points={line?.points}
              globalCompositeOperation={
                line?.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}

          <Image
            image={portrait}
            opacity={1}
            width={mapData?.orientation ? 450 : 800}
            height={mapData?.orientation ? 600 : 450}
          />
        </Layer>

        {/* <Layer opacity={is_gm ? 1 : mapData?.gm_layer && !is_gm ? 1 : 0}>
          {tokens
            ?.filter(m => m.enabled === true)
            .map(item => (
              <CharToken
                tokens={tokens}
                key={item.id}
                id={String(item.id)}
                x={item.x}
                y={item.y}
                isSelected={!allowDrag && item.id === selectedId}
                onSelect={() => {
                  selectShape(item.id)
                }}
                image={item.image}
                width={item.width}
                height={item.height}
                opacity={0.5}
                //offsetX={item.width / 2}
                //offsetY={item.height / 2}
                rotation={item.rotation}
                draggable={!allowDrag}
              />
            ))}
        </Layer> */}

        <Layer>
          {(Array.isArray(tokens) ? tokens : [])
            // ?.filter(m => m.enabled === false)
            .map(item => (
              <CharToken
                tokens={tokens}
                key={item.id}
                id={String(item.id)}
                x={item.x}
                y={item.y}
                isSelected={
                  myToken === item.character_id && !allowDrag
                    ? item.id === selectedId
                    : is_gm && !allowDrag && item.id === selectedId
                }
                onSelect={() => {
                  selectShape(item.id)
                }}
                image={item.image}
                width={item.width}
                height={item.height}
                //offsetX={item.width / 2}
                //offsetY={item.height / 2}
                rotation={item.rotation}
                draggable={
                  myToken === item.character_id && !allowDrag
                    ? true
                    : is_gm && !allowDrag
                    ? true
                    : false
                }
                opacity={
                  item.enabled ? 1 : item.enabled === false && is_gm ? 0.6 : 0
                }
              />
            ))}
        </Layer>
      </Stage>
    </Container>
  )
}

RenderMap.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.object),
}
