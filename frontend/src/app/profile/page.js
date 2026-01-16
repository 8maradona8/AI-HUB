'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Sidebar user={user} onLogout={handleLogout} />

            <div className="ml-64 p-6 transition-all duration-300">
                <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    My Profile
                </h1>

                <div className="bg-card rounded-xl shadow-lg border border-card-border overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 text-center border-b border-card-border">
                        <div className="w-24 h-24 bg-background/50 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-gray-400 border-4 border-card shadow-xl">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
                        <p className="text-blue-400 font-medium">{user.role?.name}</p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                            <div className="p-3 bg-background/50 rounded border border-card-border transition-colors">
                                {user.email}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Account Role</label>
                            <div className="p-3 bg-background/50 rounded border border-card-border flex items-center justify-between">
                                <span>{user.role?.name}</span>
                                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">Read-Only</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Role changes must be requested from an administrator.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-card-border">
                            <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
