import { useEffect } from 'react'

interface ScriptConfig {
  type?: string
  src: string
  integrity?: string
  crossorigin?: string
  async: boolean
}

const ScriptLoader: React.FC = () => {
  const scripts: ScriptConfig[] = []

  useEffect(() => {
    const loadedScripts: HTMLScriptElement[] = []

    scripts.forEach(config => {
      const script = document.createElement('script')

      if (config.type) script.type = config.type
      script.src = config.src
      if (config.integrity) script.integrity = config.integrity
      if (config.crossorigin) script.crossOrigin = config.crossorigin
      script.async = config.async

      document.body.appendChild(script)
      loadedScripts.push(script)
    })

    return () => {
      // Cleanup: remove scripts when component unmounts
      loadedScripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      })
    }
  }, []) // Removed scripts from dependency array to avoid re-creating scripts

  return null
}

export default ScriptLoader
