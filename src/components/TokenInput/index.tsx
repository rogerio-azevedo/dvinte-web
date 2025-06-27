/* eslint-disable no-console */
import { useState, useRef, useEffect } from 'react'
import { useField } from '@rocketseat/unform'
import api from '../../services/api'

import * as Styles from './styles'

interface Token {
  id: string
  url: string
}

interface UploadResponse {
  id: string
  url: string
}

const TokenInput: React.FC = () => {
  const { defaultValue, registerField } = useField('token')
  const defaultToken = defaultValue as Token | undefined

  const [file, setFile] = useState<string | undefined>(defaultToken?.id)
  const [preview, setPreview] = useState<string | undefined>(defaultToken?.url)

  const ref = useRef<HTMLInputElement>(null)
  const defaultAvatar = 'https://api.adorable.io/avatars/50/abott@adorable.png'

  useEffect(() => {
    if (ref.current) {
      registerField({
        name: 'token_id',
        ref: ref.current,
        path: 'dataset.file',
      })
    }
  }, [ref, registerField])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files
      if (!files || files.length === 0) return

      const data = new FormData()
      data.append('file', files[0])

      const response = await api.post<UploadResponse>('/tokens', data)
      const { id, url } = response.data

      setFile(id)
      setPreview(url)
    } catch (error) {
      console.error('Erro ao fazer upload do token:', error)
    }
  }

  return (
    <Styles.Container>
      <label htmlFor="token">
        <img src={preview || defaultAvatar} alt="Token do personagem" />

        <input
          type="file"
          id="token"
          accept="image/*"
          data-file={file}
          onChange={handleChange}
          ref={ref}
        />
      </label>
    </Styles.Container>
  )
}

export default TokenInput
