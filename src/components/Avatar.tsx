import React from 'react'

interface AvatarProps {
  name?: string
  size?: number
  bgColor?: string
  textColor?: string
  fontSize?: number
}

const getInitials = (name: string): string => {
  if (!name) return '??'
  const words = name.trim().split(' ')
  return words
    .map((word) => word[0]?.toUpperCase())
    .slice(0, 2)
    .join('')
}

const getColorFromString = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return `hsl(${hash % 360}, 60%, 70%)` // Generates a pastel color
}

const Avatar: React.FC<AvatarProps> = ({
  name = 'Unknown',
  size = 50,
  bgColor,
  textColor = '#fff',
  fontSize
}) => {
  const initials = getInitials(name)
  const backgroundColor = bgColor || getColorFromString(name)

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor,
        color: textColor,
        fontSize: fontSize || size / 2.5,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        userSelect: 'none',
        textTransform: 'uppercase'
      }}
    >
      {initials}
    </div>
  )
}

export default Avatar
