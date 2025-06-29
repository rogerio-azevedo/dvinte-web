import React from 'react'
import { Container, ClassInput, ClassValueInput } from './styles'

interface CharacterClass {
  id: number
  name: string
  level: number
}

interface CharClassProps {
  classes: CharacterClass[]
}

const CharClass: React.FC<CharClassProps> = ({ classes }) => {
  return (
    <Container>
      <ul>
        {classes?.map((item, index) => (
          <li key={item.id + index}>
            <ClassInput readOnly defaultValue={item.name} />
            <ClassValueInput readOnly defaultValue={item.level} />
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default CharClass
