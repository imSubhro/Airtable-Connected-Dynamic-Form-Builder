import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            // Check if we have a token in URL (callback from OAuth)
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');

            if (token) {
                localStorage.setItem('token', token);
                // Clear query param
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                const { data } = await api.get('/auth/me');
                setUser(data);
            }
        } catch (error) {
            console.error('Auth check failed', error);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = () => {
        window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/airtable`;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
