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
  battle_gm?: string
  portrait?: string
  portrait_gm?: string
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
  battle_gm?: string
  portrait?: string
  portrait_gm?: string
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
  const { state: menuState, actions: menuActions } = useMenu()
  const [battle, setBattle] = useState<string>('')
  const [world, setWorld] = useState<string>('')
  const [battle_gm, setBattleGm] = useState<string>('')
  const [portrait, setPortrait] = useState<string>('')
  const [portrait_gm, setPortraitGm] = useState<string>('')
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

  // Estados locais para desenho livre
  const { drawTool, brushSize, brushColor } = menuState

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
        battle_gm,
        portrait,
        portrait_gm,
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
        setBattleGm(mapData.battle_gm || '')
        setPortrait(mapData.portrait || '')
        setPortraitGm(mapData.portrait_gm || '')
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

  function handleResetDrawings(): void {
    menuActions.resetDrawings()
    socket.emit('drawing.message', [])
  }

  async function handleRevealMap(): Promise<void> {
    try {
      if (!user?.id) {
        toast.error('Usuário não identificado')
        return
      }

      if (!battle_gm && !portrait_gm) {
        toast.error('Nenhum mapa GM configurado para revelar')
        return
      }

      // Copia os mapas GM para os mapas públicos e desativa gm_layer
      const mapData: MapData = {
        campaign_id: selectedCampaign,
        battle: battle_gm || battle,
        world,
        battle_gm,
        portrait: portrait_gm || portrait,
        portrait_gm,
        orientation,
        width,
        height,
        grid,
        fog,
        gm_layer: false, // Desativa a camada GM
        owner: user.id,
      }

      await api.post('maps', mapData)
      socket.emit('map.message', mapData)

      // Revela layer de tokens (move todos de GM → public) via socket
      await api.post('chartokens/reveal-layer')

      // Atualiza estados locais
      setBattle(battle_gm || battle)
      setPortrait(portrait_gm || portrait)
      setGm_layer(false)

      toast.success('Mapa e tokens revelados para os jogadores!')
    } catch (error) {
      console.error('Erro ao revelar mapa:', error)
      toast.error('Erro ao revelar o mapa. Tente novamente.')
    }
  }

  function handleFormSubmit(e: React.FormEvent): void {
    e.preventDefault()
    handleSave()
  }

  const fieldLabelCn =
    'mb-1 block text-xs font-semibold tracking-wide text-stone-600'

  const selectCn =
    'mt-1.5 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#8e0e00] focus:ring-2 focus:ring-[#8e0e00]/15'

  return (
    <div className="-mx-0.5 scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto">
      <form onSubmit={handleFormSubmit} className="pb-4">
        <Styles.PanelSection>
          <Styles.SectionHeading id="map-config-campaign-h">
            Campanha
          </Styles.SectionHeading>
          <div>
            <select
              id="campaign"
              aria-labelledby="map-config-campaign-h"
              value={selectedCampaign}
              onChange={e => handleCampaignChange(parseInt(e.target.value, 10))}
              className={selectCn}
            >
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
        </Styles.PanelSection>

        <Styles.PanelSection>
          <Styles.SectionHeading>URLs dos mapas</Styles.SectionHeading>
          <div className="space-y-4">
            <div>
              <label htmlFor="battle" className={fieldLabelCn}>
                Mapa Batalha (Público)
              </label>
              <Styles.InputLarge
                id="battle"
                value={battle}
                onChange={e => setBattle(e.target.value)}
                placeholder="URL do mapa de batalha público"
              />
            </div>
            <div>
              <label htmlFor="battle_gm" className={fieldLabelCn}>
                Mapa Batalha GM (Preparação)
                {gm_layer && (
                  <span className="ml-2 text-xs font-semibold text-amber-700">
                    • GM só
                  </span>
                )}
              </label>
              <Styles.InputLarge
                id="battle_gm"
                value={battle_gm}
                onChange={e => setBattleGm(e.target.value)}
                placeholder="URL do mapa GM (visível só com GM Layer)"
              />
            </div>
            <div>
              <label htmlFor="world" className={fieldLabelCn}>
                Mapa Mundo
              </label>
              <Styles.InputLarge
                id="world"
                value={world}
                onChange={e => setWorld(e.target.value)}
                placeholder="URL do mapa mundo"
              />
            </div>
            <div>
              <label htmlFor="portrait" className={fieldLabelCn}>
                Portrait (Público)
              </label>
              <Styles.InputLarge
                id="portrait"
                value={portrait}
                onChange={e => setPortrait(e.target.value)}
                placeholder="URL do portrait público"
              />
            </div>
            <div>
              <label htmlFor="portrait_gm" className={fieldLabelCn}>
                Portrait GM (Preparação)
                {gm_layer && (
                  <span className="ml-2 text-xs font-semibold text-amber-700">
                    • GM só
                  </span>
                )}
              </label>
              <Styles.InputLarge
                id="portrait_gm"
                value={portrait_gm}
                onChange={e => setPortraitGm(e.target.value)}
                placeholder="URL portrait GM"
              />
            </div>
          </div>
        </Styles.PanelSection>

        <Styles.PanelSection>
          <Styles.SectionHeading>Dimensões e exibição</Styles.SectionHeading>
          <div>
            <label htmlFor="orientation" className={fieldLabelCn}>
              Orientação da imagem
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Switch
                id="orientation"
                checked={orientation}
                onChange={handleOrientation}
                aria-label="Alternar retrato ou paisagem"
              />
              <span className="text-xs text-slate-600">
                {orientation ? 'Retrato (vertical)' : 'Paisagem (horizontal)'}
              </span>
            </div>
          </div>

          <Styles.InputContainer style={{ paddingTop: 16 }}>
            <div>
              <label htmlFor="width">Largura (px)</label>
              <Styles.InputShort
                id="width"
                value={width}
                onChange={e => setWidth(e.target.value)}
                placeholder="ex: 2200"
                type="number"
              />
            </div>
            <div>
              <label htmlFor="height">Altura (px)</label>
              <Styles.InputShort
                id="height"
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder="ex: 2200"
                type="number"
              />
            </div>
          </Styles.InputContainer>

          <Styles.ToggleRow>
            <Styles.ToggleCell>
              <label htmlFor="grid">Grid</label>
              <Switch
                id="grid"
                checked={grid}
                onChange={handleGrid}
                aria-label="Habilitar grid no mapa"
              />
            </Styles.ToggleCell>
            <Styles.ToggleCell>
              <label htmlFor="fog">Fog</label>
              <Switch
                id="fog"
                checked={fog}
                onChange={handleFog}
                aria-label="Habilitar fog of war"
              />
            </Styles.ToggleCell>
            <Styles.ToggleCell>
              <label htmlFor="gm_layer">GM Layer</label>
              <Switch
                id="gm_layer"
                checked={gm_layer}
                onChange={handleGmLayer}
                aria-label="Habilitar camada do GM"
              />
            </Styles.ToggleCell>
          </Styles.ToggleRow>

          <Styles.InputContainer style={{ paddingTop: 8, paddingBottom: 0 }}>
            <div className='mt-2'>
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
            <div className='mt-2'>
              <label htmlFor="fogOpacity">Fog ({fogOpacity}%)</label>
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
        </Styles.PanelSection>

        <Styles.PanelSection>
          <Styles.SectionHeading>Desenho livre</Styles.SectionHeading>

          <div>
            <label htmlFor="drawTool" className={fieldLabelCn}>
              Ferramenta
            </label>
            <select
              id="drawTool"
              value={drawTool}
              onChange={e =>
                menuActions.setDrawTool(
                  e.target.value as 'none' | 'pen' | 'eraser'
                )
              }
              className={`${selectCn} ${drawTool === 'pen' ? 'border-sky-200 bg-sky-50' : ''
                }`}
            >
              <option value="none">Nenhuma</option>
              <option value="pen">Caneta</option>
              <option value="eraser">Borracha no mapa</option>
            </select>
          </div>

          {drawTool === 'pen' && (
            <>
              <Styles.InputContainer>
                <div>
                  <label htmlFor="brushSize">Tamanho ({brushSize}px)</label>
                  <Styles.RangeInput
                    id="brushSize"
                    value={brushSize}
                    onChange={e =>
                      menuActions.setBrushSize(parseInt(e.target.value, 10))
                    }
                    type="range"
                    step={1}
                    min={1}
                    max={50}
                    aria-label={`Tamanho do pincel: ${brushSize} pixels`}
                  />
                </div>
              </Styles.InputContainer>

              <Styles.InputContainer>
                <div>
                  <label htmlFor="brushColor">Cor do Pincel</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      '#FF0000',
                      '#00FF00',
                      '#0000FF',
                      '#FFFF00',
                      '#FF00FF',
                      '#00FFFF',
                      '#FFFFFF',
                      '#000000',
                    ].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => menuActions.setBrushColor(color)}
                        className={`size-8 shrink-0 rounded-md border transition-[box-shadow,transform] hover:scale-105 ${brushColor === color
                          ? 'ring-2 ring-stone-800 ring-offset-2'
                          : 'border-stone-200'
                          }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Selecionar cor ${color}`}
                      />
                    ))}
                    <input
                      id="brushColor"
                      type="color"
                      value={brushColor}
                      onChange={e => menuActions.setBrushColor(e.target.value)}
                      className="size-8 cursor-pointer shrink-0 overflow-hidden rounded-md border border-stone-300 p-0"
                      aria-label="Seletor de cor personalizada"
                    />
                  </div>
                </div>
              </Styles.InputContainer>
            </>
          )}

          <Styles.ButtonsContainer style={{ marginTop: 12 }}>
            <Styles.ButtonSecondary
              type="button"
              onClick={handleResetDrawings}
            >
              Limpar desenhos
            </Styles.ButtonSecondary>
          </Styles.ButtonsContainer>
        </Styles.PanelSection>

        <Styles.ButtonsContainer>
          <Styles.ButtonPrimary type="submit">Salvar mapa</Styles.ButtonPrimary>
          <Styles.ButtonSecondary type="button" onClick={handleResetFog}>
            Limpar fog
          </Styles.ButtonSecondary>
          {(battle_gm || portrait_gm) && (
            <Styles.ButtonSecondary
              type="button"
              onClick={handleRevealMap}
              disabled={!gm_layer}
              title={
                gm_layer
                  ? 'Revelar mapa aos jogadores'
                  : 'Ative o GM Layer para revelar o mapa'
              }
              style={
                gm_layer
                  ? {
                    backgroundColor: '#15803d',
                    borderColor: '#166534',
                    color: '#fff',
                  }
                  : undefined
              }
            >
              {gm_layer ? 'Revelar aos jogadores' : 'GM Layer desativado'}
            </Styles.ButtonSecondary>
          )}
        </Styles.ButtonsContainer>
      </form>
    </div>
  )
}

export default MapTool
