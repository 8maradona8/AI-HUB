'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/api';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-3xl animate-spin-slow"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                            <span className="text-3xl">🚀</span>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">AI Hub</h1>
                        <p className="text-white/80 max-w-md text-lg">
                            Discover, share, and organize the best AI tools for your team.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-8 text-white/80">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">100+</div>
                            <div className="text-sm">AI Tools</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">6</div>
                            <div className="text-sm">Roles</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">∞</div>
                            <div className="text-sm">Possibilities</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 text-center">
                        <div className="lg:hidden mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <span className="text-white font-bold text-lg">AI</span>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-300">
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Demo Account</span>
                            </div>
                            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                <div><strong>Email:</strong> owner@company.com</div>
                                <div><strong>Password:</strong> password</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail('owner@company.com');
                                    setPassword('password');
                                }}
                                className="mt-2 text-xs text-blue-600 hover:text-blue-500 underline"
                            >
                                Fill demo credentials
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Don&apos;t have an account?{' '}
                                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <Badge variant="secondary" className="text-xs">Secure</Badge>
                                <Badge variant="secondary" className="text-xs">Private</Badge>
                                <Badge variant="secondary" className="text-xs">Team-focused</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
