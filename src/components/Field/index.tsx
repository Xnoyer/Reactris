import React, { ReactElement, useContext, useEffect } from 'react'
import { ReactrisContext } from '../../ReactrisContext'
import { BrickComponent } from '../Brick'

export const Field = (): ReactElement => {
  const { tileSize, width, height, addBricks, bricks, removeBrick } = useContext(
    ReactrisContext,
  )

  useEffect(() => {
    addBricks([
      { line: 0, column: 0, color: '#AABB00' },
      { line: 1, column: 0, color: '#BB00AA' },
    ])
    addBricks([
      { line: 0, column: 1, color: '#AABBFF' },
      { line: 1, column: 1, color: '#00AABB' },
      { line: 0, column: 2, color: '#AABB00' },
    ])
    removeBrick({ line: 0, column: 2, color: '#AABB00' })
  }, [addBricks])

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
