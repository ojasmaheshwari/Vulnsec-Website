import Home from './components/Home'
import Login from './components/Login'
import Navbar from './components/Navbar'
import NotFound from './components/NotFound'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './components/SignUp'
import UserContext from './contexts/userContext'
import { useEffect, useState } from 'react'
import { SERVER_URL } from './api_endpoints'
import EmailVerification from './components/EmailVerification'
import UserLoadingContext from './contexts/userLoadingContext'
import Profile from './components/Profile'
import ForgotPassword from './components/ForgotPassword'
import PasswordReset from './components/PasswordReset'
import WriteUpEditor from './components/WriteUpEditor'
import WriteUp from './components/WriteUp'
import AllWriteUps from './components/AllWriteUps'

function App() {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    fetch(`${SERVER_URL}/user`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Unauthorized")
        };
        return res.json();
      })
      .then(data => {
        setUser(data.user)
      })
      .catch(err => console.error("Error:", err))
      .finally(() => setUserLoading(false))

  }, []);

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ user, setUser }}>
          <UserLoadingContext.Provider value={{ userLoading, setUserLoading }}>
            <Navbar />
            <div className="pt-20">
              <Routes>
                <Route index element={<Home />}></Route>
                <Route path="*" element={<NotFound />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/sign-up' element={<SignUp />}></Route>
                <Route path='/verify-email' element={<EmailVerification />}></Route>
                <Route path='/profile' element={<Profile />}></Route>
                <Route path='/forgot-password' element={<ForgotPassword />}></Route>
                <Route path='/password-reset' element={<PasswordReset />}></Route>
                <Route path='/create-writeup' element={<WriteUpEditor />}></Route>
                <Route path='/writeups/:uuid' element={<WriteUp />}></Route>
                <Route path='/writeups' element={<AllWriteUps />}></Route>
              </Routes>
            </div>
          </UserLoadingContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
