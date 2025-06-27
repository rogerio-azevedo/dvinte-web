import React from 'react'
import RenderWorldMap from '../../components/CombatComponents/RenderWorldMap'

import { Container, MapContainer } from './styles'

const WorldMap: React.FC = () => {
  return (
    <Container>
      <MapContainer>
        <RenderWorldMap />
      </MapContainer>
    </Container>
  )
}

export default WorldMap
