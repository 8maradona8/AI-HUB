'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/api';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/context/ToastContext';

export default function AdminPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [user, setUser] = useState(null);
    const {
        tools,
        stats,
        categories,
        roles,
        loading,
        filters,
        setFilters,
        approveTool,
        rejectTool
    } = useAdmin();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!token || !storedUser) {
            router.push('/login');
            return;
        }

        const parsed = JSON.parse(storedUser);
        if (parsed.role?.name !== 'Owner') {
            router.push('/dashboard');
            addToast('Access denied. Admin only.', 'error');
            return;
        }

        setUser(parsed);
    }, [router, addToast]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
            <Sidebar user={user} onLogout={handleLogout} />

            <main className="ml-56 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <StatCard label="Total Tools" value={stats.total_tools} color="blue" />
                            <StatCard label="Pending" value={stats.pending_tools} color="yellow" />
                            <StatCard label="Approved" value={stats.approved_tools} color="green" />
                            <StatCard label="Rejected" value={stats.rejected_tools} color="red" />
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <select
                            value={filters.category_id}
                            onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
                            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <select
                            value={filters.role_id}
                            onChange={(e) => setFilters({ ...filters, role_id: e.target.value })}
                            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        >
                            <option value="">All Roles</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Tools Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tool</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Author</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Categories</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {tools.map((tool) => (
                                <tr key={tool.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm">{tool.name}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs mt-0.5">
                                                {tool.description}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        {tool.user?.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {tool.categories?.slice(0, 2).map((cat) => (
                                                <span key={cat.id} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium">
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={tool.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        {tool.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => approveTool(tool.id)}
                                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => rejectTool(tool.id)}
                                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {tool.status !== 'pending' && (
                                            <span className="text-xs text-gray-500">
                                                {tool.reviewer?.name ? `By ${tool.reviewer.name}` : '-'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {tools.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <p className="text-sm">No tools found matching your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, color }) {
    const colors = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        green: 'bg-green-50 border-green-200 text-green-700',
        red: 'bg-red-50 border-red-200 text-red-700',
    };

    return (
        <div className={`p-4 rounded-lg border ${colors[color]}`}>
            <div className="text-2xl font-semibold mb-1">{value}</div>
            <div className="text-xs font-medium opacity-80">{label}</div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        approved: 'bg-green-100 text-green-800 border-green-200',
        rejected: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded border ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
