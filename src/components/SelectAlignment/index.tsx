import React, { useEffect, useState } from 'react'
import Select, { ActionMeta, SingleValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface SelectAlignmentProps {
  value: string
  changeAlignment: (_value: string | null) => void
  alignments?: Option[]
}

export default function SelectAlignment({
  value,
  changeAlignment,
  alignments = [],
}: SelectAlignmentProps) {
  const [alignmentOptions, setAlignmentOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = alignments.map(alignment => ({
      value: alignment.value,
      label: alignment.label.toUpperCase(),
    }))

    setAlignmentOptions(data)
    setLoading(false)
  }, [alignments])

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
        value={alignmentOptions.find(option => option.value === value)}
        styles={customStyles}
        maxMenuHeight={220}
        placeholder="ESCOLHA O ALINHAMENTO"
        onChange={(
          newValue: SingleValue<Option>,
          _actionMeta: ActionMeta<Option>
        ) => changeAlignment(newValue ? newValue.value : null)}
        isLoading={loading}
        options={alignmentOptions}
        isClearable
      />
    </div>
  )
}
