'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toolService } from '@/services/api';

export default function CommandPalette({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim()) {
                setIsLoading(true);
                try {
                    const data = await toolService.getTools({ search: query });
                    setResults(data.slice(0, 8)); // Limit to 8 results
                    setSelectedIndex(0);
                } catch (error) {
                    console.error('Search failed', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
            if (results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleSelect = (tool) => {
        // For now, just scroll to it or we could redirect if we had specific pages
        // Since everything is on the dashboard, we close for now.
        // In a real app, this might navigate to /tools/[id]
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <div
                className="fixed inset-0 bg-background/60 backdrop-blur-md pointer-events-auto"
                onClick={onClose}
            />

            <div className="w-full max-w-xl bg-card rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-card-border overflow-hidden pointer-events-auto flex flex-col transition-colors duration-300">
                <div className="p-6 border-b border-card-border flex items-center space-x-4 bg-background/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full bg-transparent border-none text-foreground focus:ring-0 text-xl font-medium placeholder:text-gray-500"
                        placeholder="Search tools, roles, categories..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex items-center space-x-1 bg-background border border-card-border px-2 py-1 rounded-lg text-[10px] text-gray-500 font-bold uppercase tracking-wider shadow-sm">
                        <span>ESC</span>
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-3">
                    {isLoading && (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                            <span className="font-bold text-xs uppercase tracking-widest opacity-50">Searching AI Hub...</span>
                        </div>
                    )}

                    {!isLoading && query && results.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <div className="text-4xl mb-4 opacity-20">🔍</div>
                            <div className="font-bold text-sm">No results found for "{query}"</div>
                        </div>
                    )}

                    {!isLoading && results.map((tool, index) => (
                        <button
                            key={tool.id}
                            onClick={() => handleSelect(tool)}
                            className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all group ${index === selectedIndex ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-[1.02]' : 'hover:bg-background text-foreground hover:scale-[1.01]'
                                }`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black border transition-colors ${index === selectedIndex ? 'bg-white/20 border-white/20 text-white' : 'bg-background border-card-border text-blue-500'}`}>
                                    {tool.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className={`font-bold text-lg leading-tight truncate ${index === selectedIndex ? 'text-white' : 'text-foreground'}`}>
                                        {tool.name}
                                    </div>
                                    <div className={`text-sm truncate max-w-xs font-medium ${index === selectedIndex ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {tool.description}
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2 shrink-0">
                                {tool.categories?.slice(0, 1).map(cat => (
                                    <span key={cat.id} className={`text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-lg border ${index === selectedIndex ? 'bg-white/20 border-white/20 text-white' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}

                    {!query && (
                        <div className="py-12 px-6 text-center">
                            <div className="flex justify-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-4.44-5.026a3.374 3.374 0 00-.833-1.89L6.637 10.07M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-foreground font-bold text-lg mb-1">Search Anything</div>
                            <div className="text-gray-500 font-medium text-sm">Type a name, description or role to discover tools.</div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-background/80 border-t border-card-border flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest font-black">
                    <div className="flex space-x-6">
                        <div className="flex items-center gap-1.5">
                            <span className="bg-card px-1.5 py-0.5 rounded border border-card-border shadow-sm">⏎</span>
                            <span>select</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="bg-card px-1.5 py-0.5 rounded border border-card-border shadow-sm">↑↓</span>
                            <span>navigate</span>
                        </div>
                    </div>
                    <div className="text-blue-500 opacity-80">Press <span className="text-blue-400">⌘K</span> anytime</div>
                </div>
            </div>
        </div>
    );
}
