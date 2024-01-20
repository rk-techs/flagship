<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\CustomerContact;
use App\Models\DeliveryAddress;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PurchaseOrder>
 */
class PurchaseOrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id'           => Customer::inRandomOrder()->first()->id,
            'customer_contact_id'   => CustomerContact::inRandomOrder()->first()->id,
            'delivery_address_id'   => DeliveryAddress::inRandomOrder()->first()->id,
            'product_category_id'   => ProductCategory::inRandomOrder()->first()->id,
            'billing_type'          => $this->faker->randomElement([1, 2]),
            'cutoff_day'            => $this->faker->numberBetween(1, 28),
            'payment_month_offset'  => $this->faker->numberBetween(0, 12),
            'payment_day'           => $this->faker->numberBetween(1, 28),
            'payment_day_offset'    => $this->faker->numberBetween(0, 30),
            'payment_date'          => $this->faker->date(),
            'payment_status'        => $this->faker->word,
            'ship_from_address'     => $this->faker->address,
            'purchase_date'         => $this->faker->date(),
            'note'                  => $this->faker->paragraph,
            'purchase_in_charge_id' => User::inRandomOrder()->first()->id,
            'created_by_id'         => User::inRandomOrder()->first()->id,
            'updated_by_id'         => User::inRandomOrder()->first()->id,
        ];
    }
}
