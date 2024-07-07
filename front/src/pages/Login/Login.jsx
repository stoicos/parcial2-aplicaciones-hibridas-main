import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.scss'

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState("")
  const {setUser} = useContext(AuthContext)
  const navigate = useNavigate()

  // https://www.npmjs.com/package/js-cookie
  const handleLogin = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/users/login", userData)
    .then((res) => {
      console.log(res)
      setUser(res.data.usuario)
      Cookies.set('jwToken', res.data.jwToken, {expires: 1})
      // localStorage vs cookies
      navigate('/')
    })
    .catch((error) => {
      console.log(error)
      setError(error.response.data.message)
    })
  }


  return (
    <div className={styles.Container}>
      <h1>Ingresar</h1>
      <form>
          <label>Email</label>
          <input type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
          <label>Contraseña</label>
          <input type="password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} />
        <button onClick={handleLogin}>Ingresar</button>
      </form>
       {
        error && <p>{error}</p>
       }
    </div>
  )
}

export {Login}