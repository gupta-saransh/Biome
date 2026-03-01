import { Routes, Route, Navigate } from 'react-router-dom'
import useStore from './store/useStore'

// Layout
import Layout from './components/Layout'

// Screens
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import CheckIn from './screens/CheckIn'
import Label from './screens/Label'
import Validate from './screens/Validate'
import Adapt from './screens/Adapt'
import Planner from './screens/Planner'
import StepBack from './screens/StepBack'
import Settings from './screens/Settings'
import Chat from './screens/Chat'

function ProtectedRoute({ children }) {
  const onboardingComplete = useStore((s) => s.onboardingComplete)
  if (!onboardingComplete) return <Navigate to="/onboarding" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/step-back" element={<StepBack />} />

      {/* Flow screens (no bottom nav — focused experience) */}
      <Route
        path="/flow/:mode/check-in"
        element={<ProtectedRoute><CheckIn /></ProtectedRoute>}
      />
      <Route
        path="/flow/:mode/label"
        element={<ProtectedRoute><Label /></ProtectedRoute>}
      />
      <Route
        path="/flow/:mode/validate"
        element={<ProtectedRoute><Validate /></ProtectedRoute>}
      />
      <Route
        path="/flow/:mode/adapt"
        element={<ProtectedRoute><Adapt /></ProtectedRoute>}
      />

      {/* Main app with bottom nav */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
