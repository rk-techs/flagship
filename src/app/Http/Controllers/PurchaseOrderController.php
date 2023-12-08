<?php

namespace App\Http\Controllers;

use App\Enums\PaymentTerm\BillingType;
use App\Enums\PaymentTerm\CutoffDay;
use App\Enums\PaymentTerm\PaymentDay;
use App\Enums\PaymentTerm\PaymentDayOffset;
use App\Enums\PaymentTerm\PaymentMonthOffset;
use App\Http\Requests\PurchaseOrderSearchRequest;
use App\Http\Requests\PurchaseOrderStoreRequest;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseOrderController extends Controller
{
    public function index(PurchaseOrderSearchRequest $request): Response
    {
        $keyword = $request->input('keyword');

        $purchaseOrders = PurchaseOrder::query()
            ->with([
                'customer',
                'purchaseInCharge',
                'productCategory',
                'purchaseOrderDetails',
            ])
            ->searchByKeyword($keyword)
            ->latest()
            ->paginate(100)
            ->withQueryString();

        return Inertia::render('PurchaseOrder/Index', [
            'purchaseOrders' => $purchaseOrders,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('PurchaseOrder/Create', [
            'userOptions'            => User::active()->get(),
            'productOptions'         => Product::all(),
            'productCategoryOptions' => ProductCategory::all(),
            'paymentTerms'           => $this->getPaymentTerms(),
        ]);
    }

    public function store(PurchaseOrderStoreRequest $request): RedirectResponse
    {
        // TODO: トランザクションにまとめて登録処理
        $purchaseOrder = PurchaseOrder::create([
            'customer_id'           => $request->input('customer_id'),
            'customer_contact_id'   => $request->input('customer_contact_id'),
            'billing_address_id'    => $request->input('billing_address_id'),
            'delivery_address_id'   => $request->input('delivery_address_id'),
            'product_category_id'   => $request->input('product_category_id'),
            'billing_type'          => $request->input('billing_type'),
            'cutoff_day'            => $request->input('cutoff_day'),
            'payment_month_offset'  => $request->input('payment_month_offset'),
            'payment_day'           => $request->input('payment_day'),
            'payment_day_offset'    => $request->input('payment_day_offset'),
            'payment_date'          => $request->input('payment_date'),
            'payment_status'        => $request->input('payment_status'),
            'customer_name'         => $request->input('customer_name'),
            'ship_from_address'     => $request->input('ship_from_address'),
            'purchase_date'         => $request->input('purchase_date'),
            'subtotal_amount'       => $request->input('subtotal_amount'),
            'total_amount'          => $request->input('total_amount'),
            'note'                  => $request->input('note'),
            'purchase_in_charge_id' => $request->input('purchase_in_charge_id'),
            'created_by_id'         => auth()->user()->id,
        ]);

        $subtotalAmount = 0;
        $totalAmount    = 0;

        // TODO: refactor 後でメソッド化,
        $purchaseOrderDetails = collect($request->input('purchase_order_details'))
            ->map(function ($detail, $index) use (&$subtotalAmount, &$totalAmount, $purchaseOrder) {

                // TODO: 計算をメソッド化
                $quantity = $detail['quantity'];
                $unitPrice = $detail['unit_price'];
                $taxRate = $detail['tax_rate'];
                $isTaxInclusive = $detail['is_tax_inclusive'];

                $basicSubtotal = $quantity * $unitPrice;

                if ($isTaxInclusive) {
                    $subtotal  = $basicSubtotal / (1 + $taxRate);
                    $taxAmount = $basicSubtotal - $subtotal;
                    $total     = $basicSubtotal;
                } else {
                    $subtotal   = $basicSubtotal;
                    $taxAmount  = $subtotal * $taxRate;
                    $total      = $subtotal + $taxAmount;
                }

                $subtotalAmount  += $subtotal;
                $totalAmount  += $total;

                return [
                    'purchase_order_id' => $purchaseOrder->id,
                    'row_number'        => $index + 1,
                    'product_id'        => $detail['product_id'],
                    'product_name'      => $detail['product_name'],
                    'product_detail'    => $detail['product_detail'],
                    'quantity'          => $detail['quantity'],
                    'unit_price'        => $detail['unit_price'],
                    'tax_rate'          => $detail['tax_rate'],
                    'is_tax_inclusive'  => $isTaxInclusive,
                    'tax_amount'        => $taxAmount,
                    'subtotal'          => $subtotal,
                    'total'             => $total,
                    'note'              => $detail['note'],
                ];
            })->toArray();

        PurchaseOrderDetail::insert($purchaseOrderDetails);

        $purchaseOrder->update([
            'subtotal_amount' => $subtotalAmount,
            'total_amount'    => $totalAmount,
        ]);


        return to_route('purchase-orders.index')
            ->with('message', "発注ID:{$purchaseOrder->id} 登録成功しました。");
    }

    private function getPaymentTerms(): array
    {
        return [
            'billingTypes' => BillingType::toArray(),
            'cutoffDays'   => CutoffDay::toArray(),
            'monthOffsets' => PaymentMonthOffset::toArray(),
            'paymentDay'   => PaymentDay::toArray(),
            'dayOffsets'   => PaymentDayOffset::toArray(),
        ];
    }
}
