

import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import api from '../utils/axios';

export default function Builder() {
    const { id } = useParams();
    const [bases, setBases] = useState([]);
    const [selectedBase, setSelectedBase] = useState('');
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [fields, setFields] = useState([]); // Airtable fields
    const [formFields, setFormFields] = useState([]); // Selected fields for form
    const [formName, setFormName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBases = async () => {
            try {
                const { data } = await api.get('/api/airtable/bases');
                setBases(data);
            } catch (error) {
                console.error('Failed to fetch bases', error);
            }
        };
        fetchBases();
    }, []);

    // Fetch existing form if editing
    useEffect(() => {
        if (id) {
            const fetchForm = async () => {
                setLoading(true);
                try {
                    const { data } = await api.get(`/api/forms/${id}`);
                    setFormName(data.name);
                    setSelectedBase(data.airtableBaseId);
                    // Wait for base to be set before setting table? 
                    // Actually, we need to manually trigger table fetch or wait for it.
                    // Let's just set the IDs and let the other effects handle fetching lists.
                    // But we need to ensure lists are fetched before we can show names properly?
                    // For now, setting IDs should trigger the effects.
                    setSelectedTable(data.airtableTableId);
                    setFormFields(data.fields);
                } catch (error) {
                    console.error('Failed to fetch form', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchForm();
        }
    }, [id]);

    useEffect(() => {
        if (selectedBase) {
            const fetchTables = async () => {
                try {
                    const { data } = await api.get(`/api/airtable/bases/${selectedBase}/tables`);
                    setTables(data);
                } catch (error) {
                    console.error('Failed to fetch tables', error);
                }
            };
            fetchTables();
        }
    }, [selectedBase]);

    useEffect(() => {
        if (selectedTable) {
            const table = tables.find(t => t.id === selectedTable);
            if (table) {
                setFields(table.fields);
            } else if (tables.length > 0) {
                // If table not found in list (maybe not loaded yet?), try fetching fields directly?
                // Or just wait.
            }
        }
    }, [selectedTable, tables]);

    const handleAddField = (field) => {
        // Check if already added
        if (formFields.find(f => f.airtableFieldId === field.id)) return;

        setFormFields([...formFields, {
            airtableFieldId: field.id,
            fieldName: field.name,
            fieldType: field.type,
            isRequired: false,
            conditionalLogic: { enabled: false, conditions: [] }
        }]);
    };

    const handleSave = async () => {
        try {
            const payload = {
                name: formName,
                airtableBaseId: selectedBase,
                airtableTableId: selectedTable,
                fields: formFields
            };

            if (id) {
                // Update existing
                // We need an update endpoint, but for now let's assume POST handles it or we create new?
                // Wait, we need a PUT/PATCH endpoint.
                // Let's check if we have one. If not, we might need to add it.
                // For now, let's try to use POST but maybe we should add PUT.
                // Actually, let's check routes/api.js first.
                // It seems we don't have an update route. I will add it.
                await api.put(`/api/forms/${id}`, payload);
            } else {
                await api.post('/api/forms', payload);
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save form', error);
            alert('Failed to save form');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen pb-20">
            {/* Navbar */}
            <nav className="glass-panel sticky top-0 z-50 border-b border-white/10 mb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-3">
                            <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Dashboard
                            </Link>
                        </div>
                        <span className="text-xl font-display font-bold text-white">{id ? 'Edit Form' : 'Create New Form'}</span>
                        <div className="w-24"></div> {/* Spacer for centering */}
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card p-8">
                    <div className="space-y-8">
                        {/* Form Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Form Name</label>
                            <input
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                className="input-field text-lg"
                                placeholder="e.g., Customer Feedback Survey"
                            />
                        </div>

                        {/* Base & Table Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Select Airtable Base</label>
                                <select
                                    value={selectedBase}
                                    onChange={(e) => setSelectedBase(e.target.value)}
                                    className="input-field bg-surface"
                                    disabled={!!id} // Disable changing base on edit for simplicity
                                >
                                    <option value="">Select a base...</option>
                                    {bases.map(base => (
                                        <option key={base.id} value={base.id}>{base.name}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedBase && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Table</label>
                                    <select
                                        value={selectedTable}
                                        onChange={(e) => setSelectedTable(e.target.value)}
                                        className="input-field bg-surface"
                                        disabled={!!id} // Disable changing table on edit
                                    >
                                        <option value="">Select a table...</option>
                                        {tables.map(table => (
                                            <option key={table.id} value={table.id}>{table.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {selectedTable && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                {/* Available Fields */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        Available Fields
                                    </h3>
                                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {fields.map(field => (
                                            <div key={field.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-primary/30 transition-colors group">
                                                <div>
                                                    <span className="text-gray-200 font-medium block">{field.name}</span>
                                                    <span className="text-xs text-gray-500 uppercase">{field.type}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleAddField(field)}
                                                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Form Preview */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Form Fields
                                    </h3>
                                    <div className="space-y-3 min-h-[200px] bg-black/20 rounded-xl p-4 border border-white/5">
                                        {formFields.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-500 py-10">
                                                <p>No fields added yet.</p>
                                                <p className="text-sm">Select fields from the left to add them.</p>
                                            </div>
                                        ) : (
                                            formFields.map((field, index) => (
                                                <div key={index} className="p-4 bg-surface rounded-lg border border-white/10 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="font-medium text-white">{field.fieldName}</span>
                                                        <button
                                                            onClick={() => {
                                                                const newFields = [...formFields];
                                                                newFields.splice(index, 1);
                                                                setFormFields(newFields);
                                                            }}
                                                            className="text-gray-500 hover:text-red-400 transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.isRequired}
                                                                onChange={(e) => {
                                                                    const newFields = [...formFields];
                                                                    newFields[index].isRequired = e.target.checked;
                                                                    setFormFields(newFields);
                                                                }}
                                                                className="form-checkbox h-4 w-4 text-primary rounded border-gray-600 bg-gray-700 focus:ring-primary focus:ring-offset-gray-900"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-300">Required Field</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-white/10 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={!formName || !selectedTable || formFields.length === 0}
                                className="btn-primary px-8 py-3 text-lg flex items-center gap-2"
                            >
                                <span>{id ? 'Update Form' : 'Create Form'}</span>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}