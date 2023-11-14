<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomerContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'name',
        'name_kana',
        'tel',
        'mobile_number',
        'email',
        'position',
        'role',
        'is_active',
        'note',
        'in_charge_user_id',
        'created_by_id',
        'updated_by_id',
    ];


    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    |
    */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function inChargeUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'in_charge_user_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_id');
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */
    public function scopeSearchByKeyword(Builder $query, ?string $keyword): Builder
    {
        if (!$keyword) {
            return $query;
        }

        return $query->where(function ($query) use ($keyword) {
            $query->where('name', 'LIKE', "%$keyword%")
                  ->orWhere('name_kana', 'LIKE', "%$keyword%");
        });
    }
}
