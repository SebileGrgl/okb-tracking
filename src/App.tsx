import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { useAuth } from './hooks/useAuth'
import { useProfile } from './hooks/useProfile'
import { PageLoader } from './components/ui'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/auth/Login'
import Onboarding from './pages/auth/Onboarding'
import Dashboard from './pages/Dashboard'
import NewRecord from './pages/NewRecord'
import Records from './pages/Records'
import Checklists from './pages/Checklists'
import Insights from './pages/Insights'
import Activities from './pages/Activities'
import Profile from './pages/Profile'
import Crisis from './pages/Crisis'

function AppRoutes() {
  const { data: profile, isLoading, isError } = useProfile()

  if (isLoading) return <PageLoader />

  if (!isError && profile && !profile.onboarding_completed) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/kriz" element={<Crisis />} />
      <Route element={<AppLayout />}>
        <Route index               element={<Dashboard />} />
        <Route path="kayit"        element={<NewRecord />} />
        <Route path="kayitlar"     element={<Records />} />
        <Route path="kontrol"      element={<Checklists />} />
        <Route path="analiz"       element={<Insights />} />
        <Route path="aktiviteler"  element={<Activities />} />
        <Route path="profil"       element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function AuthGate() {
  const { user, loading } = useAuth()

  if (loading) return <PageLoader />
  if (!user)   return <Login />

  return <AppRoutes />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AuthGate />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
