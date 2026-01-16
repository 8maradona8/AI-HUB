<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreToolRequest;
use App\Http\Requests\UpdateToolRequest;
use App\Models\Tool;
use App\Services\ToolService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ToolController extends Controller
{
    protected ToolService $toolService;

    public function __construct(ToolService $toolService)
    {
        $this->toolService = $toolService;
    }

    /**
     * Display a listing of the tools.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Tool::with(['user', 'categories', 'targetRoles'])
            ->withAvg('reviews as average_rating', 'rating')
            ->approved()
            ->latest();

        if ($user) {
            $query->withExists(['favoritedBy as is_favorited' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }]);
        }

        if ($request->query('recommended') === 'true' && $user) {
            $userRoleId = $user->role_id;
            $query->whereHas('targetRoles', function ($q) use ($userRoleId) {
                $q->where('roles.id', $userRoleId);
            });
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    /**
     * Store a newly created tool in storage.
     *
     * @param StoreToolRequest $request
     * @return JsonResponse
     */
    public function store(StoreToolRequest $request): JsonResponse
    {
        $tool = $this->toolService->createTool($request->user(), $request->validated());

        return response()->json($tool, 201);
    }

    /**
     * Display the specified tool.
     *
     * @param Tool $tool
     * @return JsonResponse
     */
    public function show(Tool $tool): JsonResponse
    {
        return response()->json($tool->load(['user', 'categories', 'targetRoles'])->loadAvg('reviews as average_rating', 'rating'));
    }

    /**
     * Update the specified tool in storage.
     *
     * @param UpdateToolRequest $request
     * @param Tool $tool
     * @return JsonResponse
     */
    public function update(UpdateToolRequest $request, Tool $tool): JsonResponse
    {
        $this->authorize('update', $tool);

        $tool = $this->toolService->updateTool($tool, $request->validated());

        return response()->json($tool);
    }

    /**
     * Remove the specified tool from storage.
     *
     * @param Tool $tool
     * @return JsonResponse
     */
    public function destroy(Tool $tool): JsonResponse
    {
        $this->authorize('delete', $tool);
        
        $this->toolService->deleteTool($tool);

        return response()->json(null, 204);
    }

    /**
     * Toggle the favorite status of a tool for the authenticated user.
     *
     * @param Request $request
     * @param Tool $tool
     * @return JsonResponse
     */
    public function favorite(Request $request, Tool $tool): JsonResponse
    {
        $isFavorited = $this->toolService->toggleFavorite($request->user(), $tool);
        
        return response()->json([
            'favorited' => $isFavorited,
            'message' => $isFavorited ? 'Added to favorites' : 'Removed from favorites'
        ]);
    }
}
