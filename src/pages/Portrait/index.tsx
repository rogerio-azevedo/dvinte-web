/* eslint-disable no-console */

import React, { useState, useEffect, useCallback, useRef } from 'react'

import api from '../../services/api'

import { Container, ImageContainer, List, Item } from './styles'

interface PortraitProps {
  id: number
  name: string
  path: string
  url: string
  created_at: string
  updated_at: string
}

interface ApiResponse {
  data: PortraitProps[]
}

export default function Portrait() {
  const [list, setList] = useState<PortraitProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadList = useCallback(async (): Promise<void> => {
    try {
      const response: ApiResponse = await api.get('/portraits')

      setList(response.data)
    } catch (error) {
      console.error('Erro ao carregar portraits:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadList()
  }, [loadList])

  const handlePortraitUploaded = useCallback((): void => {
    loadList()
  }, [loadList])

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>, url: string): void => {
      console.error('Erro ao carregar imagem:', url)
      const target = e.target as HTMLImageElement
      target.style.display = 'none'
    },
    []
  )

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const data = new FormData()
    data.append('file', e.target.files[0])

    try {
      const response = await api.post('portraits', data)
      console.log('Upload bem-sucedido:', response.data)
      if (handlePortraitUploaded) {
        handlePortraitUploaded()
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
    }
  }

  return (
    <Container loading={loading ? 1 : 0}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />

      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '16px',
            color: '#666',
          }}
        >
          Carregando portraits...
        </div>
      ) : (
        <ImageContainer>
          {list.length > 0 ? (
            list.map((item: PortraitProps) => (
              <List key={item.id}>
                <li>
                  <Item>
                    <img
                      src={item.url}
                      alt={item.name || 'Portrait'}
                      onError={e => handleImageError(e, item.url)}
                      loading="lazy"
                    />
                  </Item>
                </li>
              </List>
            ))
          ) : (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '50px',
                color: '#666',
                fontSize: '16px',
              }}
            >
              <p>Nenhum portrait disponível</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>
                Use o botão acima para adicionar novos portraits
              </p>
            </div>
          )}
        </ImageContainer>
      )}
    </Container>
  )
}
