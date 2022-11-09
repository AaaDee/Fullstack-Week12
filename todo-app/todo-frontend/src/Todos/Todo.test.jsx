import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { Todo } from './Todo'

test('renders content', () => {
  const todo = {
    text: 'Component testing is done with react-testing-library',
    done: false,
  }

  const dummyOnClick = () => {};

  render(<Todo todo={todo} onClickComplete={dummyOnClick} onClickDelete={dummyOnClick}/>)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})