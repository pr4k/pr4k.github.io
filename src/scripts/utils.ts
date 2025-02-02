import Parser from 'rss-parser'

export async function fetchPosts(feedUrl: string) {
  let parser = new Parser()
  let feed = await parser.parseURL(feedUrl)
  return feed
}

export const extractLink = (content: string) => {
  return content.match(/<img[^>]+src="([^">]+)"/)?.[1] ?? ''
}

// async function fetchThumbnailsNew(techs: Array<string>) {
//   let imagesData: Array<{
//     imageUrl: string
//     backgroundColor: string
//     tech: string
//   }> = []
//   let nonImagesData: Array<{ tech: string; backgroundColor: string }> = []
//   const baseColor = 'rgb(200, 200, 200)' // Default color for missing images

//   const extractColor = async (imageUrl: string): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const img = new Image()
//       img.crossOrigin = 'Anonymous'
//       img.src = imageUrl

//       img.onload = () => {
//         const colorThief = new ColorThief()
//         const dominantColor = colorThief.getColor(img) // Returns [R, G, B]
//         resolve(`rgb(${dominantColor.join(',')})`)
//       }

//       img.onerror = () => reject('Error loading image')
//     })
//   }

//   const processImage = async (tech: string) => {
//     const imageUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tech}/${tech}-original.svg`

//     try {
//       const backgroundColor = await extractColor(imageUrl)
//       imagesData.push({ imageUrl, backgroundColor, tech })
//     } catch (error) {
//       console.warn(`Image not found for: ${tech} ${error}`)
//       nonImagesData.push({ tech, backgroundColor: baseColor })
//     }
//   }

//   await Promise.all(techs.map(processImage))

//   return { imagesData, nonImagesData }
// }

export async function fetchThumbnails(techs: Array<String>) {
  let imagesData: Array<{
    imageUrl: string
    backgroundColor: string
    slug: string
  }> = []
  let nonImagesData: Array<{
    tech: string
    backgroundColor: string
    slug: string
  }> = []

  const checkImageExists = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  const renderContent = async (imageUrl: string, tech: any) => {
    const imageExists = await checkImageExists(imageUrl)
    const techLower = tech.toLowerCase().replaceAll(' ', '-')

    if (imageExists) {
      imagesData.push({
        imageUrl,
        backgroundColor: 'rgb(200,200,200)',
        slug: techLower
      })
    } else {
      nonImagesData.push({
        tech,
        backgroundColor: 'rgb(200,200,200)',
        slug: techLower
      })
    }
  }
  const promises = techs.map(async (tech) => {
    const imageUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tech}/${tech}-original.svg`

    await renderContent(imageUrl, tech)
  })
  await Promise.all(promises)
  return { imagesData, nonImagesData }
}
