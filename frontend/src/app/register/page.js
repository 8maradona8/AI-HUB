'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/api';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role_id: '',
    });
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        apiFetch('/roles')
            .then(res => res.json())
            .then(data => {
                setRoles(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, role_id: data[0].id }));
                }
            })
            .catch(err => console.error('Failed to fetch roles', err));
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await apiFetch('/register', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/dashboard');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-32 left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-32 right-32 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
                    <div className="mb-8">
                        <span className="text-6xl font-bold text-white">✨</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Join AI Hub</h1>
                    <p className="text-xl text-white/80 max-w-md">
                        Create your account and start discovering amazing AI tools curated for your role.
                    </p>

                    <div className="mt-12 space-y-4 text-left">
                        <div className="flex items-center gap-3 text-white/80">
                            <svg className="w-6 h-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Role-based recommendations</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                            <svg className="w-6 h-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Share your favorite tools</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                            <svg className="w-6 h-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Collaborate with your team</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background text-foreground p-8 transition-colors duration-300">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <span className="text-4xl">✨</span>
                        <h1 className="text-2xl font-bold mt-2">Join AI Hub</h1>
                    </div>

                    <div className="bg-card backdrop-blur-sm p-8 rounded-2xl border border-card-border shadow-2xl">
                        <h2 className="text-2xl font-bold mb-2">Create account</h2>
                        <p className="text-gray-500 mb-6">Fill in your details to get started</p>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-foreground transition-all placeholder:text-gray-600"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-foreground transition-all placeholder:text-gray-600"
                                    placeholder="john@company.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                                <select
                                    value={formData.role_id}
                                    onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-foreground transition-all"
                                >
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-foreground transition-all placeholder:text-gray-600"
                                    placeholder="Min 6 characters"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-xl shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {isLoading ? 'Creating...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-sm font-medium">
                                Already have an account?{' '}
                                <Link href="/login" className="text-purple-500 hover:text-purple-400 font-bold">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
