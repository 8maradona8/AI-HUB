<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_user_can_toggle_tool_favorite()
    {
        $user = \App\Models\User::factory()->create();
        $tool = \App\Models\Tool::factory()->create(['status' => 'approved']);

        // First toggle: Favorite it
        $response = $this->actingAs($user)->postJson("/api/tools/{$tool->id}/favorite");
        $response->assertStatus(200);
        $response->assertJson(['favorited' => true]);
        $this->assertDatabaseHas('favorite_tool', [
            'user_id' => $user->id,
            'tool_id' => $tool->id
        ]);

        // Second toggle: Unfavorite it
        $response = $this->actingAs($user)->postJson("/api/tools/{$tool->id}/favorite");
        $response->assertStatus(200);
        $response->assertJson(['favorited' => false]);
        $this->assertDatabaseMissing('favorite_tool', [
            'user_id' => $user->id,
            'tool_id' => $tool->id
        ]);
    }
}
