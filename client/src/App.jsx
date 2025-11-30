import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import Viewer from './pages/Viewer';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/form/:id" element={<Viewer />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/create"
                        element={
                            <PrivateRoute>
                                <Builder />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/edit/:id"
                        element={
                            <PrivateRoute>
                                <Builder />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
