import { useState } from 'react';
import StarRating from './StarRating';
import ReviewSection from './ReviewSection';

export default function ToolCard({ tool, user, onEdit, onDelete, onToggleFavorite }) {
    const [showReviews, setShowReviews] = useState(false);
    const [currentRating, setCurrentRating] = useState(tool.average_rating || 0);

    return (
        <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden flex flex-col h-full group">
            <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1.5 line-clamp-1">
                            {tool.name}
                        </h3>
                        <div className="flex items-center gap-1.5">
                            <StarRating rating={Math.round(currentRating)} readonly size="xs" />
                            {currentRating > 0 && (
                                <span className="text-xs text-gray-500">{currentRating.toFixed(1)}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                        {tool.url && (
                            <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded hover:bg-gray-100"
                                title="Open Tool"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                        <button
                            onClick={() => onToggleFavorite?.(tool.id)}
                            className={`p-1.5 rounded transition-colors ${tool.is_favorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                            title="Toggle Favorite"
                        >
                            <svg className="w-4 h-4" fill={tool.is_favorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        {user && user.id === tool.user_id && (
                            <>
                                <button
                                    onClick={() => onEdit(tool)}
                                    className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded hover:bg-gray-100"
                                    title="Edit Tool"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => onDelete(tool.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded hover:bg-gray-100"
                                    title="Delete Tool"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{tool.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                    {tool.categories?.slice(0, 2).map(cat => (
                        <span key={cat.id} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200">
                            {cat.name}
                        </span>
                    ))}
                    {(tool.targetRoles || tool.target_roles)?.slice(0, 1).map(role => (
                        <span key={role.id} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded border border-purple-200">
                            {role.name}
                        </span>
                    ))}
                </div>
                <button
                    onClick={() => setShowReviews(!showReviews)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 flex items-center gap-1"
                >
                    {showReviews ? 'Hide' : 'Show'} Reviews
                    <svg className={`w-3 h-3 transition-transform ${showReviews ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Collapsible Review Section */}
            {showReviews && (
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
                    <ReviewSection toolId={tool.id} onRatingUpdate={setCurrentRating} />
                </div>
            )}
        </div>
    );
}
