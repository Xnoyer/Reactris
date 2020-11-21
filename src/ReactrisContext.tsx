import React, {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { Brick } from './types'

type Props = {
  tileSize: number
  height: number
  width: number
  x: number
  y: number
  bricks: Brick[]
  addBricks: (bricks: Brick[]) => void
  removeBrick: (brick: Brick) => void
}

export const ReactrisContext = React.createContext<Props>({
  tileSize: 0,
  height: 20,
  width: 10,
  x: 0,
  y: 0,
  bricks: [],
  addBricks: () => {},
  removeBrick: () => {},
})

type ProviderProps = {
  height?: number
  width?: number
}

export const ReactrisProvider = ({
  children,
  height = 20,
  width = 10,
}: PropsWithChildren<ProviderProps>): ReactElement => {
  const [tileSize, x, y] = useMemo(() => {
    const clientWidth = document.documentElement.clientWidth
    const clientHeight = document.documentElement.clientHeight

    const fieldSize = clientWidth / 2
    const possibleTileWidth = Math.floor(fieldSize / width)
    const possibleTileHeight = Math.floor(clientHeight / height)
    const returnTileSize = Math.min(possibleTileWidth, possibleTileHeight)
    return [returnTileSize, clientWidth / 2 - (returnTileSize * width) / 2, 0]
  }, [height, width])

  const [bricks, setBricks] = useState<Brick[]>([])

  const addBricks = useCallback(
    (bricksToAdd: Brick[]) =>
      setBricks((oldBricks) => [...oldBricks, ...bricksToAdd]),
    [],
  )

  const removeBrick = useCallback(
    ({ line, column }: Brick) =>
      setBricks((oldBricks) =>
        oldBricks.filter(
          (brick) => !(brick.column === column && brick.line === line),
        ),
      ),
    [],
  )

  return (
    <ReactrisContext.Provider
      value={{
        tileSize,
        width,
        height,
        y,
        x,
        bricks,
        addBricks,
        removeBrick,
      }}
    >
      {children}
    </ReactrisContext.Provider>
  )
}
