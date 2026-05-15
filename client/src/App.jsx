import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Navigate } from 'react-router-dom'

// Pages (we'll create these next)
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CreatePollPage from './pages/CreatePollPage'
import PollPage from './pages/PollPage'
import AnalyticsPage from './pages/AnalyticsPage'

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/poll/:token" element={<PollPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/create-poll" element={
        <ProtectedRoute><CreatePollPage /></ProtectedRoute>
      } />
      <Route path="/analytics/:pollId" element={
        <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App