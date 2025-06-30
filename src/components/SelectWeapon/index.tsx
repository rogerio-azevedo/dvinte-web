import { useMemo } from 'react'
import Select, { StylesConfig } from 'react-select'

interface Weapon {
  id: number
  name: string
  nickname?: string | null
}

interface Option {
  value: number
  label: string
}

interface SelectWeaponProps {
  changeWeapon: (option: Option | null) => void
  weapons?: Weapon[]
}

export default function SelectWeapon({
  changeWeapon,
  weapons = [],
}: SelectWeaponProps) {
  const weaponOptions = useMemo(
    () =>
      weapons.map(weapon => ({
        value: weapon.id,
        label: weapon.nickname?.trim()
          ? weapon.nickname.toUpperCase()
          : weapon.name.toUpperCase(),
      })),
    [weapons]
  )

  const customStyles: StylesConfig<Option, false> = {
    input: styles => ({
      ...styles,
      height: '30px',
      minHeight: '30px',
    }),
    control: styles => ({
      ...styles,
      backgroundColor: 'white',
      borderColor: '#ddd',
      '&:hover': {
        borderColor: '#999',
      },
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? '#6f0000'
        : isFocused
        ? 'rgba(111, 0, 0, 0.1)'
        : 'white',
      color: isSelected ? 'white' : '#333',
      cursor: 'pointer',
    }),
  }

  return (
    <div style={{ width: '320px' }}>
      <Select<Option>
        styles={customStyles}
        maxMenuHeight={220}
        placeholder="ESCOLHA A ARMA"
        onChange={changeWeapon}
        options={weaponOptions}
        isClearable
      />
    </div>
  )
}
