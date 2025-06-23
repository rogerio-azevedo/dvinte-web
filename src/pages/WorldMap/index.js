import RenderWorldMap from '../../components/CombatComponents/RenderWorldMap'

import { Container, MapContainer } from './styles'

export default function WorldMap() {
  return (
    <Container>
      <MapContainer>
        <RenderWorldMap />
      </MapContainer>
    </Container>
  )
}
