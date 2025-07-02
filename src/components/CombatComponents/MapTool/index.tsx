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
}

interface RootState {
  user: {
    profile: User
  }
}

interface Campaign {
  id: number
  name: string
  description: string
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
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<number>(1)

  const [fogOpacity, setFogOpacity] = useState<number>(60)
  const [size, setSize] = useState<number>(60)

  const dispatch = useDispatch()

  async function handleSave(): Promise<void> {
    try {
      const mapData: MapData = {
        campaign_id: selectedCampaign,
        battle,
        world,
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

  async function loadCampaigns(): Promise<void> {
    try {
      const response = await api.get<Campaign[]>(`campaigns/user/${profile.id}`)
      setCampaigns(response.data)

      // Se tiver campanhas, seleciona a primeira
      if (response.data.length > 0) {
        setSelectedCampaign(response.data[0].id)
        await loadMapData(response.data[0].id)
      }
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error)
      toast.error('Erro ao carregar campanhas.')
    }
  }

  async function loadMapData(campaignId: number): Promise<void> {
    try {
      const response = await api.get<MapResponse>(`maps/${campaignId}`)
      const { data } = response

      if (data) {
        setBattle(data.battle || '')
        setWorld(data.world || '')
        setWidth(data.width || '')
        setHeight(data.height || '')
        setGrid(data.grid ?? true)
        setFog(data.fog ?? false)
        setGm_layer(data.gm_layer ?? false)
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados do mapa:', error)
      // Não mostrar erro se for 404 (mapa não existe ainda)
      if (error.response?.status !== 404) {
        toast.error('Erro ao carregar configurações do mapa.')
      }
    }
  }

  useEffect(() => {
    loadCampaigns()
    // loadCampaigns é uma função que não muda entre renderizações
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleCampaignChange(campaignId: number): void {
    setSelectedCampaign(campaignId)
    loadMapData(campaignId)
  }

  function handleGrid(checked: boolean): void {
    setGrid(checked)
  }

  function handleFog(checked: boolean): void {
    setFog(checked)
  }

  function handleGmLayer(checked: boolean): void {
    setGm_layer(checked)
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
            <label htmlFor="campaign">Campanha</label>
            <select
              id="campaign"
              value={selectedCampaign}
              onChange={e => handleCampaignChange(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            >
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
        </Styles.InputContainer>

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
