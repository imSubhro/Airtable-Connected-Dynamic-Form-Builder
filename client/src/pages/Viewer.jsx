import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axios';

export default function Viewer() {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const { data } = await api.get(`/api/forms/${id}`);
                setForm(data);
            } catch (error) {
                console.error('Failed to fetch form', error);
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/api/forms/${id}/submit`, { answers });
            setSubmitted(true);
        } catch (error) {
            alert('Failed to submit form');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!form) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Form not found</h2>
                <p className="text-gray-400 mt-2">This form may have been deleted or is invalid.</p>
            </div>
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card max-w-md w-full p-8 text-center animate-in zoom-in duration-300">
                <div className="mx-auto h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Thank You!</h2>
                <p className="text-gray-400 mb-6">Your response has been successfully recorded.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                    Submit another response
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="card max-w-2xl w-full overflow-hidden">
                <div className="px-8 py-6 border-b border-white/10 bg-white/5">
                    <h1 className="text-2xl font-display font-bold text-white">{form.name}</h1>
                    <p className="text-sm text-gray-400 mt-1">Please fill out the form below</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {form.fields.map((field) => (
                        <div key={field.airtableFieldId} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                {field.fieldName} {field.isRequired && <span className="text-secondary">*</span>}
                            </label>

                            {field.fieldType === 'multilineText' ? (
                                <textarea
                                    required={field.isRequired}
                                    rows={4}
                                    className="input-field resize-none"
                                    placeholder={`Enter your ${field.fieldName.toLowerCase()}...`}
                                    onChange={(e) => setAnswers({ ...answers, [field.airtableFieldId]: e.target.value })}
                                />
                            ) : (
                                <input
                                    type="text"
                                    required={field.isRequired}
                                    className="input-field"
                                    placeholder={`Enter your ${field.fieldName.toLowerCase()}...`}
                                    onChange={(e) => setAnswers({ ...answers, [field.airtableFieldId]: e.target.value })}
                                />
                            )}
                        </div>
                    ))}

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full btn-primary py-3 text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/40"
                        >
                            Submit Response
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
