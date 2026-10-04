import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Staff from './pages/Staff'
import Navbar from './components/Navbar'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ boxSizing: 'border-box', paddingTop: '80px', color: '#fff', textAlign: 'center', minHeight: '100vh' }}>
      <h1>{title}</h1>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenge" element={<PlaceholderPage title="Challenge" />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/join" element={<PlaceholderPage title="Join Now" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}