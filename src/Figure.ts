import { FIGURES, THEME } from './constants'
import { GameField, LogicBrick } from './types'

export class Figure {
  color: string
  figureIndex: number
  rotationIndex: number
  bricks: LogicBrick[]
  columnOffset: number
  lineOffset: number
  moveOffset: number

  constructor() {
    this.figureIndex = Math.floor(Math.random() * FIGURES.length)
    this.color = THEME[this.figureIndex]
    this.rotationIndex = 0
    this.bricks = FIGURES[this.figureIndex][this.rotationIndex]
    this.columnOffset = 5
    this.lineOffset = 0
    this.moveOffset = 0
  }

  private getNextRotation(): [LogicBrick[], number] {
    if (this.rotationIndex === FIGURES[this.figureIndex].length - 1) {
      return [FIGURES[this.figureIndex][0], 0]
    } else {
      return [FIGURES[this.figureIndex][this.rotationIndex + 1], this.rotationIndex + 1]
    }
  }

  getFigureInField(field: GameField) {
    const newField = JSON.parse(JSON.stringify(field))
    this.bricks.forEach((brick) => {
      newField[brick[1] + this.lineOffset][
        brick[0] + this.columnOffset
      ] = this.color
    })
    return newField
  }

  moveDown() {
    this.lineOffset++
  }

  moveRight(field: GameField) {
    if (this.canMoveRight(field)) {
      this.columnOffset++
    }
  }

  moveLeft(field: GameField) {
    if (this.canMoveLeft(field)) {
      this.columnOffset--
    }
  }

  rotate(field: GameField) {
    if (this.canRotate(field)) {
      const [newBricks, newIndex] = this.getNextRotation()
      this.bricks = newBricks
      this.rotationIndex = newIndex
    }
  }

  private canMoveLeft(field: GameField) {
    return !this.bricks.find(
      (brick) =>
        brick[0] + this.columnOffset === 0 ||
        field[brick[1] + this.lineOffset][brick[0] + this.columnOffset - 1] !==
          '',
    )
  }

  private canMoveRight(field: GameField) {
    return !this.bricks.find(
      (brick) =>
        brick[0] + this.columnOffset === field[0].length - 1 ||
        field[brick[1] + this.lineOffset][brick[0] + this.columnOffset + 1] !==
          '',
    )
  }

  private canRotate(field: GameField) {
    const [rotatedBricks] = this.getNextRotation()
    return !rotatedBricks.find(
      (brick) =>
        brick[1] + this.lineOffset < 0 ||
        brick[0] + this.columnOffset < 0 ||
        brick[0] + this.columnOffset === field[0].length ||
        field[brick[1] + this.lineOffset][brick[0] + this.columnOffset] !==
          '',
    )
  }

  isGonnaCollide(field: GameField): boolean {
    return !!this.bricks.find(
      (brick) =>
        brick[1] + this.lineOffset === field.length - 1 ||
        field[brick[1] + this.lineOffset + 1][brick[0] + this.columnOffset] !==
          '',
    )
  }
}
