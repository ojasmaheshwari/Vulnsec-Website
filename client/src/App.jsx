import Home from './components/Home'
import Login from './components/Login'
import Navbar from './components/Navbar'
import NotFound from './components/NotFound'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './components/SignUp'
import UserContext from './contexts/userContext'
import { useEffect, useState } from 'react'
import { SERVER_URL } from './api_endpoints'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${SERVER_URL}/user`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) { throw new Error("Unauthorized") };
        return res.json();
      })
      .then(data => setUser({ username: data.username, email: data.email }))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ user, setUser }}>
          <Navbar />
          <Routes>
            <Route index element={<Home />}></Route>
            <Route path="*" element={<NotFound />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/sign-up' element={<SignUp />}></Route>
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
