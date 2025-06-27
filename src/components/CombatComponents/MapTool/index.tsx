/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Switch } from 'antd'

import api from '../../../services/api'
import { socket } from '../../../services/socket'

import {
  fogLevelRequest,
  eraserSizeRequest,
  fogReset,
} from '../../../store/modules/menu/actions'

import * as Styles from './styles'

interface User {
  id: number
  name: string
}

interface MapData {
  campaign_id: number
  battle: string
  world: string
  portrait: string
  orientation: boolean
  width: string
  height: string
  grid: boolean
  fog: boolean
  gm_layer: boolean
  owner: number
}

interface MapResponse {
  battle?: string
  world?: string
  width?: string
  height?: string
  grid?: boolean
  fog?: boolean
  gm_layer?: boolean
  portrait?: string
  orientation?: boolean
}

interface RootState {
  user: {
    profile: User
  }
}

const MapTool: React.FC = () => {
  const profile = useSelector((state: RootState) => state.user.profile)
  const [battle, setBattle] = useState<string>('')
  const [world, setWorld] = useState<string>('')
  const [width, setWidth] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  const [grid, setGrid] = useState<boolean>(true)
  const [fog, setFog] = useState<boolean>(false)
  const [gm_layer, setGm_layer] = useState<boolean>(false)
  const [portrait, setPortrait] = useState<string>('')
  const [orientation, setOrientation] = useState<boolean>(true)

  const [fogOpacity, setFogOpacity] = useState<number>(60)
  const [size, setSize] = useState<number>(60)

  const dispatch = useDispatch()

  async function handleSave(): Promise<void> {
    try {
      const mapData: MapData = {
        campaign_id: 1,
        battle,
        world,
        portrait,
        orientation,
        width,
        height,
        grid,
        fog,
        gm_layer,
        owner: profile.id,
      }

      await api.post('maps', mapData)
      toast.success('Mapa alterado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar mapa:', error)
      toast.error('Erro ao salvar o mapa. Tente novamente.')
    }
  }

  async function loadMapData(): Promise<void> {
    try {
      const response = await api.get<MapResponse>(`maps/${1}`)
      const { data } = response

      if (data) {
        setBattle(data.battle || '')
        setWorld(data.world || '')
        setWidth(data.width || '')
        setHeight(data.height || '')
        setGrid(data.grid ?? true)
        setFog(data.fog ?? false)
        setGm_layer(data.gm_layer ?? false)
        setPortrait(data.portrait || '')
        setOrientation(data.orientation ?? true)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do mapa:', error)
      toast.error('Erro ao carregar configurações do mapa.')
    }
  }

  useEffect(() => {
    loadMapData()
  }, [])

  function handleGrid(checked: boolean): void {
    setGrid(checked)
  }

  function handleFog(checked: boolean): void {
    setFog(checked)
  }

  function handleGmLayer(checked: boolean): void {
    setGm_layer(checked)
  }

  function handleOrientation(checked: boolean): void {
    setOrientation(checked)
  }

  function handleFogLevel(level: string): void {
    const numLevel = parseInt(level, 10)
    setFogOpacity(numLevel)
    dispatch(fogLevelRequest(numLevel))
  }

  function handleEraserSize(newSize: number): void {
    setSize(newSize)
    dispatch(eraserSizeRequest(newSize))
  }

  function handleResetFog(): void {
    dispatch(fogReset())
    socket.emit('line.message', [])
  }

  function handleFormSubmit(e: React.FormEvent): void {
    e.preventDefault()
    handleSave()
  }

  return (
    <Styles.Container>
      <h2>Cadastro de Mapas</h2>
      <form onSubmit={handleFormSubmit}>
        <Styles.InputContainer>
          <div>
            <label htmlFor="battle">Mapa Batalha</label>
            <Styles.InputLarge
              id="battle"
              value={battle}
              onChange={e => setBattle(e.target.value)}
              placeholder="URL do mapa de batalha"
            />
          </div>
        </Styles.InputContainer>

        <Styles.InputContainer>
          <div>
            <label htmlFor="world">Mapa Mundo</label>
            <Styles.InputLarge
              id="world"
              value={world}
              onChange={e => setWorld(e.target.value)}
              placeholder="URL do mapa mundo"
            />
          </div>
        </Styles.InputContainer>

        <Styles.InputContainer>
          <div>
            <label htmlFor="width">Largura</label>
            <Styles.InputShort
              id="width"
              value={width}
              onChange={e => setWidth(e.target.value)}
              placeholder="pixels"
              type="number"
            />
          </div>

          <div>
            <label htmlFor="height">Altura</label>
            <Styles.InputShort
              id="height"
              value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder="pixels"
              type="number"
            />
          </div>
        </Styles.InputContainer>

        <Styles.InputContainer>
          <div>
            <label htmlFor="grid">Grid</label>
            <div style={{ marginTop: '18px' }}>
              <Switch
                id="grid"
                checked={grid}
                onChange={handleGrid}
                aria-label="Habilitar grid no mapa"
              />
            </div>
          </div>

          <div>
            <label htmlFor="fog">Fog</label>
            <div style={{ marginTop: '18px' }}>
              <Switch
                id="fog"
                checked={fog}
                onChange={handleFog}
                aria-label="Habilitar fog of war"
              />
            </div>
          </div>

          <div>
            <label htmlFor="gm_layer">GM Layer</label>
            <div style={{ marginTop: '18px' }}>
              <Switch
                id="gm_layer"
                checked={gm_layer}
                onChange={handleGmLayer}
                aria-label="Habilitar camada do GM"
              />
            </div>
          </div>
        </Styles.InputContainer>

        <Styles.InputContainer>
          <div>
            <label htmlFor="portrait">Retrato Endereço</label>
            <Styles.InputMed
              id="portrait"
              value={portrait}
              onChange={e => setPortrait(e.target.value)}
              placeholder="URL da imagem"
            />
          </div>
          <div>
            <label htmlFor="orientation">Paisag/Retrat</label>
            <div style={{ marginTop: '18px' }}>
              <Switch
                id="orientation"
                checked={orientation}
                onChange={handleOrientation}
                aria-label="Orientação paisagem/retrato"
              />
            </div>
          </div>
        </Styles.InputContainer>

        <Styles.InputContainer>
          <div>
            <label htmlFor="eraserSize">Borracha ({size}px)</label>
            <Styles.RangeInput
              id="eraserSize"
              value={size}
              onChange={e => {
                handleEraserSize(parseInt(e.target.value, 10))
              }}
              type="range"
              step={10}
              min={10}
              max={400}
              aria-label={`Tamanho da borracha: ${size} pixels`}
            />
          </div>

          <div>
            <label htmlFor="fogOpacity">Fog of War ({fogOpacity}%)</label>
            <Styles.RangeInput
              id="fogOpacity"
              value={fogOpacity}
              onChange={e => {
                handleFogLevel(e.target.value)
              }}
              type="range"
              step={10}
              min={10}
              max={100}
              aria-label={`Opacidade do fog: ${fogOpacity}%`}
            />
          </div>
        </Styles.InputContainer>

        <Styles.ButtonsContainer>
          <Styles.Button type="submit">Cadastrar</Styles.Button>
          <Styles.Button type="button" onClick={handleResetFog}>
            Limpar Fog
          </Styles.Button>
        </Styles.ButtonsContainer>
      </form>
    </Styles.Container>
  )
}

export default MapTool
