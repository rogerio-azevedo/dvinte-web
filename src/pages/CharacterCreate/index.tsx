/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router'

import ButtonNext from '../../components/ButtonNext'
import ButtonPrev from '../../components/ButtonPrev'
import { useCharacterCreation } from '../../contexts'

import * as Styles from './styles'
import api from '../../services/api'

interface Portrait {
  id: string
  url: string
  name?: string
}

export default function CharacterPortrait() {
  const { state, actions } = useCharacterCreation()
  const location = useLocation()
  const hasInitialized = useRef(false)
  const hasReset = useRef(false) // Novo ref para controlar reset

  const [loading, setLoading] = useState(false)
  const [portraits, setPortraits] = useState<Portrait[]>([])
  const [error, setError] = useState<string | null>(null)

  const handlePick = useCallback(
    (item: Portrait) => {
      actions.setPortrait(item.id)
    },
    [actions]
  )

  // Função para limpar flag se usuário cancelar a criação
  const handleCancel = useCallback(() => {
    localStorage.removeItem('character_creation_in_progress')
    actions.resetCharacter()
  }, [actions])

  // Função para carregar portraits - apenas uma vez
  const loadPortraits = useCallback(async () => {
    if (loading) return // Evita múltiplas chamadas simultâneas

    try {
      setLoading(true)
      setError(null)

      const response = await api.get('/portraits')

      if (response.data && Array.isArray(response.data)) {
        setPortraits(response.data)
      } else {
        console.error('🚨 Resposta não é um array:', response.data)
        setError('Formato de dados inválido recebido do servidor')
      }
    } catch (error) {
      console.error('🚨 Erro ao carregar portraits:', error)
      setError('Erro ao carregar portraits. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [loading])

  useEffect(() => {
    // Usar ref para garantir que inicialização só aconteça uma vez
    if (hasInitialized.current) return

    const isNewCreation = location.search.includes('new=true')

    // CORREÇÃO: Apenas resetar se for explicitamente new=true E ainda não resetou
    if (isNewCreation && !hasReset.current) {
      actions.resetCharacter()
      localStorage.setItem('character_creation_in_progress', 'true')
      hasReset.current = true
    }

    loadPortraits()
    hasInitialized.current = true
  }, [location.search, loadPortraits, actions])

  // Loading state
  if (loading) {
    return (
      <Styles.Container loading={1}>
        <Styles.ContentContainer>
          <h1>Cadastro de Personagem - RETRATO</h1>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Carregando portraits...</p>
          </div>
        </Styles.ContentContainer>
      </Styles.Container>
    )
  }

  // Error state
  if (error) {
    return (
      <Styles.Container loading={0}>
        <Styles.ContentContainer>
          <h1>Cadastro de Personagem - RETRATO</h1>
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Tentar Novamente
            </button>
          </div>
        </Styles.ContentContainer>
      </Styles.Container>
    )
  }

  return (
    <Styles.Container loading={0}>
      <ButtonPrev linkto="charactercreate" display="hide" />

      <Styles.ContentContainer>
        <h1>Cadastro de Personagem - RETRATO</h1>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <Link
            to="/characters"
            onClick={handleCancel}
            style={{
              color: '#8e0e00',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            ← Cancelar
          </Link>

          <div style={{ fontSize: '14px', color: '#666' }}>
            {state.portrait
              ? `✅ Portrait selecionado`
              : '⚠️ Selecione um portrait'}
          </div>
        </div>

        <Styles.ImageContainer ispicked={state.portrait}>
          {portraits.length > 0 ? (
            portraits.map((item: Portrait) => (
              <div key={item.id}>
                <Styles.Item
                  onClick={() => handlePick(item)}
                  ispicked={state.portrait === item.id ? 1 : 0}
                >
                  <img
                    src={item.url}
                    alt={item.name || `Portrait ${item.id}`}
                    onError={e => {
                      console.error('🚨 Erro ao carregar imagem:', item.url)
                      e.currentTarget.src = '/placeholder-portrait.png' // fallback
                    }}
                  />
                </Styles.Item>
              </div>
            ))
          ) : (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '50px',
                color: '#666',
              }}
            >
              <p>Nenhum portrait disponível</p>
            </div>
          )}
        </Styles.ImageContainer>

        <Styles.DivPage>
          <Link to="charactercreate">
            <Styles.ActivePage />
          </Link>

          <Link to="charbase">
            <Styles.Page />
          </Link>

          <Link to="charclass">
            <Styles.Page />
          </Link>

          <Link to="charattributes">
            <Styles.Page />
          </Link>

          <Link to="charpreview">
            <Styles.Page />
          </Link>
        </Styles.DivPage>
      </Styles.ContentContainer>

      <ButtonNext linkto="/charbase" display="show" />
    </Styles.Container>
  )
}
