import { Container, ClassInput, ClassValueInput } from './styles'

interface CharClassProps {
  classes: any[]
}

export default function CharClass({ classes }: CharClassProps) {
  return (
    <Container>
      <ul>
        {classes?.map(item => (
          <li key={Math.random()}>
            <ClassInput readOnly defaultValue={item.name} />
            <ClassValueInput readOnly defaultValue={item.level} />
          </li>
        ))}
      </ul>
    </Container>
  )
}
