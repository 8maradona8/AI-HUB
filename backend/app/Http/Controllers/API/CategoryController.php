<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Category;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /**
     * Get all categories (cached)
     */
    public function index(): JsonResponse
    {
        $categories = Cache::remember('categories', 3600, function () {
            return Category::withCount(['tools' => function ($query) {
                $query->where('status', 'approved');
            }])->get();
        });

        return response()->json($categories);
    }

    /**
     * Store a new category
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug',
        ]);

        $category = Category::create($validated);

        // Clear cache
        Cache::forget('categories');
        Cache::forget('admin_stats');

        // Log activity
        ActivityLog::log('created', $category, $validated, "Category '{$category->name}' created");

        return response()->json($category, 201);
    }

    /**
     * Update a category
     */
    public function update(Request $request, $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:categories,slug,' . $id,
        ]);

        $oldData = $category->toArray();
        $category->update($validated);

        // Clear cache
        Cache::forget('categories');
        Cache::forget('admin_stats');

        // Log activity
        ActivityLog::log('updated', $category, [
            'old' => $oldData,
            'new' => $category->toArray(),
        ], "Category '{$category->name}' updated");

        return response()->json($category);
    }

    /**
     * Delete a category
     */
    public function destroy($id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $name = $category->name;
        
        $category->delete();

        // Clear cache
        Cache::forget('categories');
        Cache::forget('admin_stats');

        // Log activity
        ActivityLog::log('deleted', null, ['name' => $name], "Category '{$name}' deleted");

        return response()->json(['message' => 'Category deleted']);
    }
}
