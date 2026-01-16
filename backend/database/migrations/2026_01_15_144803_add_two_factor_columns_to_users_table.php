<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('two_factor_enabled')->default(false)->after('password');
            $table->enum('two_factor_method', ['google', 'email', 'telegram'])->nullable()->after('two_factor_enabled');
            $table->string('two_factor_secret')->nullable()->after('two_factor_method');
            $table->string('telegram_chat_id')->nullable()->after('two_factor_secret');
            $table->string('two_factor_code')->nullable()->after('telegram_chat_id');
            $table->timestamp('two_factor_code_expires_at')->nullable()->after('two_factor_code');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'two_factor_enabled',
                'two_factor_method',
                'two_factor_secret',
                'telegram_chat_id',
                'two_factor_code',
                'two_factor_code_expires_at',
            ]);
        });
    }
};
