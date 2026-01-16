<?php

namespace App\Services;

use App\Models\Tool;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class ToolService
{
    /**
     * Create a new tool and sync relations.
     *
     * @param User $user
     * @param array $data
     * @return Tool
     */
    public function createTool(User $user, array $data): Tool
    {
        $toolData = array_diff_key($data, array_flip(['categories', 'roles']));
        $toolData['status'] = 'pending';
        
        $tool = $user->tools()->create($toolData);

        if (isset($data['categories'])) {
            $tool->categories()->sync($data['categories']);
        }

        if (isset($data['roles'])) {
            $tool->targetRoles()->sync($data['roles']);
        }

        $this->clearToolCaches();

        return $tool->load(['user', 'categories', 'targetRoles']);
    }

    /**
     * Update an existing tool and sync relations.
     *
     * @param Tool $tool
     * @param array $data
     * @return Tool
     */
    public function updateTool(Tool $tool, array $data): Tool
    {
        $toolData = array_diff_key($data, array_flip(['categories', 'roles']));
        $tool->update($toolData);

        if (isset($data['categories'])) {
            $tool->categories()->sync($data['categories']);
        }

        if (isset($data['roles'])) {
            $tool->targetRoles()->sync($data['roles']);
        }

        $this->clearToolCaches();

        return $tool->load(['user', 'categories', 'targetRoles']);
    }

    /**
     * Approve a tool and clear related caches.
     *
     * @param Tool $tool
     * @param User $reviewer
     * @return Tool
     */
    public function approveTool(Tool $tool, User $reviewer): Tool
    {
        $tool->update([
            'status' => 'approved',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
        ]);

        $this->clearToolCaches();

        return $tool->load(['user', 'categories', 'targetRoles', 'reviewer']);
    }

    /**
     * Reject a tool and clear related caches.
     *
     * @param Tool $tool
     * @param User $reviewer
     * @return Tool
     */
    public function rejectTool(Tool $tool, User $reviewer): Tool
    {
        $tool->update([
            'status' => 'rejected',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
        ]);

        $this->clearToolCaches();

        return $tool->load(['user', 'categories', 'targetRoles', 'reviewer']);
    }

    /**
     * Delete a tool and clear related caches.
     *
     * @param Tool $tool
     * @return void
     */
    public function deleteTool(Tool $tool): void
    {
        $tool->delete();
        $this->clearToolCaches();
    }

    /**
     * Clear tool related caches.
     *
     * @return void
     */
    public function clearToolCaches(): void
    {
        Cache::forget('tool_counts');
        Cache::forget('admin_stats');
        Cache::forget('categories'); // Categories count can change
    }

    /**
     * Toggle a tool as favorite for a user.
     *
     * @param User $user
     * @param Tool $tool
     * @return bool
     */
    public function toggleFavorite(User $user, Tool $tool): bool
    {
        $status = $user->favorites()->toggle($tool->id);
        return count($status['attached']) > 0;
    }
}
