<?php

namespace App\Services;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class TwoFactorService
{
    /**
     * Enable Google Authenticator for a user
     */
    public function enableGoogleAuth(User $user): array
    {
        $secret = $this->generateTotpSecret();
        
        $user->update([
            'two_factor_method' => 'google',
            'two_factor_secret' => encrypt($secret),
            'two_factor_enabled' => false, // Enable after verification
        ]);

        // Generate QR code URL for Google Authenticator
        $appName = config('app.name', 'AIHub');
        $qrCodeUrl = "otpauth://totp/{$appName}:{$user->email}?secret={$secret}&issuer={$appName}";
        
        return [
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl,
        ];
    }

    /**
     * Verify TOTP code (Google Authenticator)
     */
    public function verifyGoogleCode(User $user, string $code): bool
    {
        if (!$user->two_factor_secret) {
            return false;
        }

        $secret = decrypt($user->two_factor_secret);
        return $this->verifyTotp($secret, $code);
    }

    /**
     * Send Email OTP
     */
    public function sendEmailOtp(User $user): bool
    {
        $code = $this->generateOtpCode();
        
        $user->update([
            'two_factor_code' => bcrypt($code),
            'two_factor_code_expires_at' => now()->addMinutes(5),
        ]);

        // In production, send via Mail
        // For now, we'll log it
        \Log::info("2FA Email OTP for {$user->email}: {$code}");

        ActivityLog::log('2fa_email_sent', $user, null, "Email OTP sent to {$user->email}");

        return true;
    }

    /**
     * Verify Email OTP
     */
    public function verifyEmailOtp(User $user, string $code): bool
    {
        if (!$user->two_factor_code || !$user->two_factor_code_expires_at) {
            return false;
        }

        if ($user->two_factor_code_expires_at->isPast()) {
            return false;
        }

        if (!password_verify($code, $user->two_factor_code)) {
            return false;
        }

        // Clear the code after successful verification
        $user->update([
            'two_factor_code' => null,
            'two_factor_code_expires_at' => null,
        ]);

        return true;
    }

    /**
     * Send Telegram OTP
     */
    public function sendTelegramOtp(User $user): bool
    {
        if (!$user->telegram_chat_id) {
            return false;
        }

        $code = $this->generateOtpCode();
        
        $user->update([
            'two_factor_code' => bcrypt($code),
            'two_factor_code_expires_at' => now()->addMinutes(5),
        ]);

        // In production, send via Telegram Bot API
        // For now, we'll log it
        \Log::info("2FA Telegram OTP for {$user->email} (chat_id: {$user->telegram_chat_id}): {$code}");

        ActivityLog::log('2fa_telegram_sent', $user, null, "Telegram OTP sent");

        return true;
    }

    /**
     * Enable 2FA after first successful verification
     */
    public function enable2FA(User $user, string $method): void
    {
        $user->update([
            'two_factor_enabled' => true,
            'two_factor_method' => $method,
        ]);

        ActivityLog::log('2fa_enabled', $user, ['method' => $method], "2FA enabled via {$method}");
    }

    /**
     * Disable 2FA
     */
    public function disable2FA(User $user): void
    {
        $user->update([
            'two_factor_enabled' => false,
            'two_factor_method' => null,
            'two_factor_secret' => null,
            'two_factor_code' => null,
            'two_factor_code_expires_at' => null,
        ]);

        ActivityLog::log('2fa_disabled', $user, null, "2FA disabled");
    }

    /**
     * Generate a 6-digit OTP code
     */
    private function generateOtpCode(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Generate TOTP secret (Base32 encoded)
     */
    private function generateTotpSecret(): string
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $secret = '';
        for ($i = 0; $i < 16; $i++) {
            $secret .= $chars[random_int(0, 31)];
        }
        return $secret;
    }

    /**
     * Verify TOTP code
     */
    private function verifyTotp(string $secret, string $code): bool
    {
        // Time-based OTP verification
        $timeSlice = floor(time() / 30);
        
        // Check current time slice and adjacent ones for clock drift
        for ($i = -1; $i <= 1; $i++) {
            $calculatedCode = $this->calculateTotp($secret, $timeSlice + $i);
            if (hash_equals($calculatedCode, $code)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Calculate TOTP code for a given time slice
     */
    private function calculateTotp(string $secret, int $timeSlice): string
    {
        $secretKey = $this->base32Decode($secret);
        $time = pack('N*', 0) . pack('N*', $timeSlice);
        $hash = hash_hmac('sha1', $time, $secretKey, true);
        $offset = ord(substr($hash, -1)) & 0x0F;
        $code = (
            ((ord($hash[$offset]) & 0x7F) << 24) |
            ((ord($hash[$offset + 1]) & 0xFF) << 16) |
            ((ord($hash[$offset + 2]) & 0xFF) << 8) |
            (ord($hash[$offset + 3]) & 0xFF)
        ) % pow(10, 6);
        
        return str_pad((string) $code, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Base32 decode
     */
    private function base32Decode(string $input): string
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $output = '';
        $v = 0;
        $vbits = 0;
        
        for ($i = 0, $j = strlen($input); $i < $j; $i++) {
            $v <<= 5;
            if ($input[$i] !== '=') {
                $v += strpos($chars, strtoupper($input[$i]));
            }
            $vbits += 5;
            if ($vbits >= 8) {
                $vbits -= 8;
                $output .= chr(($v >> $vbits) & 0xFF);
            }
        }
        
        return $output;
    }
}
