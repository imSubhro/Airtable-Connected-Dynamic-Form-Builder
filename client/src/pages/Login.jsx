import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
    const { user, login, loading } = useAuth();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (user) return <Navigate to="/dashboard" />;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="card max-w-md w-full p-8 relative z-10 border-t border-white/20">
                <div className="text-center mb-10">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-3">
                        FormBuilder
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Create beautiful forms from your Airtable bases in seconds.
                    </p>
                </div>

                <div className="space-y-6">
                    <button
                        onClick={login}
                        className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg group"
                    >
                        <span>Login with Airtable</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        By logging in, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
