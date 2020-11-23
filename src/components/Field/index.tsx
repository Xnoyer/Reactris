import React, { ReactElement, useContext } from 'react'
import { ViewContext } from '../../ViewContext'
import { BrickComponent } from '../Brick'

export const Field = (): ReactElement => {
  const { tileSize, width, height, bricks } = useContext(
    ViewContext,
  )

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: `${tileSize * width}px`,
          height: `${tileSize * height}px`,
          border: '1px solid black',
          position: 'relative',
        }}
      >
        {bricks.map((brick) => (
          <BrickComponent key={`${brick.line}${brick.column}`} {...brick} />
        ))}
      </div>
    </div>
  )
}
