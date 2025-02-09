import React, { useCallback, useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import type { Container, Engine, ISourceOptions } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

const desktopOptions: ISourceOptions = {
  fpsLimit: 60,
  fullScreen: {
    enable: false
  },
  background: {
    color: '#000000',
    opacity: 0
  },
  interactivity: {
    detect_on: 'window',
    events: {
      onHover: {
        enable: true,
        mode: ['bubble', 'connect']
      },
      resize: {
        enable: true
      }
    },
    modes: {
      bubble: {
        distance: 250,
        duration: 1,
        opacity: 0.8,
        size: 1.5,
        color: {
          value: ['#5bc0eb']
        }
      },
      connect: {
        distance: 50,
        lineLinked: {
          opacity: 0.2
        },
        radius: 300
      }
    }
  },
  particles: {
    color: {
      value: '#000000'
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: 'out',
      random: true,
      speed: 4,
      straight: true
    },
    number: {
      density: {
        enable: true
        // value_area: 800
      },
      value: 400
    },
    opacity: {
      value: 0
    },
    shape: {
      type: 'rectangle'
    },
    size: {
      // random: {
      //   enable: true,
      //   minimumValue: 10
      // },
      value: 15
    }
  },
  retina_detect: true
}

const mobileOptions: ISourceOptions = {
  fpsLimit: 60,
  fullScreen: {
    enable: false
  },
  background: {
    color: '#000000',
    opacity: 0
  },
  interactivity: {
    detect_on: 'window',
    events: {
      onClick: {
        enable: true,
        mode: ['repulse']
      },
      resize: {
        enable: true
      }
    },
    modes: {
      repulse: {
        distance: 150,
        duration: 1
      }
    }
  },
  particles: {
    color: {
      value: '#5bc0eb' // Changed to white for visibility
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: 'out',
      random: true,
      speed: 4,
      straight: false
    },
    number: {
      density: {
        enable: true
        // value_area: 800
      },
      value: 300 // Reduced slightly for better spacing
    },
    links: {
      enable: true,
      distance: 200,
      color: '#5bc0eb',
      opacity: 0.3
    },
    opacity: {
      value: 0.5 // Increased opacity so they are visible
    },
    shape: {
      type: 'circle' // Changed to circle for better appearance
    },
    size: {
      // random: {
      //   enable: true,
      //   minimumValue: 5
      // },
      value: 3 // Reduced size slightly for aesthetics
    }
  },
  retina_detect: true
}

export default function ConnectDots() {
  const [init, setInit] = useState(false)

  const isMobile = (): boolean => {
    return (
      /Android|iPhone|iPad|iPod|Windows Phone/i.test(
        window.navigator.userAgent
      ) ||
      (window.navigator.maxTouchPoints > 0 && window.innerWidth <= 1024) // Covers tablets & touch devices
    )
  }

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particlesLoaded = async (container: Container | undefined) => {
    console.log(container)
  }

  const particleConfig = !isMobile() ? mobileOptions : desktopOptions

  return init ? (
    <Particles
      id="tsparticles"
      options={particleConfig}
      particlesLoaded={particlesLoaded}
    />
  ) : (
    <></>
  )
}
