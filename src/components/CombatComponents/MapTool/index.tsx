/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react'
import { useAuth, useMenu } from '../../../contexts'
import { toast } from 'react-toastify'
import { Switch } from 'antd'

import api from '../../../services/api'
import { socket } from '../../../services/socket'

import * as Styles from './styles'

interface MapData {
  campaign_id: number
  battle: string
  world: string
  portrait?: string
  orientation?: boolean
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
  portrait?: string
  orientation?: boolean
  width?: string
  height?: string
  grid?: boolean
  fog?: boolean
  gm_layer?: boolean
}

interface Campaign {
  id: number
  name: string
  description: string
}

const MapTool: React.FC = () => {
  const { user } = useAuth()
  const { actions: menuActions } = useMenu()
  const [battle, setBattle] = useState<string>('')
  const [world, setWorld] = useState<string>('')
  const [portrait, setPortrait] = useState<string>('')
  const [orientation, setOrientation] = useState<boolean>(false)
  const [width, setWidth] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  const [grid, setGrid] = useState<boolean>(true)
  const [fog, setFog] = useState<boolean>(false)
  const [gm_layer, setGm_layer] = useState<boolean>(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<number>(1)

  const [fogOpacity, setFogOpacity] = useState<number>(60)
  const [size, setSize] = useState<number>(60)

  // dispatch migrado para menuActions

  async function handleSave(): Promise<void> {
    try {
      if (!user?.id) {
        toast.error('Usuário não identificado')
        return
      }

      const mapData: MapData = {
        campaign_id: selectedCampaign,
        battle,
        world,
        portrait,
        orientation,
        width,
        height,
        grid,
        fog,
        gm_layer,
        owner: user.id,
      }

      await api.post('maps', mapData)

      socket.emit('map.message', mapData)

      toast.success('Mapa alterado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar mapa:', error)
      toast.error('Erro ao salvar o mapa. Tente novamente.')
    }
  }

  async function loadCampaigns(): Promise<void> {
    try {
      const response = await api.get<Campaign[]>(`campaigns/user/${user?.id}`)
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
      const mapData = response.data

      if (mapData) {
        setBattle(mapData.battle || '')
        setWorld(mapData.world || '')
        setPortrait(mapData.portrait || '')
        setOrientation(mapData.orientation || false)
        setWidth(mapData.width?.toString() || '')
        setHeight(mapData.height?.toString() || '')
        setGrid(mapData.grid || true)
        setFog(mapData.fog || false)
        setGm_layer(mapData.gm_layer || false)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do mapa:', error)
      toast.error('Erro ao carregar dados do mapa.')
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

  function handleOrientation(checked: boolean): void {
    setOrientation(checked)
  }

  function handleFogLevel(level: string): void {
    const numLevel = parseInt(level, 10)
    setFogOpacity(numLevel)
    menuActions.setFogLevel(numLevel)
  }

  function handleEraserSize(newSize: number): void {
    setSize(newSize)
    menuActions.setEraserSize(newSize)
  }

  function handleResetFog(): void {
    menuActions.resetFog()
    socket.emit('line.message', [])
  }

  function handleFormSubmit(e: React.FormEvent): void {
    e.preventDefault()
    handleSave()
  }

  return (
    <div className="flex flex-col gap-4 px-2">
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
            <label htmlFor="portrait">Portrait</label>
            <Styles.InputLarge
              id="portrait"
              value={portrait}
              onChange={e => setPortrait(e.target.value)}
              placeholder="URL do portrait"
            />
          </div>
        </Styles.InputContainer>

        <Styles.InputContainer>
          <div>
            <label htmlFor="orientation">Orientação da Imagem</label>
            <div style={{ marginTop: '18px' }}>
              <Switch
                id="orientation"
                checked={orientation}
                onChange={handleOrientation}
                aria-label="Habilitar orientação do mapa"
              />
              <span
                style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}
              >
                {orientation ? 'Retrato (Vertical)' : 'Paisagem (Horizontal)'}
              </span>
            </div>
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
    </div>
  )
}

export default MapTool
