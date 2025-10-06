import React from 'react'
import RenderWorldMap from '../../components/CombatComponents/RenderWorldMap'

const WorldMap: React.FC = () => {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full h-full">
        <RenderWorldMap />
      </div>
    </div>
  )
}

export default WorldMap
