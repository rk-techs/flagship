<?php

namespace App\Http\Controllers;

use App\Http\Requests\SalesOrderSearchRequest;
use App\Http\Requests\SalesOrderStoreRequest;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
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
        $salesOrders = SalesOrder::query()
            ->with([
                'customer',
                'salesInCharge',
                'productCategory',
                'salesOrderDetails',
            ])
            ->searchByKeyword($request->input('keyword'))
            ->searchByDeliveryPeriod(
                $request->input('start_date'),
                $request->input('end_date')
            )
            ->searchByCustomerName($request->input('customer_name'))
            ->searchBySalesInCharge($request->input('sales_in_charge_id'))
            ->latest()
            ->paginate(100)
            ->withQueryString();

        return Inertia::render('SalesOrder/Index', [
            'salesOrders' => $salesOrders,
            'userOptions' => User::hasSalesOrders()->get(),
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
        $salesOrder = $this->createSalesOrder($request);
        $this->createDetailRows($salesOrder, $request->input('detail_rows'));

        return to_route('sales-orders.index')
            ->with('message', "受注ID:{$salesOrder->id} 登録成功しました。");
    }

    public function show(SalesOrder $salesOrder): Response
    {
        $salesOrder->load([
            'customer',
            'customerContact',
            'deliveryAddress',
            'productCategory',
            'salesInCharge',
            'createdBy',
            'updatedBy',
            'salesOrderDetails.purchaseOrderDetails.purchaseOrder.customer',
        ]);

        return Inertia::render('SalesOrder/Show', [
            'salesOrder' => $salesOrder,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Business Logic
    |--------------------------------------------------------------------------
    */

    /** 受注登録 */
    private static function createSalesOrder(SalesOrderStoreRequest $request): SalesOrder
    {
        return SalesOrder::create([
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
    }

    /**
     * 明細行（受注明細・発注・発注明細）の紐付き受発注登録処理。明細行は多くて10~20程度の想定,パフォーマンス影響小。
     */
    private function createDetailRows(SalesOrder $salesOrder, array $detailRows): void
    {
        collect($detailRows)->each(function ($detailRow, $index) use ($salesOrder) {
            $salesOrderDetail    = $this->createSalesOrderDetail($detailRow['sales_order_detail'], $salesOrder, $index);
            $purchaseOrder       = $this->createPurchaseOrder($detailRow['purchase_order'], $salesOrderDetail);
            $purchaseOrderDetail = $this->createPurchaseOrderDetail($detailRow['purchase_order_detail'], $purchaseOrder, $index);
            $salesOrderDetail->purchaseOrderDetails()->attach($purchaseOrderDetail);
        });
    }

    /** 受注明細 */
    private function createSalesOrderDetail(array $salesOrderDetail, SalesOrder $salesOrder, int $index): SalesOrderDetail
    {
        return $salesOrder->salesOrderDetails()->create([
            'row_number'        => $index + 1,
            'product_id'        => $salesOrderDetail['product_id'] ?? null,
            'product_name'      => $salesOrderDetail['product_name'] ?? null,
            'product_detail'    => $salesOrderDetail['product_detail'] ?? null,
            'quantity'          => $salesOrderDetail['quantity'],
            'unit_price'        => $salesOrderDetail['unit_price'],
            'tax_rate'          => $salesOrderDetail['tax_rate'],
            'is_tax_inclusive'  => (bool)$salesOrderDetail['is_tax_inclusive'],
            'note'              => $salesOrderDetail['note'] ?? null,
        ]);
    }

    /** 発注 */
    private function createPurchaseOrder(array $purchaseOrder, SalesOrderDetail $salesOrderDetail): PurchaseOrder
    {
        return PurchaseOrder::create([
            'customer_id'           => $purchaseOrder['customer_id'] ?? null,
            'customer_contact_id'   => $purchaseOrder['customer_contact_id'] ?? null,
            'billing_address_id'    => $purchaseOrder['billing_address_id'] ?? null,
            'delivery_address_id'   => $purchaseOrder['delivery_address_id'] ?? null,
            'product_category_id'   => 1, // TODO: あとで
            'billing_type'          => $purchaseOrder['billing_type'] ?? null,
            'cutoff_day'            => $purchaseOrder['cutoff_day'] ?? null,
            'payment_month_offset'  => $purchaseOrder['payment_month_offset'] ?? null,
            'payment_day'           => $purchaseOrder['payment_day'] ?? null,
            'payment_day_offset'    => $purchaseOrder['payment_day_offset'] ?? null,
            'payment_date'          => $purchaseOrder['payment_date'] ?? null,
            'payment_status'        => $purchaseOrder['payment_status'] ?? null,
            'customer_name'         => $purchaseOrder['customer_name'] ?? null,
            'ship_from_address'     => $purchaseOrder['ship_from_address'] ?? 'TEMP',
            'purchase_date'         => now(), // TODO: order_dateに合わせる
            'note'                  => $purchaseOrder['note'] ?? null,
            'purchase_in_charge_id' => $purchaseOrder['purchase_in_charge_id'] ?? null,
            'created_by_id'         => auth()->user()->id,
        ]);
    }

    /** 発注明細 */
    private function createPurchaseOrderDetail(array $purchaseOrderDetail, PurchaseOrder $purchaseOrder, int $index): PurchaseOrderDetail
    {
        return $purchaseOrder->purchaseOrderDetails()->create([
            'row_number'        => $index + 1,
            'product_id'        => $purchaseOrderDetail['product_id'] ?? null,
            'product_name'      => 'TEMP', // TODO：あとで修正
            'product_detail'    => $purchaseOrderDetail['product_detail'] ?? null,
            'quantity'          => $purchaseOrderDetail['quantity'],
            'unit_price'        => $purchaseOrderDetail['unit_price'],
            'tax_rate'          => $purchaseOrderDetail['tax_rate'],
            'is_tax_inclusive'  => (bool)$purchaseOrderDetail['is_tax_inclusive'],
            'note'              => $purchaseOrderDetail['note'] ?? null,
        ]);
    }
}
