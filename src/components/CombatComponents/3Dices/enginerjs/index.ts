import { useEffect } from 'react'

interface ScriptConfig {
  type?: string
  src: string
  integrity?: string
  crossorigin?: string
  async: boolean
}

const ScriptLoader: React.FC = () => {
  const scripts: ScriptConfig[] = [
    // {
    //   src: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js',
    //   integrity: 'sha512-yNJzAsg5JyP91u+sLHlUDULMBd3hmEiVkYeeN1cQBKaLZ7EyT6oH2u5THNIRM2Fu6VKcZJv+F/QAp1h/qzy9Ow==',
    //   crossorigin: 'anonymous',
    //   async: false
    // },
    // {
    //   type: 'text/javascript',
    //   src: 'libs/cannon.min.js',
    //   async: false
    // },
    // {
    //   type: 'text/javascript',
    //   src: 'libs/teal.js',
    //   async: false
    // },
    // {
    //   type: 'text/javascript',
    //   src: 'libs/dice.js',
    //   async: false
    // },
    {
      type: 'text/javascript',
      src: 'libs/main.min.js',
      async: true,
    },
  ]

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
