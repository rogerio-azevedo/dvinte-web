import { useEffect, useRef, useState } from 'react'
import { useField } from '@rocketseat/unform'
import api from '../../services/api'
import Select, { ActionMeta, SingleValue } from 'react-select'

import { Container } from './styles'

interface Option {
  value: string
  label: string
}

interface PortraitInputProps {
  changePortrait: (_value: string | null) => void
  portraits?: Option[]
}

export default function PortraitInput({
  changePortrait,
  portraits = [],
}: PortraitInputProps) {
  const { defaultValue, registerField } = useField('avatar')

  const [file, setFile] = useState(defaultValue && defaultValue.id)
  const [preview, setPreview] = useState(defaultValue && defaultValue.url)
  const [portraitOptions, setPortraitOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      registerField({
        name: 'portrait_id',
        ref: ref.current,
        path: 'dataset.file',
      })
    }
  }, [ref, registerField])

  useEffect(() => {
    const data = portraits.map(portrait => ({
      value: portrait.value,
      label: portrait.label.toUpperCase(),
    }))

    setPortraitOptions(data)
    setLoading(false)
  }, [portraits])

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return

    const data = new FormData()

    data.append('file', e.target.files[0])

    const response = await api.post('portraits', data)

    const { id, url } = response.data

    setFile(id)
    setPreview(url)
  }

  const customStyles = {
    input: (styles: any) => ({
      ...styles,
      height: '30px',
      minHeight: '30px',
    }),
  }

  return (
    <Container>
      <label htmlFor="avatar">
        <img
          src={
            preview || 'https://api.adorable.io/avatars/50/abott@adorable.png'
          }
          alt=""
        />

        <input
          type="file"
          id="avatar"
          accept="image/*"
          data-file={file}
          onChange={handleChange}
          ref={ref}
        />
      </label>

      <div style={{ width: '220px', marginRight: '15px' }}>
        <Select
          styles={customStyles}
          maxMenuHeight={220}
          placeholder="ESCOLHA O RETRATO"
          onChange={(
            newValue: SingleValue<Option>,
            _actionMeta: ActionMeta<Option>
          ) => changePortrait(newValue ? newValue.value : null)}
          isLoading={loading}
          options={portraitOptions}
          isClearable
        />
      </div>
    </Container>
  )
}
