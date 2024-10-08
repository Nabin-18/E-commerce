import React from 'react'
import Navbar from './components/navbar/Navbar'
import { BrowserRouter } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Shop from './pages/Shop'
import ShopCatergory from './pages/ShopCatergory'
import Product from './pages/Product'
import Cart from './pages/Cart'
import LoginSignup from './pages/LoginSignup'
import Footer from './components/Footer/Footer'
import men_banner from './components/Assets/men.png'
import women_banner from './components/Assets/women.png'
import kids_banner from './components/Assets/kid.png'
import Success from './components/Success/Success'
import Error from './components/Error/Error'
import Cancel from './components/Cancel/Cancel'
import PaymentSuccess from './components/PaymentSuccess/PaymentSuccess'


function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />

          <Route path='/payment-success' element={<PaymentSuccess />} />
          <Route path='/success' element= {<Success />} />
          <Route path='/error' element= {<Error />} />
          <Route path='/cancel' element= {<Cancel />} />
          <Route path='/men' element={<ShopCatergory banner={men_banner} category={"men"} />} />
          <Route path='/women' element={<ShopCatergory banner={women_banner} category={"women"} />} />
          <Route path='/kid' element={<ShopCatergory banner={kids_banner} category={"kid"} />} />
          <Route path='/product' element={<Product />}>
            <Route path=':productId' element={<Product />} />

          </Route>

          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />


        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App