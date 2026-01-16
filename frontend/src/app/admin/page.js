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
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Sidebar user={user} onLogout={handleLogout} />

            <main className="ml-64 p-6">
                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <StatCard label="Total Tools" value={stats.total_tools} color="blue" />
                        <StatCard label="Pending" value={stats.pending_tools} color="yellow" />
                        <StatCard label="Approved" value={stats.approved_tools} color="green" />
                        <StatCard label="Rejected" value={stats.rejected_tools} color="red" />
                    </div>
                )}

                {/* Filters */}
                <div className="bg-card rounded-xl p-4 mb-6 border border-card-border shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="bg-background border border-card-border rounded px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <select
                            value={filters.category_id}
                            onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
                            className="bg-background border border-card-border rounded px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <select
                            value={filters.role_id}
                            onChange={(e) => setFilters({ ...filters, role_id: e.target.value })}
                            className="bg-background border border-card-border rounded px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 transition-all outline-none"
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
                                className="w-full bg-background border border-card-border rounded px-3 py-2 pl-10 text-foreground focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Tools Table */}
                <div className="bg-card rounded-xl border border-card-border overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead className="bg-background/50 border-b border-card-border">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tool</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border">
                            {tools.map((tool) => (
                                <tr key={tool.id} className="hover:bg-background/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-bold text-foreground">{tool.name}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {tool.description}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {tool.user?.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {tool.categories?.map((cat) => (
                                                <span key={cat.id} className="text-[10px] bg-background border border-card-border px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={tool.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        {tool.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => approveTool(tool.id)}
                                                    className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded transition-all shadow-lg shadow-green-600/20 active:scale-95 uppercase tracking-wider"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => rejectTool(tool.id)}
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded transition-all shadow-lg shadow-red-600/20 active:scale-95 uppercase tracking-wider"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {tool.status !== 'pending' && (
                                            <span className="text-sm text-gray-500 font-medium">
                                                {tool.reviewer?.name ? `By ${tool.reviewer.name}` : '-'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {tools.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-12 h-12 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            No tools found matching your filters
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, color }) {
    const colors = {
        blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        green: 'bg-green-500/20 text-green-400 border-green-500/30',
        red: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    return (
        <div className={`p-4 rounded-xl border ${colors[color]}`}>
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-sm opacity-80">{label}</div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        approved: 'bg-green-500/20 text-green-400 border-green-500/30',
        rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    return (
        <span className={`px-2 py-1 text-xs rounded border ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
