<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tool;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreReviewRequest;

class ReviewController extends Controller
{
    /**
     * Display a listing of the reviews for a specific tool.
     *
     * @param Tool $tool
     * @return JsonResponse
     */
    public function index(Tool $tool): JsonResponse
    {
        $reviews = $tool->reviews()->with('user:id,name')->latest()->get();
        
        return response()->json([
            'reviews' => $reviews,
            'average_rating' => $tool->average_rating
        ]);
    }

    /**
     * Store a newly created review in storage or update existing one.
     *
     * @param StoreReviewRequest $request
     * @param Tool $tool
     * @return JsonResponse
     */
    public function store(StoreReviewRequest $request, Tool $tool): JsonResponse
    {
        $review = Review::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'tool_id' => $tool->id,
            ],
            $request->validated()
        );

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review->load('user:id,name'),
            'average_rating' => $tool->fresh()->average_rating
        ]);
    }
}
