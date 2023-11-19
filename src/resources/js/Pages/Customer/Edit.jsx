import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, usePage } from '@inertiajs/react';
import CancelButton from '../../Components/CancelButton';
import OptionsList from '../../Components/OptionsList';
import TableInputRow from '../../Components/TableInputRow';

const Edit = ({ customer, userSelectOptions, paymentTerms }) => {
  const { flash } = usePage().props;

  const { data, setData, patch, processing, errors, reset, isDirty } = useForm({
    name: customer.name,
    name_kana: customer.name_kana || '',
    shortcut: customer.shortcut || '',
    postal_code: customer.postal_code || '',
    address: customer.address || '',
    tel: customer.tel || '',
    fax: customer.fax || '',
    note: customer.note || '',
    in_charge_user_id: customer.in_charge_user_id || '',

    purchase_billing_type: customer.purchase_term?.billing_type || '',
    purchase_cutoff_day: customer.purchase_term?.cutoff_day || '',
    purchase_payment_month_offset: customer.purchase_term?.payment_month_offset ?? '',
    purchase_payment_day: customer.purchase_term?.payment_day || '',
    purchase_payment_day_offset: customer.purchase_term?.payment_day_offset ?? '',

    sales_billing_type: customer.sales_term?.billing_type || '',
    sales_cutoff_day: customer.sales_term?.cutoff_day || '',
    sales_payment_month_offset: customer.sales_term?.payment_month_offset ?? '',
    sales_payment_day: customer.sales_term?.payment_day || '',
    sales_payment_day_offset: customer.sales_term?.payment_day_offset ?? '',
  });

  function submit(e) {
    e.preventDefault();
    patch(route('customers.update', customer), {
      onSuccess: () => reset(),
    });
  };

  return (
    <>
      <h1 className="content-title">取引先 編集</h1>
      <div className="content-navbar">
        <button
          type="submit"
          form="customerEditForm"
          className="btn btn-primary u-mr-3"
          disabled={processing}
        >
          更新する
        </button>
        <CancelButton isDirty={isDirty} route={route('customers.index')} />
        {processing && <span>Now Loading...</span>}
        <Link
          onBefore={() => confirm('本当に削除しますか？')}
          href={route('customers.destroy', customer)}
          method="delete"
          className="btn btn-danger u-ml-auto"
          as="button"
        >
          削除
        </Link>
      </div>

      {flash.message && (
        <div className="alert alert-danger">{flash.message}</div>
      )}

      <form id="customerEditForm" onSubmit={submit}>
      <div className="table-wrapper is-scrollable">
          <table className="table">
            <tbody className="tbody">
              <TableInputRow type="text" labelName="取引先名" inputName="name" data={data} errors={errors} setData={setData} isRequired={true} widthClass="u-w-200" />
              <TableInputRow type="text" labelName="読み仮名" inputName="name_kana" data={data} errors={errors} setData={setData} />
              <TableInputRow type="text" labelName="ショートカット名" inputName="shortcut" data={data} errors={errors} setData={setData} />
              <TableInputRow type="text" labelName="〒" inputName="postal_code" data={data} errors={errors} setData={setData} />
              <TableInputRow type="text" labelName="住所" inputName="address" data={data} errors={errors} setData={setData} />
              <TableInputRow type="text" labelName="TEL" inputName="tel" data={data} errors={errors} setData={setData} />
              <TableInputRow type="text" labelName="FAX" inputName="fax" data={data} errors={errors} setData={setData} />
              <TableInputRow type="text" labelName="備考" inputName="note" data={data} errors={errors} setData={setData} />

              <tr className="table-row is-flexible">
                <th className="th-cell">
                  <label htmlFor="in_charge_user_id" className="form-label">
                    担当ユーザー
                    <span className="required-mark">必須</span>
                  </label>
                </th>
                <td className="td-cell u-flex">
                  <select
                    name="in_charge_user_id"
                    id="in_charge_user_id"
                    value={data.in_charge_user_id}
                    onChange={e => setData('in_charge_user_id', e.target.value)}
                    className={`input-field ${errors.in_charge_user_id ? 'is-invalid' : ''}`}
                  >
                    <option value="">-- 担当ユーザー --</option>
                    {userSelectOptions.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {errors.in_charge_user_id && (<div className="invalid-feedback">{errors.in_charge_user_id}</div>)}
                </td>
              </tr>

              <tr className="table-row is-flexible">
                <th className="th-cell">
                  <label htmlFor="purchase_billing_type" className="form-label">
                    支払条件
                  </label>
                </th>
                <td className="td-cell">
                  <select
                    name="purchase_billing_type"
                    id="purchase_billing_type"
                    value={data.purchase_billing_type}
                    onChange={e => setData('purchase_billing_type', e.target.value)}
                    className={`input-field u-w-128 u-mr-3 ${errors.purchase_billing_type ? 'is-invalid' : ''}`}
                  >
                    <option value="">-- 請求方法 --</option>
                    <OptionsList options={paymentTerms.billingTypes} />
                  </select>
                  {data.purchase_billing_type == 1 && (
                    <>
                      <select
                        name="purchase_cutoff_day"
                        id="purchase_cutoff_day"
                        value={data.purchase_cutoff_day}
                        onChange={e => setData('purchase_cutoff_day', e.target.value)}
                        className={`input-field u-w-128 ${errors.purchase_cutoff_day ? 'is-invalid' : ''}`}
                      >
                        <option value="">-- 締め日 --</option>
                        <OptionsList options={paymentTerms.cutoffDays} />
                      </select>
                      <select
                        name="purchase_payment_month_offset"
                        id="purchase_payment_month_offset"
                        value={data.purchase_payment_month_offset}
                        onChange={e => setData('purchase_payment_month_offset', e.target.value)}
                        className={`input-field u-w-128 ${errors.purchase_payment_month_offset ? 'is-invalid' : ''}`}
                      >
                        <option value="">-- 支払月 --</option>
                        <OptionsList options={paymentTerms.monthOffsets} />
                      </select>
                      <select
                        name="purchase_payment_day"
                        id="purchase_payment_day"
                        value={data.purchase_payment_day}
                        onChange={e => setData('purchase_payment_day', e.target.value)}
                        className={`input-field u-w-128 ${errors.purchase_payment_day ? 'is-invalid' : ''}`}
                      >
                        <option value="">-- 支払日 --</option>
                        <OptionsList options={paymentTerms.paymentDay} />
                      </select>
                    </>
                  )}
                  {data.purchase_billing_type == 2 && (
                    <>
                      <select
                        name="purchase_payment_day_offset"
                        id="purchase_payment_day_offset"
                        value={data.purchase_payment_day_offset}
                        onChange={e => setData('purchase_payment_day_offset', e.target.value)}
                        className={`input-field u-w-128 ${errors.purchase_payment_day_offset ? 'is-invalid' : ''}`}
                      >
                        <option value="">-- 期限 --</option>
                        <OptionsList options={paymentTerms.dayOffsets} />
                      </select>
                    </>
                  )}
                </td>
              </tr>

              <tr className="table-row is-flexible">
                <th className="th-cell">
                  <label htmlFor="sales_billing_type" className="form-label">
                    請求条件
                  </label>
                </th>
                <td className="td-cell">
                  <select
                    name="sales_billing_type"
                    id="sales_billing_type"
                    value={data.sales_billing_type}
                    onChange={e => setData('sales_billing_type', e.target.value)}
                    className={`input-field u-w-128 u-mr-3 ${errors.sales_billing_type ? 'is-invalid' : ''}`}
                  >
                    <option value="">-- 請求方法 --</option>
                    <OptionsList options={paymentTerms.billingTypes} />
                  </select>
                  {data.sales_billing_type == 1 && (
                    <>
                      <select
                        name="sales_cutoff_day"
                        id="sales_cutoff_day"
                        value={data.sales_cutoff_day}
                        onChange={e => setData('sales_cutoff_day', e.target.value)}
                        className={`input-field u-w-128 ${errors.sales_cutoff_day ? 'is-invalid' : ''}`}
                      >
                        <option value="">-- 締め日 --</option>
                        <OptionsList options={paymentTerms.cutoffDays} />
                      </select>
                      <select
                        name="sales_payment_month_offset"
                        id="sales_payment_month_offset"
                        value={data.sales_payment_month_offset}
                        onChange={e => setData('sales_payment_month_offset', e.target.value)}
                        className={`input-field u-w-128 ${errors.sales_payment_month_offset ? 'is-invalid' : ''}`}
                      >
                        <option value="">-- 支払月 --</option>
                        <OptionsList options={paymentTerms.monthOffsets} />
                      </select>
                      <select
                        name="sales_payment_day"
                        id="sales_payment_day"
                        value={data.sales_payment_day}
                        onChange={e => setData('sales_payment_day', e.target.value)}
                        className={`input-field u-w-128 ${errors.sales_payment_day ? 'is-invalid' : ''}`}
                      >
                        <option value="">-- 支払日 --</option>
                        <OptionsList options={paymentTerms.paymentDay} />
                      </select>
                    </>
                  )}
                  {data.sales_billing_type == 2 && (
                    <>
                      <select
                        name="sales_payment_day_offset"
                        id="sales_payment_day_offset"
                        value={data.sales_payment_day_offset}
                        onChange={e => setData('sales_payment_day_offset', e.target.value)}
                        className={`input-field u-w-128 ${errors.sales_payment_day_offset ? 'is-invalid' : ''}`}
                      >
                        <option value="">-- 期限 --</option>
                        <OptionsList options={paymentTerms.dayOffsets} />
                      </select>
                    </>
                  )}
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </form>
    </>
  );
}

Edit.layout = page => <AppLayout children={page} />

export default Edit
