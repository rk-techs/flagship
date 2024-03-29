import { usePage } from '@inertiajs/react';

import TermDetails from './Partials/TermDetails';

import Alert from '@/Components/Alert';
import ContentInfoBar from '@/Components/ContentInfoBar';
import DuplicateLinkButton from '@/Components/DuplicateLinkButton';
import EditLinkButton from '@/Components/EditLinkButton';
import NewTabLink from '@/Components/NewTabLink';
import AppLayout from '@/Layouts/AppLayout';
import { formatNumber, formatCurrency } from '@/Utils/priceCalculator';

const Show = ({ salesOrder }) => {
  const { flash } = usePage().props;
  const soTotal = salesOrder.total;
  const soTotalWithTax = salesOrder.total_with_tax;

  const poTotal = salesOrder.sales_order_details.flatMap(soDetail =>
    soDetail.purchase_order_details.map(poDetail => parseFloat(poDetail.price))
  ).reduce((acc, crr) => acc + crr, 0);

  const poTotalWithTax = salesOrder.sales_order_details.flatMap(soDetail =>
    soDetail.purchase_order_details.map(poDetail => parseFloat(poDetail.price_with_tax))
  ).reduce((acc, crr) => acc + crr, 0);

  const totalProfit = soTotal - poTotal;

  return (
    <>
      <h1 className="content-title">受注 詳細</h1>

      <ContentInfoBar
        createdAt={salesOrder.created_at}
        createdBy={salesOrder.created_by.name}
        updatedAt={salesOrder.updated_at}
        updatedBy={salesOrder.updated_by?.name}
      />

      <div className="content-navbar">
        <EditLinkButton href={route('sales-orders.edit', salesOrder)} style={{ marginRight: '16px' }} />
        <DuplicateLinkButton href={route('sales-orders.duplicate', salesOrder)} />
      </div>

      <Alert type={flash.type} message={flash.message} />

      <div className="content-section">

        <div className="content-section-title">
          受注内容
        </div>

        <div className="table-wrapper">
          <table className="table">
            <tbody className="tbody">

              <tr className="table-row">
                <th className="th-cell u-w-144">受注日</th>
                <td className="td-cell">{salesOrder.order_date}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">販売先</th>
                <td className="td-cell">
                  <NewTabLink
                    url={route('customers.show', salesOrder.customer)}
                    displayText={salesOrder.customer.name}
                  />
                </td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">販売先顧客</th>
                <td className="td-cell">{salesOrder.customer_contact?.name}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">請求先</th>
                <td className="td-cell">
                  {salesOrder.billing_address.name}
                </td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">納品先</th>
                <td className="td-cell">
                  <div>{salesOrder.delivery_address}</div>
                  <div>{salesOrder.consignee_company}</div>
                  <div>{salesOrder.consignee_contact}</div>
                </td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">出荷日</th>
                <td className="td-cell">
                  {salesOrder.shipping_date} {salesOrder.shipping_status}
                </td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">納品日</th>
                <td className="td-cell">
                  {salesOrder.delivery_date} {salesOrder.delivery_status}
                </td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">配送メモ</th>
                <td className="td-cell">{salesOrder.delivery_memo}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">商品カテゴリ</th>
                <td className="td-cell">{salesOrder.product_category.name}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">請求条件</th>
                <td className="td-cell">
                  <TermDetails salesOrder={salesOrder} />
                </td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">入金日</th>
                <td className="td-cell">
                  {salesOrder.payment_date} {salesOrder.payment_status}
                </td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">受注担当</th>
                <td className="td-cell">{salesOrder.sales_in_charge.name}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">備考</th>
                <td className="td-cell">{salesOrder.note}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>


      <div className="content-section">
        <div className="content-section-header">
              <div className="content-section-title">受注明細</div>
              <div className="u-flex u-ml-auto">
                <div className="u-flex u-mr-4 u-items-center">
                  <span className="u-min-w-64">
                    <span className="indicator-dot dot-pink"></span>
                    発注額
                  </span>
                  <span>
                    {formatCurrency(poTotal)}
                  </span>
                  <span className="u-text-sm">
                    ({formatCurrency(poTotalWithTax)})
                  </span>
                </div>
                <div className="u-flex u-mr-4 u-items-center">
                  <span className="u-min-w-64">
                    <span className="indicator-dot dot-blue"></span>
                    受注額
                  </span>
                  <span>
                    {formatCurrency(soTotal)}
                  </span>
                  <span className="u-text-sm">
                    ({formatCurrency(soTotalWithTax)})
                  </span>
                </div>
                <div className="u-flex u-items-center">
                  <span className="u-min-w-48">
                    <span className="indicator-dot dot-green"></span>
                    利益
                  </span>
                  <span>
                    {formatCurrency(totalProfit)}
                  </span>
                </div>
              </div>
        </div>
        <div className="table-wrapper is-scrollable">
          <table className="table">
            <thead className="table-header is-sticky">
              <tr className="table-row">
                <th className="th-cell u-w-64 col-fixed">No.</th>
                <th className="th-cell u-min-w-280">商品</th>
                <th className="th-cell u-min-w-320">発注先</th>
                <th className="th-cell u-min-w-120">発注担当</th>
                <th className="th-cell u-min-w-104 u-text-right">発注数量</th>
                <th className="th-cell u-min-w-104 u-text-right">販売数量</th>
                <th className="th-cell u-min-w-104 u-text-right">発注単価</th>
                <th className="th-cell u-min-w-104 u-text-right">販売単価</th>
                <th className="th-cell u-min-w-120 u-text-right">発注額</th>
                <th className="th-cell u-min-w-120 u-text-right">受注額</th>
                <th className="th-cell u-min-w-120 u-text-right">利益</th>
                <th className="th-cell u-min-w-320">備考</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {salesOrder.sales_order_details.map(detail => (
                <tr key={detail.id} className="table-row is-hoverable">
                  <td className="td-cell col-fixed">{detail.row_number}</td>
                  <td className="td-cell">
                    <div>{detail.product?.name}</div>
                    <div>{detail.product_name}</div>
                    <div className="u-text-gray">{detail.product_detail}</div>
                  </td>
                  <td className="td-cell">
                    <div>{detail.purchase_order_details[0]?.purchase_order.customer.name}</div>
                    <div>{detail.purchase_order_details[0]?.purchase_order?.customer_contact?.name}</div>

                    {detail.purchase_order_details[0]?.purchase_order?.delivery_address_id && (
                      <details className="u-text-gray u-mt-1">
                        <summary>出荷元情報</summary>
                        <div>
                          <div>{detail.purchase_order_details[0]?.purchase_order?.ship_from_company}</div>
                          <div>{detail.purchase_order_details[0]?.purchase_order?.ship_from_address}</div>
                        </div>
                      </details>
                    )}
                  </td>
                  <td className="td-cell">{detail.purchase_order_details[0]?.purchase_order.purchase_in_charge.name}</td>
                  <td className="td-cell u-text-right">{formatNumber(detail.purchase_order_details[0]?.quantity)}</td>
                  <td className="td-cell u-text-right">{formatNumber(detail.quantity)}</td>
                  <td className="td-cell u-text-right">{formatCurrency(detail.purchase_order_details[0]?.unit_price)}</td>
                  <td className="td-cell u-text-right">{formatCurrency(detail.unit_price)}</td>
                  <td className="td-cell u-text-right u-bg-lightgray">
                    <div>{formatCurrency(detail.purchase_order_details[0]?.price)}</div>
                    <div className="u-text-sm">({formatCurrency(detail.purchase_order_details[0]?.price_with_tax)})</div>
                  </td>
                  <td className="td-cell u-text-right u-bg-lightgray">
                    <div>{formatCurrency(detail.price)}</div>
                    <div className="u-text-sm">({formatCurrency(detail.price_with_tax)})</div>
                  </td>
                  <td className="td-cell u-text-right u-bg-lightgray">
                    {formatCurrency(detail.price - detail.purchase_order_details[0]?.price)}
                  </td>
                  <td className="td-cell">{detail.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
}

Show.layout = page => <AppLayout title="受注 詳細" children={page} />

export default Show
