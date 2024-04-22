import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import MenuAdmin from './components/menuAdmin'
import Table from './components/table';
import TablePaid from './components/tablePaid'
import ClientHome from './components/clientHome';
import NotFound from './components/notFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/tablePaid' element={<TablePaid/>}/>
        <Route path='/tables/:id'   element={<Table/>}/>
        <Route path='/admin' element={<MenuAdmin/>}/>
        <Route path='/' element={<ClientHome/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;
