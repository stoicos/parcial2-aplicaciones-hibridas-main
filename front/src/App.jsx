import { Routes, Route } from 'react-router-dom'
import styles from './App.module.scss'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { Home, Login, Register, DirectorDetail, MovieDetail, EditProfile } from './pages'
import ProtectedRoutes from './utils/ProtectedRoutes'

function App() {

  return (
    <>
      <div className={styles.App}>
        <Navbar/>
        <Routes>
          <Route element={<ProtectedRoutes/>}>
              <Route path="/" element={<Home/>}/>
              <Route path="/directors/:id" element={<DirectorDetail/>} />
              <Route path="/movies/:id" element={<MovieDetail/>} />
              <Route path="/edit/:id" element={<EditProfile/>} />
          </Route>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
        <Footer/>

      </div>
    </>
  )
}

export default App
