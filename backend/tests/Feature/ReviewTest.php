<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\User;
use App\Models\Tool;
use App\Models\Review;
use Laravel\Sanctum\Sanctum;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_list_reviews_for_a_tool()
    {
        $tool = Tool::factory()->create(['status' => 'approved']);
        $user = User::factory()->create();
        Review::factory()->create([
            'tool_id' => $tool->id,
            'user_id' => $user->id,
            'rating' => 4,
            'comment' => 'Great tool!'
        ]);

        $response = $this->getJson("/api/tools/{$tool->id}/reviews");

        $response->assertStatus(200)
            ->assertJsonStructure(['reviews', 'average_rating'])
            ->assertJsonCount(1, 'reviews')
            ->assertJsonPath('reviews.0.comment', 'Great tool!');
    }

    /** @test */
    public function authenticated_user_can_submit_a_review()
    {
        $tool = Tool::factory()->create(['status' => 'approved']);
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson("/api/tools/{$tool->id}/reviews", [
            'rating' => 5,
            'comment' => 'Excellent!'
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Review submitted successfully');

        $this->assertDatabaseHas('reviews', [
            'tool_id' => $tool->id,
            'user_id' => $user->id,
            'rating' => 5,
            'comment' => 'Excellent!'
        ]);
    }

    /** @test */
    public function user_can_update_their_own_review()
    {
        $tool = Tool::factory()->create(['status' => 'approved']);
        $user = User::factory()->create();
        $review = Review::factory()->create([
            'tool_id' => $tool->id,
            'user_id' => $user->id,
            'rating' => 3
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/tools/{$tool->id}/reviews", [
            'rating' => 5,
            'comment' => 'Updated review'
        ]);

        $response->assertStatus(200);
        $this->assertEquals(5, $review->fresh()->rating);
        $this->assertEquals('Updated review', $review->fresh()->comment);
    }

    /** @test */
    public function unauthenticated_user_cannot_submit_a_review()
    {
        $tool = Tool::factory()->create();
        
        $response = $this->postJson("/api/tools/{$tool->id}/reviews", [
            'rating' => 5,
            'comment' => 'No auth'
        ]);

        $response->assertStatus(401);
    }
}
