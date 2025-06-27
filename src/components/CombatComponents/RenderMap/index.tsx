/* eslint-disable no-console */

import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Stage, Layer, Line, Image, Rect } from 'react-konva'
import useImage from 'use-image'
// import Dices from '../../../components/Dices'

import { fogPersistRequest } from '../../../store/modules/menu/actions'

import { connect, socket } from '../../../services/socket'

import CharToken from '../../../components/CombatComponents/CharToken'
import { Container } from './styles'

import api from '../../../services/api'
import { Token as CombatToken } from '../../../pages/Combat/interfaces'

// Interfaces TypeScript
interface RenderToken {
  id: number
  character_id: number
  x: number
  y: number
  image: string
  width: number
  height: number
  rotation: number
  enabled: boolean
}

interface MapData {
  width?: number
  height?: number
  battle?: string
  portrait?: string
  grid?: boolean
  fog?: boolean
  gm_layer?: boolean
  orientation?: boolean
}

interface FogLine {
  id: number
  tool: string
  points: number[]
  size?: number
}

interface Profile {
  id: number
  is_gm: boolean
}

interface MenuState {
  fogLevel: number
  eraserSize: number
  fogPersist: FogLine[]
}

interface RootState {
  user: {
    profile: Profile
  }
  menu: MenuState
}

interface RenderMapProps {
  tokens?: CombatToken[]
  allowDrag?: boolean
  setTokens?: (tokens: CombatToken[]) => void
}

const RenderMap: React.FC<RenderMapProps> = ({
  tokens = [],
  allowDrag = false,
  setTokens,
}) => {
  const profile = useSelector((state: RootState) => state.user.profile)
  const { fogLevel, eraserSize } = useSelector((state: RootState) => state.menu)
  const { fogPersist } = useSelector((state: RootState) => state.menu)

  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [stageScale, setStageScale] = useState(1)
  const [stageX, setStageX] = useState(0)
  const [stageY, setStageY] = useState(0)
  const [lines, setLines] = useState<FogLine[]>(fogPersist)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedId, selectShape] = useState<number | null>(null)
  const [mapData, setMapData] = useState<MapData>({})
  const [myToken, setMyToken] = useState<number>(0)

  const dispatch = useDispatch()
  const { is_gm } = profile
  const grid = 68
  const gridWidth =
    mapData?.width && mapData?.height
      ? Math.max(mapData.width, mapData.height)
      : 1200

  // Debug: Verificar tokens recebidos
  console.log('🔄 RenderMap: Tokens recebidos:', tokens)
  console.log(
    '🔄 RenderMap: Tipo dos tokens:',
    typeof tokens,
    Array.isArray(tokens)
  )

  // Função para converter tokens do Combat para formato de renderização
  const convertTokensForRender = (tokens: CombatToken[]): RenderToken[] => {
    console.log('🔄 RenderMap: Convertendo tokens:', tokens)

    if (!Array.isArray(tokens)) {
      console.warn('🔴 RenderMap: tokens não é um array:', tokens)
      return []
    }

    return tokens.map(token => {
      console.log('🔄 RenderMap: Token individual:', token)

      const converted = {
        id: token.id,
        character_id: token.character_id,
        // Fallback para diferentes estruturas de dados
        x: token.position_x || (token as any).x || 0,
        y: token.position_y || (token as any).y || 0,
        image: token.token_id
          ? `${window.location.origin}/api/files/token/${token.token_id}`
          : (token as any).image || '',
        width: token.size || (token as any).width || 50,
        height: token.size || (token as any).height || 50,
        rotation: token.rotation || 0,
        enabled: token.enabled,
      }

      console.log('🔄 RenderMap: Token convertido:', converted)
      return converted
    })
  }

  const renderTokens = convertTokensForRender(tokens || [])
  console.log('🔄 RenderMap: Tokens para renderizar:', renderTokens)

  const linesA: React.ReactElement[] = []
  const linesB: React.ReactElement[] = []

  for (let i = 0; i < gridWidth / grid; i++) {
    linesA.push(
      <Line
        key={`${i}v`}
        strokeWidth={0.5}
        stroke={'white'}
        opacity={0.4}
        points={[i * grid, 0, i * grid, gridWidth]}
      />
    )

    linesB.push(
      <Line
        key={`${i}h`}
        strokeWidth={0.5}
        stroke={'white'}
        opacity={0.4}
        points={[0, i * grid, gridWidth, i * grid]}
      />
    )
  }

  const getMap = async (): Promise<void> => {
    try {
      const response = await api.get('maps/1')
      setMapData(response?.data || {})
    } catch (error) {
      console.error('Erro ao carregar mapa:', error)
    }
  }

  const handleWheel = (e: any): void => {
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
    socket.on('map.message', (data: MapData) => {
      setMapData(data)

      if (data.portrait !== '') {
        setStagePos({ x: 0, y: 0 })
      }
    })
  }, [mapData])

  useEffect(() => {
    getMap()
    connect()

    const getcharToken = async (): Promise<void> => {
      try {
        const response = await api.get(`combats/${profile.id}`)
        setMyToken(response.data.Cod || 0)
      } catch (error) {
        console.error('Erro ao carregar token do personagem:', error)
      }
    }

    getcharToken()
  }, [profile.id])

  const handleMouseDown = (e: any): void => {
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

  const handleMouseUp = (e: any): void => {
    const clickedOnEmpty = e.target !== e.target.getStage()
    if (clickedOnEmpty) {
      selectShape(null)
    }

    if (isDrawing) {
      setIsDrawing(false)
      socket.emit('line.message', lines)
    }
  }

  const handleMouseMove = (e: any): void => {
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
    socket.on('line.message', (data: FogLine[]) => {
      setLines(data)
    })
  }, [lines])

  useMemo(() => {
    dispatch(fogPersistRequest(lines))
  }, [lines, dispatch])

  const [map] = useImage(mapData?.battle)
  const [portrait] = useImage(mapData?.portrait || '')

  useEffect(() => {
    const handleTokenMessage = (data: CombatToken[]) => {
      console.log('🔄 Socket.IO: Received token.message event with data:', {
        isArray: Array.isArray(data),
        dataLength: data?.length,
        firstToken: data?.[0],
      })

      if (Array.isArray(data) && setTokens) {
        setTokens(data)
      }
    }

    socket.on('token.message', handleTokenMessage)

    return () => {
      socket.off('token.message', handleTokenMessage)
    }
  }, [setTokens])

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
          {renderTokens.map(item => {
            console.log('🔄 RenderMap: Renderizando token:', item)

            return (
              <CharToken
                key={item.id}
                id={Number(item.id)}
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
            )
          })}
        </Layer>
      </Stage>
    </Container>
  )
}

export default RenderMap
