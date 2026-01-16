import { useState } from 'react';
import StarRating from './StarRating';
import ReviewSection from './ReviewSection';

export default function ToolCard({ tool, user, onEdit, onDelete, onToggleFavorite }) {
    const [showReviews, setShowReviews] = useState(false);
    const [currentRating, setCurrentRating] = useState(tool.average_rating || 0);

    return (
        <div className="bg-card rounded-[2rem] shadow-xl hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] transition-all duration-500 overflow-hidden border border-card-border group hover:border-blue-500/30 flex flex-col h-fit">
            <div className="p-8 pb-4">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-black text-foreground group-hover:text-blue-500 transition-colors tracking-tight">
                            {tool.name}
                        </h3>
                        <div className="mt-1 flex items-center space-x-2">
                            <StarRating rating={Math.round(currentRating)} readonly size="xs" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{currentRating}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-background/50 p-2 rounded-2xl border border-card-border">
                        {tool.url && (
                            <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-blue-500 transition-all p-2 rounded-xl hover:bg-background border border-transparent hover:border-card-border"
                                title="Open Tool"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                        {/* Favorite Button */}
                        <button
                            onClick={() => onToggleFavorite?.(tool.id)}
                            className={`p-2 rounded-xl transition-all border border-transparent hover:border-card-border hover:bg-background ${tool.is_favorited ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                            title="Toggle Favorite"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={tool.is_favorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>

                        {/* Reviews Toggle Button */}
                        <button
                            onClick={() => setShowReviews(!showReviews)}
                            className={`p-2 rounded-xl transition-all border border-transparent hover:border-card-border hover:bg-background ${showReviews ? 'text-blue-500 bg-background border-card-border' : 'text-gray-500 hover:text-blue-500'}`}
                            title="View Reviews"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </button>

                        {/* Only show Edit/Delete if user is owner */}
                        {user && user.id === tool.user_id && (
                            <>
                                <button
                                    onClick={() => onEdit(tool)}
                                    className="text-gray-500 hover:text-yellow-500 transition-all p-2 rounded-xl hover:bg-background border border-transparent hover:border-card-border"
                                    title="Edit Tool"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => onDelete(tool.id)}
                                    className="text-gray-500 hover:text-red-500 transition-all p-2 rounded-xl hover:bg-background border border-transparent hover:border-card-border"
                                    title="Delete Tool"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-foreground/60 mb-6 line-clamp-3 min-h-[4.5rem] font-medium leading-relaxed">{tool.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {tool.categories?.map(cat => (
                        <span key={cat.id} className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20 shadow-sm shadow-blue-500/5">
                            {cat.name}
                        </span>
                    ))}
                    {(tool.targetRoles || tool.target_roles)?.map(role => (
                        <span key={role.id} className="px-3 py-1 bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-500/20 shadow-sm shadow-purple-500/5">
                            {role.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Collapsible Review Section */}
            {showReviews && (
                <div className="border-t border-card-border bg-background/30 px-8 pb-8 flex-grow">
                    <ReviewSection toolId={tool.id} onRatingUpdate={setCurrentRating} />
                </div>
            )}
        </div>
    );
}
