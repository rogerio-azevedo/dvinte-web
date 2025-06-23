import { useState, useRef, useEffect } from 'react'
import { useField } from '@rocketseat/unform'
import api from '../../services/api'

import { Container } from './styles'

export default function TokenInput() {
  const { defaultValue, registerField } = useField('token')

  const [file, setFile] = useState(defaultValue && defaultValue.id)
  const [preview, setPreview] = useState(defaultValue && defaultValue.url)

  const ref = useRef()

  useEffect(() => {
    if (ref.current) {
      registerField({
        name: 'token_id',
        ref: ref.current,
        path: 'dataset.file',
      })
    }
  }, [ref, registerField])

  async function handleChange(e) {
    const data = new FormData()

    data.append('file', e.target.files[0])

    const response = await api.post('/tokens', data)

    const { id, url } = response.data

    setFile(id)
    setPreview(url)
  }

  return (
    <Container>
      <label htmlFor="token">
        <img
          src={
            preview || 'https://api.adorable.io/avatars/50/abott@adorable.png'
          }
          alt=""
        />

        <input
          type="file"
          id="token"
          accept="image/*"
          data-file={file}
          onChange={handleChange}
          ref={ref}
        />
      </label>
    </Container>
  )
}
