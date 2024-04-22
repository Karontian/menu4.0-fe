import { getByText, queryByText, render } from '@testing-library/react'
import {MemoryRouter, Route, Routes, Router} from 'react-router-dom'
import NotFound from './notFound'

jest.useFakeTimers()

test('renders NotFound component', ()=>{
    const {getByText} = render(
        <MemoryRouter initialEntries={['/random']}>
            <NotFound/>
        </MemoryRouter>
    )
    const linkElement = getByText(/404 WRONG PAGE, you're being redirected in 3, 2... ... thanks/i)
    expect(linkElement).toBeInTheDocument();
})


