import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Campgrounds from './pages/Campgrounds'
import CampgroundDetail from './pages/CampgroundDetail'
import NewCampground from './pages/NewCampground'
import EditCampground from './pages/EditCampground'
import RegisterUser from './pages/RegisterUser'
import LoginUser from './pages/LoginUser'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campgrounds" element={<Campgrounds />} />
          <Route path="/campgrounds/new" element={<NewCampground />} />
          <Route path="/campgrounds/:id" element={<CampgroundDetail />} />
          <Route path="/campgrounds/:id/edit" element={<EditCampground />} />
          <Route path="/users/register" element={<RegisterUser />} />
          <Route path="/users/login" element={<LoginUser />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
