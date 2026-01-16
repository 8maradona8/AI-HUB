<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\Category;
use App\Models\Role;
use App\Models\ActivityLog;
use App\Services\ToolService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class AdminController extends Controller
{
    protected ToolService $toolService;

    public function __construct(ToolService $toolService)
    {
        $this->toolService = $toolService;
    }

    /**
     * List all tools with filters (Admin only)
     */
    public function listTools(Request $request): JsonResponse
    {
        $query = Tool::with(['user', 'categories', 'targetRoles', 'reviewer']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category_id') && $request->category_id) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        // Filter by target role
        if ($request->has('role_id') && $request->role_id) {
            $query->whereHas('targetRoles', function ($q) use ($request) {
                $q->where('roles.id', $request->role_id);
            });
        }

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        $tools = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($tools);
    }

    /**
     * Approve a tool
     */
    public function approveTool(Request $request, $id): JsonResponse
    {
        $tool = Tool::findOrFail($id);
        $tool = $this->toolService->approveTool($tool, $request->user());

        return response()->json([
            'message' => 'Tool approved successfully',
            'tool' => $tool,
        ]);
    }

    /**
     * Reject a tool
     */
    public function rejectTool(Request $request, $id): JsonResponse
    {
        $tool = Tool::findOrFail($id);
        $tool = $this->toolService->rejectTool($tool, $request->user());

        return response()->json([
            'message' => 'Tool rejected successfully',
            'tool' => $tool,
        ]);
    }

    /**
     * Get dashboard statistics
     */
    public function stats(): JsonResponse
    {
        $stats = Cache::remember('admin_stats', 300, function () {
            return [
                'total_tools' => Tool::count(),
                'pending_tools' => Tool::pending()->count(),
                'approved_tools' => Tool::approved()->count(),
                'rejected_tools' => Tool::rejected()->count(),
                'tools_by_category' => Category::withCount(['tools' => function ($q) {
                    $q->approved();
                }])->get(),
            ];
        });

        return response()->json($stats);
    }

    /**
     * Get activity logs
     */
    public function activityLogs(Request $request): JsonResponse
    {
        $logs = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($logs);
    }
}
