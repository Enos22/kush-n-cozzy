import { useState } from 'react'
import Home from './components/Home'
import { createBrowserRouter, Routes, Route, BrowserRouter } from 'react-router-dom'
import ProductList from './pages/ProductList'

import './App.css'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Products' element={<ProductList />} />


      </Routes>

    </BrowserRouter>

  )
}

export default App
