import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Staff from './pages/Staff'
import Challenge from './pages/Challenge'
import Join from './pages/Join'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/join" element={<Join />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}