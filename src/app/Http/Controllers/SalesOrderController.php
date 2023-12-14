<?php

namespace App\Http\Controllers;

use App\Http\Requests\SalesOrderSearchRequest;
use App\Http\Requests\SalesOrderStoreRequest;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\SalesOrder;
use App\Models\SalesOrderDetail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SalesOrderController extends Controller
{
    public function index(SalesOrderSearchRequest $request): Response
    {
        $keyword = $request->input('keyword');

        $salesOrders = SalesOrder::query()
            ->with([
                'customer',
                'salesInCharge',
                'productCategory',
                'salesOrderDetails',
            ])
            ->searchByKeyword($keyword)
            ->latest()
            ->paginate(100)
            ->withQueryString();

        return Inertia::render('SalesOrder/Index', [
            'salesOrders' => $salesOrders,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('SalesOrder/Create', [
            'userOptions'            => User::active()->get(),
            'productOptions'         => Product::all(),
            'productCategoryOptions' => ProductCategory::all(),
        ]);
    }

    public function store(SalesOrderStoreRequest $request): RedirectResponse
    {
        // TODO: トランザクションにまとめて登録処理
        $salesOrder = SalesOrder::create([
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
            'delivery_address'      => $request->input('delivery_address'),
            'order_date'            => $request->input('order_date'),
            'shipping_date'         => $request->input('shipping_date'),
            'shipping_status'       => $request->input('shipping_status'),
            'delivery_date'         => $request->input('delivery_date'),
            'delivery_status'       => $request->input('delivery_status'),
            'delivery_memo'         => $request->input('delivery_memo'),
            'note'                  => $request->input('note'),
            'sales_in_charge_id'    => $request->input('sales_in_charge_id'),
            'created_by_id'         => auth()->user()->id,
        ]);

        // TODO: refactor 後でメソッド化,
        $salesOrderDetails = collect($request->input('sales_order_details'))
            ->map(function ($detail, $index) use ($salesOrder) {
                return [
                    'sales_order_id'    => $salesOrder->id,
                    'row_number'        => $index + 1,
                    'product_id'        => $detail['product_id'] ?? null,
                    'product_name'      => $detail['product_name'] ?? null,
                    'product_detail'    => $detail['product_detail'] ?? null,
                    'quantity'          => $detail['quantity'],
                    'unit_price'        => $detail['unit_price'],
                    'tax_rate'          => $detail['tax_rate'],
                    'is_tax_inclusive'  => (boolean)$detail['is_tax_inclusive'],
                    'note'              => $detail['note'] ?? null,
                ];
            })->toArray();

        SalesOrderDetail::insert($salesOrderDetails);

        return to_route('sales-orders.index')
            ->with('message', "受注ID:{$salesOrder->id} 登録成功しました。");
    }
}
