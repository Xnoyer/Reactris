import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components'
import { darken, lighten } from 'polished'
import { ReactrisContext } from '../../ReactrisContext'
import { Brick } from '../../types'

const BrickNode = styled('div')<{ color: Brick['color']; size: number }>`
  border-width: ${({ size }) => size * 0.15}px;
  border-style: solid;
  border-top-color: ${({ color }) => darken(0.1, color)};
  border-left-color: ${({ color }) => darken(0.15, color)};
  border-right-color: ${({ color }) => lighten(0.1, color)};
  border-bottom-color: ${({ color }) => lighten(0.15, color)};
  background-color: ${({ color }) => color};
  box-sizing: border-box;
  position: absolute;
`

export const BrickComponent = ({ color, column, line }: Brick): ReactElement => {
  const { tileSize, y, height } = useContext(ReactrisContext)
  return (
    <BrickNode
      color={color}
      size={tileSize}
      style={{
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        top: `${y + (height - line - 1) * tileSize}px`,
        left: `${column * tileSize}px`,
      }}
    />
  )
}
