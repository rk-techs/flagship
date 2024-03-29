<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class BillingAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_kana',
        'shortcut',
        'billing_contact_name',
        'postal_code',
        'address',
        'email',
        'tel',
        'fax',
        'invoice_delivery_method',
        'note',
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i',
        'updated_at' => 'datetime:Y-m-d H:i',
    ];

    public function customers(): BelongsToMany
    {
        return $this->belongsToMany(Customer::class, 'billing_address_customer');
    }

    public function scopeSearchByKeyword(Builder $query, ?string $keyword): Builder
    {
        if (!$keyword) {
            return $query;
        }

        return $query->where(function ($query) use ($keyword) {
            $query->where('name', 'like', "%$keyword%")
                ->orWhere('name_kana', 'like', "%$keyword%")
                ->orWhere('shortcut', 'like', "%$keyword%");
        });
    }
}
