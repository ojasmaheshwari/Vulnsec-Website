import Home from './components/Home'
import Login from './components/Login'
import Navbar from './components/Navbar'
import NotFound from './components/NotFound'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './components/SignUp'

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="*" element={<NotFound />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/sign-up' element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
