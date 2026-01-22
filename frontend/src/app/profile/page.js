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
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Sidebar user={user} onLogout={handleLogout} />

            <main className="ml-56 transition-all duration-300">
                <div className="max-w-3xl mx-auto px-6 py-6">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile</h1>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-gray-50 p-6 text-center border-b border-gray-200">
                            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-2xl font-semibold text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="mt-3 text-lg font-semibold text-gray-900">{user.name}</h2>
                            <p className="text-sm text-gray-500 mt-1">{user.role?.name}</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-900">
                                    {user.email}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Role</label>
                                <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-between">
                                    <span className="text-sm text-gray-900">{user.role?.name}</span>
                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Read-Only</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">
                                    Role changes must be requested from an administrator.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
