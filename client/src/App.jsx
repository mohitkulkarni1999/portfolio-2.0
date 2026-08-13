// App.jsx — decides which page to show based on the URL
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <Routes>
      {/* public website */}
      <Route path="/" element={<Home />} />
      {/* admin area */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}
