import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';
import LoginPage from './pages/LoginPage';
import {Dashboard} from './pages/Dashboard';
import { Employee } from './pages/Employee';
// import Signup from './components/Auth/Signup';

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <AuthProvider>
        <Router>
          <Routes>
            {/* <Route path="/signup" element={<Signup} */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                    
                  </AppLayout>
                </ProtectedRoute>
              }/>
              <Route 
              path="/employees"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Employee/>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;