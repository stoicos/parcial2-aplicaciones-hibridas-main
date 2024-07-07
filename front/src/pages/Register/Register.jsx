import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Register.module.scss'

const Register = () => {

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    status: true,
  })
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/users/register", userData)
    .then((res) => {
      navigate('/login')
    })
    .catch((error) => {
      console.log(error)
      setError(error.response.data.message)
    })
  }


  return (
    <div className={styles.Container}>
      <h1>Registrarse</h1>
      <form>
          <label>Nombre</label>
          <input type="text" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
          <label>Nombre de usuario</label>
          <input type="text" value={userData.username} onChange={(e) => setUserData({...userData, username: e.target.value})} />
          <label>Email</label>
          <input type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
          <label>Contraseña</label>
          <input type="password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} />
        <button onClick={handleRegister}>Registrarse</button>
      </form>
      {
        error && <p>{error}</p>
      }
    </div>
  )
}

export {Register}