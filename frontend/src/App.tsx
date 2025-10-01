import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';
import Tasks from './pages/Tasks';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import Roles from './pages/Roles';
import CreateRole from './pages/CreateRole';
import EditRole from './pages/EditRole';
import Cabinets from './pages/Cabinets';
import CreateCabinet from './pages/CreateCabinet';
import EditCabinet from './pages/EditCabinet';
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import Reports from './pages/Reports';
import Reinstatements from './pages/Reinstatements';
import CreateReinstatement from './pages/CreateReinstatement';
import EditReinstatement from './pages/EditReinstatement';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/users/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateUser />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/users/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <EditUser />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <Layout>
                  <Tasks />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/tasks/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateTask />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/tasks/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <EditTask />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/roles" element={
              <ProtectedRoute>
                <Layout>
                  <Roles />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/roles/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateRole />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/roles/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <EditRole />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/cabinets" element={
              <ProtectedRoute>
                <Layout>
                  <Cabinets />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/cabinets/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateCabinet />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/cabinets/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <EditCabinet />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <Layout>
                  <Jobs />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/jobs/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateJob />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/jobs/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <EditJob />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reinstatements" element={
              <ProtectedRoute>
                <Layout>
                  <Reinstatements />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reinstatements/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateReinstatement />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reinstatements/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <EditReinstatement />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
