import { useEffect } from 'react'

const EngineJS = () => {
  useEffect(() => {
    const scripts = [
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

    scripts.forEach(o => {
      const script = document.createElement('script')
      if (o.type) script.type = o.type
      script.src = o.src
      if (o.integrity) script.integrity = o.integrity
      if (o.crossorigin) script.crossOrigin = o.crossorigin
      script.async = o.async

      document.body.appendChild(script)
    })

    return () => {
      // Cleanup se necessário
    }
  }, []) // Array vazio pois scripts não mudam

  return null
}

export default EngineJS
