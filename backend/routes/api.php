<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ToolController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\TwoFactorController;
use App\Http\Controllers\API\ReviewController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/roles', [\App\Http\Controllers\API\RoleController::class, 'index']); // Public for registration
Route::get('/tools/{tool}/reviews', [ReviewController::class, 'index']);

// 2FA login verification (before full auth)
Route::post('/2fa/send-login-otp', [TwoFactorController::class, 'sendLoginOtp']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Tools (CRUD)
    Route::apiResource('tools', ToolController::class);
    Route::post('/tools/{tool}/favorite', [ToolController::class, 'favorite']);
    Route::post('/tools/{tool}/reviews', [ReviewController::class, 'store']);
    Route::apiResource('categories', \App\Http\Controllers\API\CategoryController::class);

    // 2FA Management
    Route::prefix('2fa')->group(function () {
        Route::get('/status', [TwoFactorController::class, 'status']);
        Route::post('/setup/google', [TwoFactorController::class, 'setupGoogle']);
        Route::post('/verify/google', [TwoFactorController::class, 'verifyGoogle']);
        Route::post('/setup/email', [TwoFactorController::class, 'setupEmail']);
        Route::post('/verify/email', [TwoFactorController::class, 'verifyEmail']);
        Route::post('/setup/telegram', [TwoFactorController::class, 'setupTelegram']);
        Route::post('/verify/telegram', [TwoFactorController::class, 'verifyTelegram']);
        Route::post('/disable', [TwoFactorController::class, 'disable']);
    });

    // Admin routes (Owner only)
    Route::middleware('role:Owner')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/tools', [AdminController::class, 'listTools']);
        Route::post('/tools/{id}/approve', [AdminController::class, 'approveTool']);
        Route::post('/tools/{id}/reject', [AdminController::class, 'rejectTool']);
        Route::get('/activity-logs', [AdminController::class, 'activityLogs']);
    });
});
