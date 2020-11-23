export type Brick = {
  column: number
  line: number
  color: string
  moveOffset?: number
}

export type LogicBrick = [number, number]

export type GameField = string[][]
