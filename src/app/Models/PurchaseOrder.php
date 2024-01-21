<?php

namespace App\Models;

use App\Enums\PaymentTerm\BillingType;
use App\Enums\PaymentTerm\CutoffDay;
use App\Enums\PaymentTerm\PaymentDay;
use App\Enums\PaymentTerm\PaymentDayOffset;
use App\Enums\PaymentTerm\PaymentMonthOffset;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $appends = [
        'total',
        'total_with_tax',
    ];

    protected $fillable = [
        'customer_id',
        'customer_contact_id',
        'delivery_address_id',
        'product_category_id',
        'billing_type',
        'cutoff_day',
        'payment_month_offset',
        'payment_day',
        'payment_day_offset',
        'payment_date',
        'payment_status',
        'ship_from_address',
        'ship_from_company',
        'ship_from_contact',
        'purchase_date',
        'note',
        'purchase_in_charge_id',
        'created_by_id',
        'updated_by_id',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function customerContact(): BelongsTo
    {
        return $this->belongsTo(CustomerContact::class);
    }

    public function deliveryAddress(): BelongsTo
    {
        return $this->belongsTo(DeliveryAddress::class);
    }

    public function productCategory(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function purchaseInCharge(): BelongsTo
    {
        return $this->belongsTo(User::class, 'purchase_in_charge_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_id');
    }

    public function purchaseOrderDetails(): HasMany
    {
        return $this->hasMany(PurchaseOrderDetail::class)->orderBy('row_number');
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    /** 発注合計額(税抜き) */
    public function getTotalAttribute(): int
    {
        return $this->purchaseOrderDetails->sum('price');
    }

    /** 発注合計額(税込) */
    public function getTotalWithTaxAttribute(): int
    {
        return $this->purchaseOrderDetails->sum('price_with_tax');
    }

    public function getPurchaseTermLabelsAttribute(): array
    {
        return [
            'billing_type'  => BillingType::getLabelFromValue($this->billing_type),
            'cutoff_day'    => CutoffDay::getLabelFromValue($this->cutoff_day),
            'payment_month_offset'  => PaymentMonthOffset::getLabelFromValue($this->payment_month_offset),
            'payment_day'           => PaymentDay::getLabelFromValue($this->payment_day),
            'payment_day_offset'    => PaymentDayOffset::getLabelFromValue($this->payment_day_offset),
        ];
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
            $query->where('id', $keyword)
                ->orWhereHas('customer', function ($q) use ($keyword) {
                    $q->where('name', 'like', "%$keyword%");
                });
        });
    }

    public function scopeSearchByPurchasePeriod(Builder $query, ?string $startDate, ?string $endDate): Builder
    {
        if ($startDate && $endDate) {
            return $query->whereBetween('purchase_date', [$startDate, $endDate]);
        }

        if ($startDate) {
            return $query->where('purchase_date', '>=', $startDate);
        }

        if ($endDate) {
            return $query->where('purchase_date', '<=', $endDate);
        }

        return $query;
    }
}
