import { useEffect, useState } from 'react'
import Select, { ActionMeta, SingleValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface SelectArmorProps {
  changeWeapon: (_value: string | null) => void
  weapons?: Option[]
}

export default function SelectArmor({
  changeWeapon,
  weapons = [],
}: SelectArmorProps) {
  const [weaponOptions, setWeaponOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = weapons.map(weapon => ({
      value: weapon.value,
      label: weapon.label.toUpperCase(),
    }))

    setWeaponOptions(data)
    setLoading(false)
  }, [weapons])

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
        styles={customStyles}
        maxMenuHeight={220}
        placeholder="ESCOLHA A ARMA"
        onChange={(
          newValue: SingleValue<Option>,
          _actionMeta: ActionMeta<Option>
        ) => changeWeapon(newValue ? newValue.value : null)}
        isLoading={loading}
        options={weaponOptions}
        isClearable
      />
    </div>
  )
}
