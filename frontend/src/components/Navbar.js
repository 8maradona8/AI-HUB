'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar({ user, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const getRoleMenuItems = () => {
        const role = user?.role?.name;
        switch (role) {
            case 'Owner':
                return (
                    <>
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Admin Panel</a>
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">User Management</a>
                    </>
                );
            case 'Backend':
                return (
                    <>
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">API Docs</a>
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Server Status</a>
                    </>
                );
            case 'Frontend':
                return (
                    <>
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Design System</a>
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Components</a>
                    </>
                );
            case 'QA':
                return (
                    <>
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Bug Tracker</a>
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Test Reports</a>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <nav className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                AI Hub
                            </span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900">
                                    Dashboard
                                </Link>
                                <Link href="/profile" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700">
                                    Profile
                                </Link>
                                {user?.role?.name && (
                                    <>
                                        {/* Desktop Role Menu items can be more standard links here if needed, 
                                          but for now keeping the "Quick Links" concept or integrating them */}
                                        {/* For desktop, maybe just a dropdown or extra links? 
                                          Let's reuse the logic but style it for desktop */}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-200">{user?.name}</div>
                                <div className="text-xs text-blue-400 uppercase">{user?.role?.name}</div>
                            </div>
                            <button
                                onClick={onLogout}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1 rounded-md text-sm font-medium border border-red-500/50 transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state. */}
            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/dashboard" className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">
                            Dashboard
                        </Link>
                        <Link href="/profile" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                            Profile
                        </Link>
                        {getRoleMenuItems()}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-700">
                        <div className="flex items-center px-5">
                            <div className="ml-3">
                                <div className="text-base font-medium leading-none text-white">{user?.name}</div>
                                <div className="text-sm font-medium leading-none text-gray-400 mt-1">{user?.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            <button
                                onClick={onLogout}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
