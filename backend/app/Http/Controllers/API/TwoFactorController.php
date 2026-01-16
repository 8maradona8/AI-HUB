<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\TwoFactorService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TwoFactorController extends Controller
{
    protected TwoFactorService $twoFactorService;

    public function __construct(TwoFactorService $twoFactorService)
    {
        $this->twoFactorService = $twoFactorService;
    }

    /**
     * Get 2FA status for current user
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'enabled' => $user->two_factor_enabled,
            'method' => $user->two_factor_method,
            'has_telegram' => !empty($user->telegram_chat_id),
        ]);
    }

    /**
     * Setup Google Authenticator
     */
    public function setupGoogle(Request $request): JsonResponse
    {
        $user = $request->user();
        $result = $this->twoFactorService->enableGoogleAuth($user);

        return response()->json([
            'message' => 'Scan the QR code with Google Authenticator',
            'secret' => $result['secret'],
            'qr_code_url' => $result['qr_code_url'],
        ]);
    }

    /**
     * Verify and enable Google Authenticator
     */
    public function verifyGoogle(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();
        
        if (!$this->twoFactorService->verifyGoogleCode($user, $request->code)) {
            return response()->json(['message' => 'Invalid code'], 422);
        }

        $this->twoFactorService->enable2FA($user, 'google');

        return response()->json(['message' => '2FA enabled successfully']);
    }

    /**
     * Setup Email 2FA
     */
    public function setupEmail(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $user->update(['two_factor_method' => 'email']);
        $this->twoFactorService->sendEmailOtp($user);

        return response()->json([
            'message' => 'Verification code sent to your email',
        ]);
    }

    /**
     * Verify and enable Email 2FA
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();
        
        if (!$this->twoFactorService->verifyEmailOtp($user, $request->code)) {
            return response()->json(['message' => 'Invalid or expired code'], 422);
        }

        $this->twoFactorService->enable2FA($user, 'email');

        return response()->json(['message' => '2FA enabled successfully']);
    }

    /**
     * Setup Telegram 2FA
     */
    public function setupTelegram(Request $request): JsonResponse
    {
        $request->validate([
            'telegram_chat_id' => 'required|string',
        ]);

        $user = $request->user();
        
        $user->update([
            'telegram_chat_id' => $request->telegram_chat_id,
            'two_factor_method' => 'telegram',
        ]);

        $this->twoFactorService->sendTelegramOtp($user);

        return response()->json([
            'message' => 'Verification code sent to your Telegram',
        ]);
    }

    /**
     * Verify Telegram 2FA
     */
    public function verifyTelegram(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();
        
        if (!$this->twoFactorService->verifyEmailOtp($user, $request->code)) {
            return response()->json(['message' => 'Invalid or expired code'], 422);
        }

        $this->twoFactorService->enable2FA($user, 'telegram');

        return response()->json(['message' => '2FA enabled successfully']);
    }

    /**
     * Disable 2FA
     */
    public function disable(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();
        
        if (!password_verify($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid password'], 422);
        }

        $this->twoFactorService->disable2FA($user);

        return response()->json(['message' => '2FA disabled successfully']);
    }

    /**
     * Send OTP for login verification
     */
    public function sendLoginOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();
        
        if (!$user || !$user->two_factor_enabled) {
            return response()->json(['message' => '2FA not enabled'], 422);
        }

        if ($user->two_factor_method === 'email') {
            $this->twoFactorService->sendEmailOtp($user);
        } elseif ($user->two_factor_method === 'telegram') {
            $this->twoFactorService->sendTelegramOtp($user);
        }

        return response()->json([
            'message' => 'OTP sent',
            'method' => $user->two_factor_method,
        ]);
    }
}
