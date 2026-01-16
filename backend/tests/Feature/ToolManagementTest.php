<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use App\Models\Tool;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ToolManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_tool_with_categories_and_roles()
    {
        $this->withoutExceptionHandling();
        $this->seed(); // Seed roles and categories
        
        $user = User::factory()->create(['role_id' => 1]);
        $category1 = Category::first();
        $category2 = Category::skip(1)->first();
        $role1 = Role::first();
        $role2 = Role::skip(1)->first();

        $response = $this->actingAs($user)->postJson('/api/tools', [
            'name' => 'Test Tool',
            'description' => 'A great tool',
            'url' => 'http://example.com',
            'categories' => [$category1->id, $category2->id],
            'roles' => [$role1->id, $role2->id],
        ]);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('tools', ['name' => 'Test Tool']);
        
        $tool = Tool::where('name', 'Test Tool')->first();
        
        $this->assertEquals(2, $tool->categories()->count());
        $this->assertEquals(2, $tool->targetRoles()->count());
        
        $this->assertDatabaseHas('category_tool', ['tool_id' => $tool->id, 'category_id' => $category1->id]);
        $this->assertDatabaseHas('role_tool', ['tool_id' => $tool->id, 'role_id' => $role1->id]);
    }

    public function test_user_can_update_tool_relations()
    {
        $this->seed();
        $user = User::factory()->create();
        $tool = Tool::factory()->create(['user_id' => $user->id]);
        
        $category = Category::first();
        $role = Role::first();

        $response = $this->actingAs($user)->putJson("/api/tools/{$tool->id}", [
            'categories' => [$category->id],
            'roles' => [$role->id],
        ]);

        $response->assertStatus(200);
        
        $this->assertEquals(1, $tool->categories()->count());
        $this->assertEquals(1, $tool->targetRoles()->count());
        $this->assertTrue($tool->categories->contains($category));
    }

    public function test_user_can_delete_tool()
    {
        $this->seed();
        $user = User::factory()->create();
        $tool = Tool::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->deleteJson("/api/tools/{$tool->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('tools', ['id' => $tool->id]);
    }
    public function test_user_can_filter_tools_by_recommendation()
    {
        $this->seed();
        // Create two roles
        $devRole = Role::where('name', 'Backend')->first();
        $designRole = Role::where('name', 'Designer')->first();

        // Create a user with Backend role
        $user = User::factory()->create(['role_id' => $devRole->id]);

        // Create a tool targeting Backend
        $devTool = Tool::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);
        $devTool->targetRoles()->attach($devRole->id);

        // Create a tool targeting Designer
        $designTool = Tool::factory()->create([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);
        $designTool->targetRoles()->attach($designRole->id);

        // Fetch all tools
        $responseAll = $this->actingAs($user)->getJson('/api/tools');
        $responseAll->assertJsonCount(2);

        // Fetch recommended tools
        $responseRec = $this->actingAs($user)->getJson('/api/tools?recommended=true');
        $responseRec->assertJsonCount(1);
        $responseRec->assertJsonFragment(['id' => $devTool->id]);
        
        $responseData = $responseRec->json();
        $assignedIds = collect($responseData)->pluck('id');
        $this->assertNotContains($designTool->id, $assignedIds);
    }
}
