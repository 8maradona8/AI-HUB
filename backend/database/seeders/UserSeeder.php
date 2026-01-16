<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = Role::all();

        foreach ($roles as $role) {
            $email = strtolower($role->name) . '@company.com';
            User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $role->name . ' User',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'role_id' => $role->id,
                    'remember_token' => Str::random(10),
                ]
            );
        }
    }
}
