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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tool Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        rows="3"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">URL</label>
                        <input
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL (Optional)</label>
                        <input
                            type="url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Categories</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 border border-gray-300 rounded-md bg-gray-50">
                        {categories.map(cat => (
                            <label key={cat.id} className="inline-flex items-center space-x-2 bg-white border border-gray-300 px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.categories.includes(cat.id)}
                                    onChange={() => toggleSelection('categories', cat.id)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Target Roles */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Roles</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 border border-gray-300 rounded-md bg-gray-50">
                        {roles.map(role => (
                            <label key={role.id} className="inline-flex items-center space-x-2 bg-white border border-gray-300 px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.roles.includes(role.id)}
                                    onChange={() => toggleSelection('roles', role.id)}
                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">{role.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (tool ? 'Update Tool' : 'Add Tool')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
