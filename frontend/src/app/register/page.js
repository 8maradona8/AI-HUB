'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/api';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl animate-spin-slow"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                            <span className="text-3xl">🎯</span>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Join AI Hub</h1>
                        <p className="text-white/80 max-w-md text-lg">
                            Start your journey to discover the perfect AI tools for your role.
                        </p>
                    </div>

                    <div className="mt-12 space-y-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-300 text-sm">📊</span>
                                </div>
                                <span className="text-white font-medium">Personalized Recommendations</span>
                            </div>
                            <p className="text-white/70 text-sm">Get AI tool suggestions based on your role and workflow.</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-green-300 text-sm">🤝</span>
                                </div>
                                <span className="text-white font-medium">Team Collaboration</span>
                            </div>
                            <p className="text-white/70 text-sm">Share discoveries and learn from your colleagues.</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-300 text-sm">⚡</span>
                                </div>
                                <span className="text-white font-medium">Always Up-to-Date</span>
                            </div>
                            <p className="text-white/70 text-sm">Access the latest AI tools and innovations.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 text-center">
                        <div className="lg:hidden mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <span className="text-white font-bold text-lg">AI</span>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-300">
                            Join thousands of professionals using AI Hub
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={formData.role_id} onValueChange={(value) => handleInputChange('role_id', value)}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.id.toString()}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Creating account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Already have an account?{' '}
                                <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <Badge variant="secondary" className="text-xs">Free</Badge>
                                <Badge variant="secondary" className="text-xs">No Credit Card</Badge>
                                <Badge variant="secondary" className="text-xs">14-Day Trial</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
