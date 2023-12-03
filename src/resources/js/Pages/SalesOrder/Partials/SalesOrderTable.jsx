export default function SalesOrderTable({ salesOrders }) {
  return (
    <div className="table-wrapper is-scrollable">
      <table className="table">
        <thead className="table-header is-sticky">
          <tr className="table-row">
            <th className="th-cell col-fixed">ID</th>
            <th className="th-cell u-min-w-136">納期</th>
            <th className="th-cell u-min-w-160">商品カテゴリ</th>
            <th className="th-cell u-min-w-240">販売先</th>
            <th className="th-cell u-min-w-120">販売担当</th>
            <th className="th-cell u-min-w-120">合計金額</th>
            <th className="th-cell">備考</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {salesOrders.map(salesOrder => (
            <tr key={salesOrder.id} className="table-row is-hoverable">
              <td className="td-cell col-fixed">{salesOrder.id}</td>
              <td className="td-cell">{salesOrder.delivery_date}</td>
              <td className="td-cell">{salesOrder.product_category.name}</td>
              <td className="td-cell">{salesOrder.customer_name}</td>
              <td className="td-cell">{salesOrder.sales_in_charge.name}</td>
              <td className="td-cell">{salesOrder.total_amount}</td>
              <td className="td-cell">{salesOrder.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}