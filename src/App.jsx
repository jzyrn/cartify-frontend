import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import store from './store'
import { loadUser } from './actions/userActions'

import Header from './Components/Layout/Header'
import Footer from './Components/Layout/Footer'
import ProtectedRoute from './Components/Route/ProtectedRoute'

import Home from './Components/Home'
import ProductDetails from './Components/Product/ProductDetails'
import Cart from './Components/Cart/Cart'

import Login from './Components/User/Login'
import Register from './Components/User/Register'
import Profile from './Components/User/Profile'
import UpdateProfile from './Components/User/UpdateProfile'

function App() {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/me" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/me/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
      </Routes>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App