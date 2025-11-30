import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

export default function Dashboard() {
    const [forms, setForms] = useState([]);
    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const { data } = await api.get('/api/forms');
                setForms(data);
            } catch (error) {
                console.error('Failed to fetch forms', error);
            }
        };
        fetchForms();
    }, []);

    return (
        <div className="min-h-screen pb-20">
            {/* Navbar */}
            <nav className="glass-panel sticky top-0 z-50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="text-xl font-display font-bold text-white">FormBuilder</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm">Welcome, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">My Forms</h1>
                        <p className="text-gray-400">Manage and track your form submissions</p>
                    </div>
                    <Link
                        to="/create"
                        className="btn-primary flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Form
                    </Link>
                </div>

                {forms.length === 0 ? (
                    <div className="text-center py-20 card border-dashed border-2 border-white/10">
                        <div className="mx-auto h-12 w-12 text-gray-500 mb-4">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white">No forms yet</h3>
                        <p className="mt-1 text-gray-400">Get started by creating your first form.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {forms.map((form) => (
                            <div key={form._id} className="card group hover:border-primary/50 transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                            Active
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                        {form.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                                        Connected to Airtable Base
                                    </p>

                                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                        <Link
                                            to={`/form/${form._id}`}
                                            className="flex-1 text-center py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
                                            target="_blank"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            to={`/edit/${form._id}`}
                                            className="flex-1 text-center py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
