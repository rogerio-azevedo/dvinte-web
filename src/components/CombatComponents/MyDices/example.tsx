import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

import { Container } from './styles'

interface Controls {
  start: () => void
  stop: () => void
}

const Tree: React.FC = () => {
  const [isAnimating, setAnimating] = useState<boolean>(true)
  const mount = useRef<HTMLDivElement>(null)
  const controls = useRef<Controls | null>(null)

  const box = (): (() => void) => {
    let width = window.innerWidth
    let height = window.innerHeight
    let frameId: number | null = null

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
    const cube = new THREE.Mesh(geometry, material)

    camera.position.z = 4
    scene.add(cube)
    renderer.setClearColor(0xffffff, 0)

    renderer.setSize(width, height)

    const renderScene = (): void => {
      renderer.render(scene, camera)
    }

    const handleResize = (): void => {
      if (!mount.current) return

      width = mount.current.clientWidth
      height = mount.current.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderScene()
    }

    const animate = (): void => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      renderScene()
      frameId = window.requestAnimationFrame(animate)
    }

    const start = (): void => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate)
      }
    }

    const stop = (): void => {
      if (frameId) {
        cancelAnimationFrame(frameId)
        frameId = null
      }
    }

    if (mount.current) {
      mount.current.appendChild(renderer.domElement)
    }

    window.addEventListener('resize', handleResize)
    start()

    controls.current = { start, stop }

    return (): void => {
      stop()
      window.removeEventListener('resize', handleResize)

      if (mount.current && renderer.domElement.parentNode === mount.current) {
        mount.current.removeChild(renderer.domElement)
      }

      // Clean up Three.js resources
      scene.remove(cube)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }

  useEffect(() => {
    const cleanup = box()
    return cleanup
  }, [])

  useEffect(() => {
    if (controls.current) {
      if (isAnimating) {
        controls.current.start()
      } else {
        controls.current.stop()
      }
    }
  }, [isAnimating])

  const handleContainerClick = (): void => {
    setAnimating(!isAnimating)
  }

  return <Container ref={mount} onClick={handleContainerClick} />
}

export default Tree
