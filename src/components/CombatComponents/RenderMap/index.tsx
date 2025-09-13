/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback, type ReactElement } from 'react'
import { useAuth, useMenu } from '../../../contexts'
import { Stage, Layer, Line, Image, Rect } from 'react-konva'
import useImage from 'use-image'

import { connect, socket } from '../../../services/socket'
import CharToken from '../CharToken'
import api from '../../../services/api'
import {
  type RenderMapProps,
  type Token,
  type MapData,
  type Line as LineType,
} from './interfaces'

export default function RenderMap({
  tokens = [],
  allowDrag,
  setTokens,
}: RenderMapProps) {
  const { user } = useAuth()
  const { state: menuState, actions: menuActions } = useMenu()
  const { fogLevel, eraserSize, fogPersist } = menuState

  const [stageScale, setStageScale] = useState<number>(1)
  const [stageX, setStageX] = useState<number>(0)
  const [stageY, setStageY] = useState<number>(0)
  const [lines, setLines] = useState<LineType[]>(fogPersist)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [selectedId, selectShape] = useState<number | null>(null)
  const [mapData, setMapData] = useState<MapData>({} as MapData)
  const [myToken, setMyToken] = useState<number>(0)
  const [overlappingTokens, setOverlappingTokens] = useState<number[]>([])

  // dispatch migrado para menuActions
  const is_gm = user?.is_gm
  const grid = 75
  const gridWidth =
    mapData?.width > mapData?.height ? mapData?.width : mapData?.height

  const linesA: ReactElement[] = []
  const linesB: ReactElement[] = []

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

  async function getMap() {
    try {
      // Usar campanha padrão 1
      const response = await api.get<MapData>('maps/1')
      setMapData(response?.data)
    } catch (error) {
      console.error('Erro ao carregar mapa:', error)
      // Fallback para mapa padrão se não encontrar
      setMapData({} as MapData)
    }
  }

  function handleWheel(e: any) {
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
    const handleMapMessage = (data: MapData) => {
      console.log('📡 Recebido map.message:', data)
      setMapData(data)

      if (data.portrait !== '') {
        console.log('🖼️ Portrait detectado, resetando posição do stage')
        setStageX(0)
        setStageY(0)
      }
    }

    // Listener para atualizações de vida de personagens
    const handleCharacterHealthUpdate = (data: {
      characterId: number
      health: number
      health_now: number
      change: number
      name: string
    }) => {
      // Atualizar os tokens que representam esse personagem
      if (setTokens) {
        setTokens(prevTokens =>
          prevTokens.map(token =>
            token.character_id === data.characterId && token.character
              ? {
                  ...token,
                  character: {
                    ...token.character,
                    health_now: data.health_now,
                  },
                }
              : token
          )
        )
      }
    }

    socket.on('map.message', handleMapMessage)
    socket.on('character.health.updated', handleCharacterHealthUpdate)

    return () => {
      socket.off('map.message', handleMapMessage)
      socket.off('character.health.updated', handleCharacterHealthUpdate)
    }
  }, [setTokens])

  useEffect(() => {
    getMap()
    connect()

    async function getcharToken() {
      const response = await api.get(`combats/${user?.id}`)
      setMyToken(response.data.Cod)
    }

    getcharToken()
  }, [user?.id])

  function handleMouseDown(e: any) {
    if (e.evt.button === 2 && !allowDrag) {
      setIsDrawing(true)

      const worldCoords = getWorldCoordinates(e.target.getStage())

      const newLines = lines?.concat({
        id: Date.now(),
        tool: 'eraser',
        points: [worldCoords.x, worldCoords.y],
      })
      setLines(newLines)
    }
  }

  function handleMouseUp(e: any) {
    const clickedOnEmpty = e.target !== e.target.getStage()
    if (clickedOnEmpty) {
      selectShape(null)
    }

    if (isDrawing) {
      setIsDrawing(false)
      socket.emit('line.message', lines)
    }
  }

  function handleMouseMove(e: any) {
    if (!isDrawing) {
      return
    }

    if (!is_gm) {
      return
    }

    const worldCoords = getWorldCoordinates(e.target.getStage())
    const newLines = lines?.slice()
    const lastLine = {
      ...newLines[newLines?.length - 1],
    }
    lastLine.size = eraserSize
    lastLine.points = lastLine?.points.concat([worldCoords.x, worldCoords.y])
    newLines[newLines.length - 1] = lastLine
    setLines(newLines)
  }

  useEffect(() => {
    socket.on('line.message', (data: LineType[]) => {
      setLines(data)
    })
  }, [lines])

  useEffect(() => {
    menuActions.setFogPersist(lines)
  }, [lines, menuActions])

  const [map] = useImage(mapData?.battle || '')
  const [portrait] = useImage(mapData?.portrait || '')

  // Função para converter coordenadas do mouse para coordenadas do mundo
  const getWorldCoordinates = useCallback(
    (stage: any) => {
      const pointer = stage.getPointerPosition()
      if (!pointer) return { x: 0, y: 0 }

      // Ajusta as coordenadas considerando a posição e escala do stage
      const worldX = (pointer.x - stageX) / stageScale
      const worldY = (pointer.y - stageY) / stageScale

      return { x: worldX, y: worldY }
    },
    [stageX, stageY, stageScale]
  )

  // Função para detectar tokens sobrepostos em uma posição
  const getTokensAtPosition = useCallback(
    (x: number, y: number): Token[] => {
      const gridX = Math.round(x / grid) * grid
      const gridY = Math.round(y / grid) * grid

      return tokens.filter(token => {
        const tokenGridX = Math.round(token.x / grid) * grid
        const tokenGridY = Math.round(token.y / grid) * grid
        return tokenGridX === gridX && tokenGridY === gridY
      })
    },
    [tokens, grid]
  )

  // Função para selecionar próximo token sobreposto
  const selectNextOverlappingToken = (clickedTokenId: number) => {
    // Encontra o token clicado
    const clickedToken = tokens.find(t => t.id === clickedTokenId)
    if (!clickedToken) return

    // Encontra todos os tokens na mesma posição
    const tokensAtPos = getTokensAtPosition(clickedToken.x, clickedToken.y)

    if (tokensAtPos.length <= 1) {
      // Se há apenas um token, seleciona normalmente
      selectShape(clickedTokenId)
      setOverlappingTokens([])
      return
    }

    // Se há múltiplos tokens, implementa rotação de seleção
    const currentIndex = tokensAtPos.findIndex(t => t.id === selectedId)
    const nextIndex = (currentIndex + 1) % tokensAtPos.length
    const nextToken = tokensAtPos[nextIndex]

    selectShape(nextToken.id)
    setOverlappingTokens(tokensAtPos.map(t => t.id))
  }

  // Função para verificar se uma posição está ocupada
  const isPositionOccupied = (
    x: number,
    y: number,
    excludeTokenId?: number
  ): boolean => {
    const gridX = Math.round(x / grid) * grid
    const gridY = Math.round(y / grid) * grid

    // Verifica se está dentro dos limites do mapa
    if (
      gridX < 0 ||
      gridY < 0 ||
      gridX >= (mapData?.width || 1920) * 0.6 ||
      gridY >= (mapData?.height || 1080) * 0.6
    ) {
      return true // Considera ocupado se estiver fora dos limites
    }

    return tokens.some(token => {
      if (excludeTokenId && token.id === excludeTokenId) return false
      const tokenGridX = Math.round(token.x / grid) * grid
      const tokenGridY = Math.round(token.y / grid) * grid
      return tokenGridX === gridX && tokenGridY === gridY
    })
  }

  useEffect(() => {
    const handleTokens = (data: Token[]) => {
      console.log('🔄 Socket.IO: Received token.message event with data:', {
        isArray: Array.isArray(data),
        dataLength: data?.length,
        firstToken: data?.[0],
      })

      if (Array.isArray(data) && setTokens) {
        setTokens(data)
      }
    }

    socket.on('token.message', handleTokens)

    return () => socket.off('token.message', handleTokens)
  }, [setTokens])

  // Efeito para detectar tokens sobrepostos automaticamente
  useEffect(() => {
    const overlapping: number[] = []

    tokens.forEach(token => {
      const tokensAtPos = getTokensAtPosition(token.x, token.y)
      if (tokensAtPos.length > 1) {
        tokensAtPos.forEach(t => {
          if (!overlapping.includes(t.id)) {
            overlapping.push(t.id)
          }
        })
      }
    })

    setOverlappingTokens(overlapping)
  }, [tokens, getTokensAtPosition])

  return (
    <div className="flex w-full h-full justify-between items-center">
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
            width={(mapData?.width || 1920) * 0.6}
            height={(mapData?.height || 1080) * 0.6}
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
              key={line?.id}
              strokeWidth={line?.size}
              stroke={'black'}
              points={line?.points}
              globalCompositeOperation={
                line?.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>

        <Layer>
          {(Array.isArray(tokens) ? tokens : [])
            .sort((a, b) => {
              // Ordena tokens: selecionado por último (fica por cima)
              if (a.id === selectedId) return 1
              if (b.id === selectedId) return -1
              // Tokens do jogador atual ficam por cima dos outros
              if (a.character_id === myToken && b.character_id !== myToken)
                return 1
              if (b.character_id === myToken && a.character_id !== myToken)
                return -1
              // Por último, ordena por ID (mais recente por cima)
              return b.id - a.id
            })
            .map(item => (
              <CharToken
                key={item.id}
                id={item.id}
                x={item.x}
                y={item.y}
                isSelected={
                  myToken === item.character_id && !allowDrag
                    ? item.id === selectedId
                    : is_gm && !allowDrag && item.id === selectedId
                }
                onSelect={() => {
                  // Usa o sistema de clique que atravessa tokens sobrepostos
                  selectNextOverlappingToken(item.id)
                }}
                image={item.image}
                width={item.width}
                height={item.height}
                rotation={item.rotation || 0}
                draggable={
                  myToken === item.character_id && !allowDrag
                    ? true
                    : is_gm && !allowDrag
                    ? true
                    : false
                }
                opacity={
                  item.enabled
                    ? overlappingTokens.includes(item.id)
                      ? 0.7 // Tokens sobrepostos ficam um pouco transparentes
                      : 1
                    : item.enabled === false && is_gm
                    ? 0.6
                    : 0
                }
                isPositionOccupied={isPositionOccupied}
                character={item.character}
              />
            ))}
        </Layer>

        {mapData?.portrait && (
          <Layer>
            <Image
              image={portrait}
              opacity={1}
              width={mapData?.orientation ? 450 : 800}
              height={mapData?.orientation ? 600 : 450}
            />
          </Layer>
        )}
      </Stage>
    </div>
  )
}
