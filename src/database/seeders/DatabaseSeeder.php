<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\TaxRate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (App::environment(['local', 'staging', 'testing'])) {
            $this->call([
                PermissionSeeder::class,
                UserSeeder::class,
                RegionSeeder::class,
                PrefectureSeeder::class,
                LeadSourceSeeder::class,
                CustomerSeeder::class,
                BillingAddressSeeder::class,
                DeliveryAddressSeeder::class,
                PurchaseTermSeeder::class,
                SalesTermSeeder::class,
                ProductSeeder::class,
                InquiryTypeSeeder::class,
                InquirySeeder::class,
                TaxRateSeeder::class,
                SalesActivitySeeder::class,
                PurchaseOrderSeeder::class,
                SalesOrderSeeder::class,
            ]);
        }
    }
}
