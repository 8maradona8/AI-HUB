'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/api';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await apiFetch('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
                    <div className="mb-8">
                        <span className="text-6xl font-bold text-white">🚀</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">AI Hub</h1>
                    <p className="text-xl text-white/80 max-w-md">
                        Discover, share, and organize the best AI tools for your team.
                    </p>

                    <div className="mt-12 grid grid-cols-3 gap-8 text-white/60">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">100+</div>
                            <div className="text-sm">AI Tools</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">6</div>
                            <div className="text-sm">Roles</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">∞</div>
                            <div className="text-sm">Possibilities</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background text-foreground p-8 transition-colors duration-300">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <span className="text-4xl">🚀</span>
                        <h1 className="text-2xl font-bold mt-2">AI Hub</h1>
                    </div>

                    <div className="bg-card backdrop-blur-sm p-8 rounded-2xl border border-card-border shadow-2xl">
                        <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
                        <p className="text-gray-500 mb-6">Sign in to your account</p>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-foreground transition-all placeholder:text-gray-600"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-foreground transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-sm font-medium">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-blue-500 hover:text-blue-400 font-bold">
                                    Create one
                                </Link>
                            </p>
                        </div>

                        <div className="mt-4 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold opacity-50">
                            Demo: admin@example.com / password
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
