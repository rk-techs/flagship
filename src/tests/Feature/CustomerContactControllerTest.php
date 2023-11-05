<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\CustomerContact;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CustomerContactControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PermissionSeeder::class);
        $this->user = User::factory()->create();
    }

    /*
    |--------------------------------------------------------------------------
    | Index
    |--------------------------------------------------------------------------
    */
    public function test_認証済みユーザーは連絡先一覧を閲覧できる(): void
    {
        $this->actingAs($this->user);
        $response = $this->get(route('contacts.index'));
        $response->assertStatus(200);

        $response->assertInertia(function (Assert $page) {
            $page->component('CustomerContact/Index');
            $page->has('contactsPaginator');
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Store
    |--------------------------------------------------------------------------
    */
    public function test_認証済みユーザーは連絡先の新規登録ができる(): void
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create();

        $contactsData = CustomerContact::factory()->make([
            'customer_id'   => $customer->id,
            'created_by_id' => $this->user->id,
            'updated_by_id' => null,
        ])->toArray();

        $response = $this->post(route('customers.contacts.store', $customer), $contactsData);
        $this->assertDatabaseHas('customer_contacts', $contactsData);

        $response->assertRedirect(route('customers.show', $customer));

    }
}
