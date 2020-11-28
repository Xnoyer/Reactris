import { useCallback, useContext, useEffect, useRef } from 'react'
import { transparentize } from 'polished'
import { ViewContext } from '../../ViewContext'
import { Brick, GameField } from '../../types'
import { Figure } from '../../Figure'
import { LEVEL_SPEED } from '../../constants'

const FADE_TIMEOUT = 200

const convertToBricks = (gameGrid: GameField, height: number): Brick[] => {
  return gameGrid.flatMap((row, rowIndex) => {
    return row.flatMap((cell, columnIndex) => {
      if (cell) {
        return [
          {
            line: height - rowIndex - 1,
            column: columnIndex,
            color: cell,
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

export const Game = (): null => {
  const { width, height, setBricks, gameOptions } = useContext(ViewContext)
  const gameGrid = useRef<GameField>(
    new Array(height).fill((() => new Array(width).fill(''))()),
  )
  const gameGridBeforeFx = useRef<GameField>()
  const isGameRunning = useRef(true)
  const level = useRef(0)
  const lastLineMove = useRef(0)
  const figure = useRef<Figure>(new Figure())
  const rowsToRemove = useRef<number[]>([])
  const resetNextFrame = useRef<boolean>(false)

  const drawBricks = useCallback(() => {
    setBricks(
      convertToBricks(
        figure.current.getFigureInField(
          figure.current.getShadowBricks(gameGrid.current),
        ),
        height,
      ),
    )
  }, [setBricks])

  const freezeFigure = useCallback(() => {
    gameGrid.current = figure.current.getFigureInField(gameGrid.current)
    figure.current = new Figure()

    if (figure.current.isGonnaCollide(gameGrid.current)) {
      isGameRunning.current = false
    }

    rowsToRemove.current = performFullLineCheck(gameGrid.current)
    gameGridBeforeFx.current = JSON.parse(JSON.stringify(gameGrid.current))
  }, [])

  const gameCycle = useCallback((elapsedTime: number) => {
    const timeFromLastTick = resetNextFrame.current
      ? 0
      : elapsedTime - lastLineMove.current
    resetNextFrame.current = false

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
        if (gameOptions.lockDelay) {
          if (figure.current.isGonnaCollide(gameGrid.current)) {
            freezeFigure()
          } else {
            figure.current.moveDown()
          }
        } else {
          figure.current.moveDown()
        }
        if (
          figure.current.isGonnaCollide(gameGrid.current) &&
          !gameOptions.lockDelay
        ) {
          freezeFigure()
        }
        lastLineMove.current = elapsedTime
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
        break
      case 'ArrowRight':
        figure.current.moveRight(gameGrid.current)
        break
      case 'ArrowUp':
        figure.current.rotate(gameGrid.current)
        break
      case 'ArrowDown':
        figure.current.moveDown()
        if (figure.current.isGonnaCollide(gameGrid.current)) {
          freezeFigure()
          resetNextFrame.current = true
        }
        break
      case ' ':
        figure.current.drop(gameGrid.current)
        freezeFigure()
        resetNextFrame.current = true
    }
    drawBricks()
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', keyPressListener)
    return () => document.removeEventListener('keydown', keyPressListener)
  }, [keyPressListener])

  return null
}
