import React, { ReactElement } from 'react'
import { Field } from './components/Field'
import { Game } from './components/Game'

export const App = (): ReactElement => {
  return (
    <>
      <Game />
      <Field />
    </>
  )
}
