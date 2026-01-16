'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ToolCard from '@/components/ToolCard';
import ToolModal from '@/components/ToolModal';
import { useTools } from '@/hooks/useTools';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import CommandPalette from '@/components/CommandPalette';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const {
        tools,
        categories,
        roles,
        loading,
        filterType,
        setFilterType,
        deleteTool,
        refresh,
        toggleFavorite
    } = useTools();

    const { isOpen: isPaletteOpen, setIsOpen: setIsPaletteOpen } = useCommandPalette();
    const [showModal, setShowModal] = useState(false);
    const [editingTool, setEditingTool] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!token || !storedUser) {
            router.push('/login');
            return;
        }

        setUser(JSON.parse(storedUser));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this tool?')) {
            await deleteTool(id);
        }
    };

    const openAddModal = () => {
        setEditingTool(null);
        setShowModal(true);
    };

    const openEditModal = (tool) => {
        setEditingTool(tool);
        setShowModal(true);
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-gray-100 font-sans">
            <Sidebar user={user} onLogout={handleLogout} />

            <main className="ml-64 p-6 transition-all duration-300">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                        <p className="text-gray-400">Discover and share the best AI tools.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all active:scale-95"
                    >
                        <span>+</span> Add Tool
                    </button>
                </div>

                {/* Filters */}
                <div className="mb-6 flex space-x-2 border-b border-gray-700 pb-4">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        All Tools
                    </button>
                    <button
                        onClick={() => setFilterType('recommended')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'recommended' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-white'}`}
                    >
                        Recommended for You
                    </button>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <ToolCard
                            key={tool.id}
                            tool={tool}
                            user={user}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}

                    {tools.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500 bg-card rounded-lg border border-dashed border-card-border">
                            No tools found. {filterType === 'recommended' ? 'No recommendations for your role yet.' : 'Be the first to add one!'}
                        </div>
                    )}
                </div>
            </main>

            {/* Tool Modal (Add/Edit) */}
            {showModal && (
                <ToolModal
                    tool={editingTool}
                    categories={categories}
                    roles={roles}
                    onClose={() => setShowModal(false)}
                    refresh={refresh}
                />
            )}

            <CommandPalette
                isOpen={isPaletteOpen}
                onClose={() => setIsPaletteOpen(false)}
            />
        </div>
    );
}
