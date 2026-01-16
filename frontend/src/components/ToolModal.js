'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/utils/api';
import { useToast } from '@/context/ToastContext';
import Modal from './Modal';

export default function ToolModal({ tool, categories, roles, onClose, refresh }) {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        url: '',
        image_url: '',
        categories: [], // Array of IDs
        roles: [],      // Array of IDs
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (tool) {
            setFormData({
                name: tool.name,
                description: tool.description,
                url: tool.url,
                image_url: tool.image_url || '',
                categories: tool.categories ? tool.categories.map(c => c.id) : [],
                roles: tool.targetRoles ? tool.targetRoles.map(r => r.id) : (tool.target_roles ? tool.target_roles.map(r => r.id) : []),
            });
        } else {
            // Reset form for new tool
            setFormData({
                name: '',
                description: '',
                url: '',
                image_url: '',
                categories: [],
                roles: [],
            });
        }
    }, [tool]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Helper for multi-select (checkboxes)
    const toggleSelection = (field, id) => {
        setFormData(prev => {
            const current = prev[field];
            if (current.includes(id)) {
                return { ...prev, [field]: current.filter(item => item !== id) };
            } else {
                return { ...prev, [field]: [...current, id] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const endpoint = tool ? `/tools/${tool.id}` : '/tools';
        const method = tool ? 'PUT' : 'POST';

        try {
            const res = await apiFetch(endpoint, {
                method,
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                refresh();
                onClose();
                addToast(tool ? 'Tool updated successfully' : 'Tool added successfully', 'success');
            } else {
                addToast('Failed to save tool.', 'error');
            }
        } catch (error) {
            addToast('An error occurred.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={tool ? 'Edit Tool' : 'Add New Tool'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Tool Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                        rows="3"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">URL</label>
                        <input
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Image URL (Optional)</label>
                        <input
                            type="url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Categories</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 border border-card-border rounded-xl bg-background/50">
                        {categories.map(cat => (
                            <label key={cat.id} className="inline-flex items-center space-x-2 bg-card border border-card-border px-3 py-1.5 rounded-lg cursor-pointer hover:bg-background transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.categories.includes(cat.id)}
                                    onChange={() => toggleSelection('categories', cat.id)}
                                    className="form-checkbox text-blue-500 rounded bg-background border-card-border focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="text-sm font-medium text-foreground/80">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Target Roles */}
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Target Roles</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 border border-card-border rounded-xl bg-background/50">
                        {roles.map(role => (
                            <label key={role.id} className="inline-flex items-center space-x-2 bg-card border border-card-border px-3 py-1.5 rounded-lg cursor-pointer hover:bg-background transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.roles.includes(role.id)}
                                    onChange={() => toggleSelection('roles', role.id)}
                                    className="form-checkbox text-purple-500 rounded bg-background border-card-border focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="text-sm font-medium text-foreground/80">{role.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4 space-x-3 border-t border-card-border mt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-background border border-card-border hover:bg-card text-foreground rounded-lg transition-all font-bold uppercase tracking-wider text-xs"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (tool ? 'Update Tool' : 'Add Tool')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
