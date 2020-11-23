import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { transparentize } from 'polished'
import { ViewContext } from '../../ViewContext'
import { Brick, GameField } from '../../types'
import { Figure } from '../../Figure'
import { FIELD_FOR_DEBUG, LEVEL_SPEED } from '../../constants'

const FADE_TIMEOUT = 200

const convertToBricks = (
  gameGrid: GameField,
  height: number,
  figure: Figure,
): Brick[] => {
  return gameGrid.flatMap((row, rowIndex) => {
    return row.flatMap((cell, columnIndex) => {
      if (cell) {
        const isFigure = figure.bricks.find(
          (brick) =>
            brick[0] + figure.columnOffset === columnIndex &&
            brick[1] + figure.lineOffset === rowIndex,
        )
        return [
          {
            line: height - rowIndex - 1,
            column: columnIndex,
            color: cell,
            moveOffset: isFigure ? figure.moveOffset : undefined,
          },
        ]
      }
      return []
    })
  })
}

const performFullLineCheck = (gameGrid: GameField) => {
  const rowsToRemove: number[] = []
  gameGrid.forEach((row, index) => {
    if (!row.includes('')) {
      rowsToRemove.push(index)
    }
  })
  return rowsToRemove
}

export const Game = () => {
  const { width, height, setBricks } = useContext(ViewContext)
  /*const gameGrid = useRef<GameField>(
    new Array(height).fill((() => new Array(width).fill(''))()),
  )*/
  const gameGrid = useRef<GameField>(FIELD_FOR_DEBUG)
  const gameGridBeforeFx = useRef<GameField>()
  const isGameRunning = useRef(true)
  const level = useRef(0)
  const lastLineMove = useRef(0)
  const figure = useRef<Figure>(new Figure())
  const rowsToRemove = useRef<number[]>([])

  const drawBricks = useCallback(() => {
    setBricks(
      convertToBricks(
        figure.current.getFigureInField(gameGrid.current),
        height,
        figure.current,
      ),
    )
  }, [setBricks])

  const gameCycle = useCallback((elapsedTime: number) => {
    const timeFromLastTick = elapsedTime - lastLineMove.current

    if (rowsToRemove.current.length) {
      if (timeFromLastTick >= FADE_TIMEOUT) {
        gameGrid.current = gameGrid.current.filter(
          (row, index) => !rowsToRemove.current.includes(index),
        )
        gameGrid.current = [
          ...new Array(rowsToRemove.current.length).fill(
            (() => new Array(width).fill(''))(),
          ),
          ...gameGrid.current,
        ]
        rowsToRemove.current = []
      } else {
        rowsToRemove.current.forEach((rowIndex) => {
          gameGrid.current[rowIndex] = gameGridBeforeFx.current![
            rowIndex
          ].map((color) =>
            transparentize(timeFromLastTick / FADE_TIMEOUT, color),
          )
        })
      }
    } else {
      const speed = level.current <= 29 ? LEVEL_SPEED[level.current] : 10
      if (timeFromLastTick >= speed) {
        if (figure.current.moveOffset > .5) {
          figure.current.moveDown()
        }
        if (figure.current.isGonnaCollide(gameGrid.current)) {
          gameGrid.current = figure.current.getFigureInField(gameGrid.current)
          figure.current = new Figure()

          if (figure.current.isGonnaCollide(gameGrid.current)) {
            isGameRunning.current = false
          }

          rowsToRemove.current = performFullLineCheck(gameGrid.current)
          gameGridBeforeFx.current = JSON.parse(
            JSON.stringify(gameGrid.current),
          )
        }
        figure.current.moveOffset = 0
        lastLineMove.current = elapsedTime
      } else {
        figure.current.moveOffset = timeFromLastTick / speed
      }
    }

    drawBricks()

    if (isGameRunning.current) {
      window.requestAnimationFrame(gameCycle)
    }
  }, [])

  useEffect(() => {
    drawBricks()
    window.requestAnimationFrame(gameCycle)
  }, [])

  const keyPressListener = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        figure.current.moveLeft(gameGrid.current)
        drawBricks()
        break
      case 'ArrowRight':
        figure.current.moveRight(gameGrid.current)
        drawBricks()
        break
      case 'ArrowUp':
        figure.current.rotate(gameGrid.current)
        drawBricks()
        break
      case 'ArrowDown':
        if (!figure.current.isGonnaCollide(gameGrid.current)) {
          figure.current.moveDown()
        }
        drawBricks()
        break
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', keyPressListener)
    return () => document.removeEventListener('keydown', keyPressListener)
  }, [keyPressListener])

  return null
}
