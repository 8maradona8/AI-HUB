import React, { useState, useEffect } from 'react';
import { toolService } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import StarRating from './StarRating';

const ReviewSection = ({ toolId, onRatingUpdate }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const { showToast } = useToast();

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const data = await toolService.getReviews(toolId);
            setReviews(data.reviews || []);
            setAverageRating(data.average_rating || 0);
            if (onRatingUpdate) onRatingUpdate(data.average_rating || 0);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [toolId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newReview.rating === 0) {
            showToast('Please select a rating', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await toolService.addReview(toolId, newReview);
            if (result) {
                showToast('Review submitted successfully!', 'success');
                setNewReview({ rating: 0, comment: '' });
                fetchReviews(); // Refresh list and average
            } else {
                showToast('Failed to submit review', 'error');
            }
        } catch (error) {
            showToast('An error occurred while submitting your review', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header / Stats */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-sm font-semibold text-gray-900">Reviews</h3>
                <div className="flex items-center space-x-2">
                    <StarRating rating={Math.round(averageRating)} readonly size="xs" />
                    <span className="text-sm font-medium text-gray-700">{averageRating.toFixed(1)}</span>
                </div>
            </div>

            {/* Submit Form */}
            <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-700">Rate this tool</label>
                    <StarRating
                        rating={newReview.rating}
                        onRatingChange={(r) => setNewReview(prev => ({ ...prev, rating: r }))}
                        size="sm"
                    />
                </div>
                <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Tell us what you think..."
                    className="w-full h-20 bg-white border border-gray-300 rounded-md p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 resize-none"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Sending...' : 'Post Review'}
                </button>
            </form>

            {/* List */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex justify-center py-6">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                                        {review.user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 text-xs leading-none">{review.user?.name}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} readonly size="xs" />
                            </div>
                            {review.comment && (
                                <p className="text-sm text-gray-700 leading-relaxed pl-10">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
