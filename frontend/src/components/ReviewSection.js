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
        <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Stats */}
            <div className="flex items-center justify-between border-b border-card-border pb-4">
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Community Reviews</h3>
                <div className="flex items-center space-x-3 bg-background/50 px-4 py-2 rounded-2xl border border-card-border shadow-sm">
                    <StarRating rating={Math.round(averageRating)} readonly size="sm" />
                    <span className="text-lg font-black text-foreground">{averageRating}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Average</span>
                </div>
            </div>

            {/* Submit Form */}
            <form onSubmit={handleSubmit} className="bg-background/40 p-6 rounded-[2rem] border border-card-border shadow-xl space-y-4 transition-all hover:shadow-2xl hover:border-blue-500/30">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Rate this tool</label>
                    <StarRating
                        rating={newReview.rating}
                        onRatingChange={(r) => setNewReview(prev => ({ ...prev, rating: r }))}
                        size="md"
                    />
                </div>
                <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Tell us what you think about this tool..."
                    className="w-full h-24 bg-background border border-card-border rounded-2xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-600 resize-none font-medium"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                    {isSubmitting ? 'Sending...' : 'Post Review'}
                </button>
            </form>

            {/* List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-card/50 p-6 rounded-3xl border border-card-border shadow-sm hover:scale-[1.01] transition-transform duration-300">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-black uppercase shadow-inner shadow-black/20">
                                        {review.user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-black text-foreground leading-none">{review.user?.name}</div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} readonly size="xs" />
                            </div>
                            {review.comment && (
                                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed pl-13">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-background/20 rounded-[2rem] border border-dashed border-card-border">
                        <div className="text-4xl mb-4">💬</div>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
