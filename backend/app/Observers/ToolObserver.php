<?php

namespace App\Observers;

use App\Models\Tool;
use App\Models\ActivityLog;
use App\Services\ToolService;

class ToolObserver
{
    protected ToolService $toolService;

    public function __construct(ToolService $toolService)
    {
        $this->toolService = $toolService;
    }

    /**
     * Handle the Tool "created" event.
     */
    public function created(Tool $tool): void
    {
        ActivityLog::log('created', $tool, $tool->getAttributes(), "Tool '{$tool->name}' submitted for review");
        $this->toolService->clearToolCaches();
    }

    /**
     * Handle the Tool "updated" event.
     */
    public function updated(Tool $tool): void
    {
        if ($tool->isDirty('status')) {
            $status = $tool->status;
            ActivityLog::log($status, $tool, null, "Tool '{$tool->name}' status changed to {$status}");
        } else {
            ActivityLog::log('updated', $tool, [
                'old' => $tool->getOriginal(),
                'new' => $tool->getAttributes(),
            ], "Tool '{$tool->name}' updated");
        }
        
        $this->toolService->clearToolCaches();
    }

    /**
     * Handle the Tool "deleted" event.
     */
    public function deleted(Tool $tool): void
    {
        ActivityLog::log('deleted', null, ['name' => $tool->name], "Tool '{$tool->name}' deleted");
        $this->toolService->clearToolCaches();
    }
}
