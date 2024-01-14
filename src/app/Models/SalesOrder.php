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

class SalesOrder extends Model
{
    use HasFactory;

    protected $appends = [
        'sales_term_labels',
        'total',
        'total_with_tax',
    ];

    protected $fillable = [
        'customer_id',
        'customer_contact_id',
        'billing_address_id',
        'delivery_address_id',
        'product_category_id',
        'billing_type',
        'cutoff_day',
        'payment_month_offset',
        'payment_day',
        'payment_day_offset',
        'payment_date',
        'payment_status',
        'customer_name',
        'delivery_address',
        'order_date',
        'shipping_date',
        'shipping_status',
        'delivery_date',
        'delivery_status',
        'delivery_memo',
        'note',
        'sales_in_charge_id',
        'created_by_id',
        'updated_by_id',
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i',
        'updated_at' => 'datetime:Y-m-d H:i',
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

    public function billingAddress(): BelongsTo
    {
        return $this->belongsTo(BillingAddress::class);
    }

    public function deliveryAddress(): BelongsTo
    {
        return $this->belongsTo(DeliveryAddress::class);
    }

    public function productCategory(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function salesInCharge(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sales_in_charge_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_id');
    }

    public function salesOrderDetails(): HasMany
    {
        return $this->hasMany(SalesOrderDetail::class)->orderBy('row_number');
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    /** 受注合計額(税抜き) */
    public function getTotalAttribute(): int
    {
        return $this->salesOrderDetails->sum('price');
    }

    /** 受注合計額(税込) */
    public function getTotalWithTaxAttribute(): int
    {
        return $this->salesOrderDetails->sum('price_with_tax');
    }

    public function getSalesTermLabelsAttribute(): array
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
                ->orWhere('customer_name', 'like', "%$keyword%");
        });
    }

    public function scopeSearchByDeliveryPeriod(Builder $query, ?string $startDate, ?string $endDate): Builder
    {
        if ($startDate && $endDate) {
            return $query->whereBetween('delivery_date', [$startDate, $endDate]);
        }

        if ($startDate) {
            return $query->where('delivery_date', '>=', $startDate);
        }

        if ($endDate) {
            return $query->where('delivery_date', '<=', $endDate);
        }

        return $query;
    }

    public function scopeSearchByCustomerName(Builder $query, ?string $customerName): Builder
    {
        if (!$customerName) {
            return $query;
        }

        return $query->whereHas('customer', function ($q) use ($customerName) {
            $q->where('name', 'like', "%$customerName%");
        });
    }

    public function scopeSearchBySalesInCharge(Builder $query, ?string $salesInChargeId): Builder
    {
        if (!$salesInChargeId) {
            return $query;
        }

        return $query->where('sales_in_charge_id', $salesInChargeId);
    }
}
