'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/api';
import { useToast } from '@/context/ToastContext';

export default function AddToolPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        url: '',
        image_url: '',
        categories: [],
        roles: [],
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!token || !storedUser) {
            router.push('/login');
            return;
        }

        const parsed = JSON.parse(storedUser);
        setUser(parsed);

        // Fetch categories and roles
        fetchCategoriesAndRoles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, router]);

    const fetchCategoriesAndRoles = async () => {
        try {
            const [categoriesRes, rolesRes] = await Promise.all([
                apiFetch('/categories'),
                apiFetch('/roles')
            ]);

            const categoriesData = await categoriesRes.json();
            const rolesData = await rolesRes.json();

            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            setRoles(Array.isArray(rolesData) ? rolesData : []);
        } catch (error) {
            console.error('Failed to fetch categories and roles:', error);
            addToast('Failed to load form data', 'error');
            setCategories([]);
            setRoles([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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

        try {
            const res = await apiFetch('/tools', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                addToast('AI Tool added successfully!', 'success');
                router.push('/dashboard');
            } else {
                const errorData = await res.json();
                addToast(errorData.message || 'Failed to add tool', 'error');
            }
        } catch (error) {
            console.error('Submit error:', error);
            addToast('An error occurred', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state until mounted and user is loaded
    if (!mounted || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Add New AI Tool
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Share a new AI tool with the community
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tool Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tool Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="e.g., ChatGPT, Midjourney, Claude..."
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                rows="4"
                                placeholder="Describe what this AI tool does and how it can help users..."
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Provide a clear and concise description of the tool&apos;s purpose and features.
                            </p>
                        </div>

                        {/* URLs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tool URL
                                </label>
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="https://example.com/image.png"
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categories
                            </label>
                            <div className="flex flex-wrap gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                                {Array.isArray(categories) && categories.length > 0 ? categories.map(cat => (
                                    <label
                                        key={cat.id}
                                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${formData.categories.includes(cat.id)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                            } border`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.categories.includes(cat.id)}
                                            onChange={() => toggleSelection('categories', cat.id)}
                                            className="sr-only"
                                        />
                                        <span className="text-sm font-medium">{cat.name}</span>
                                    </label>
                                )) : (
                                    <p className="text-sm text-gray-500">Loading categories...</p>
                                )}
                            </div>
                        </div>

                        {/* Target Roles */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Roles
                            </label>
                            <div className="flex flex-wrap gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                                {Array.isArray(roles) && roles.length > 0 ? roles.map(role => (
                                    <label
                                        key={role.id}
                                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${formData.roles.includes(role.id)
                                            ? 'bg-purple-600 text-white border-purple-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                            } border`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.roles.includes(role.id)}
                                            onChange={() => toggleSelection('roles', role.id)}
                                            className="sr-only"
                                        />
                                        <span className="text-sm font-medium">{role.name}</span>
                                    </label>
                                )) : (
                                    <p className="text-sm text-gray-500">Loading roles...</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard')}
                                className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Adding Tool...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add AI Tool
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
