import { useEffect, useState } from 'react'
import Select, { ActionMeta, SingleValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface SelectSizeProps {
  value?: string
  changeSize: (_value: string | null) => void
  sizes?: Option[]
}

export default function SelectSize({
  value,
  changeSize,
  sizes = [],
}: SelectSizeProps) {
  const [sizeOptions, setSizeOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = sizes.map(size => ({
      value: size.value,
      label: size.label.toUpperCase(),
    }))

    setSizeOptions(data)
    setLoading(false)
  }, [sizes])

  const customStyles = {
    input: (styles: any) => ({
      ...styles,
      height: '30px',
      minHeight: '30px',
    }),
  }

  return (
    <div style={{ width: '220px', marginRight: '15px' }}>
      <Select
        value={sizeOptions.find(option => option.value === value)}
        styles={customStyles}
        maxMenuHeight={220}
        placeholder="ESCOLHA O TAMANHO"
        onChange={(
          newValue: SingleValue<Option>,
          _actionMeta: ActionMeta<Option>
        ) => changeSize(newValue ? newValue.value : null)}
        isLoading={loading}
        options={sizeOptions}
        isClearable
      />
    </div>
  )
}
