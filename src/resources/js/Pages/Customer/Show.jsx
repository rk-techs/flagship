import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Alert from '@/Components/Alert';
import ContentInfoBar from '@/Components/ContentInfoBar';
import Modal from '@/Components/Modal';
import ContactForm from './Partials/ContactForm';
import AddressForm from './Partials/AddressForm';
import SalesActivityForm from './Partials/SalesActivityForm';
import TermDetails from './Partials/TermDetails';
import BillingAddressLookup from "../../Components/BillingAddressLookup";
import BillingAddressForm from "./Partials/BillingAddressForm";
import DropdownMenu from "./Partials/DropdownMenu";
import EditLinkButton from '@/Components/EditLinkButton';
import { parseNumber, formatCurrency } from '@/Utils/priceCalculator';


const Show = ({ customer, userOptions, addressTypeOptions, leadSourceOptions }) => {
  const { flash } = usePage().props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSalesActivityModalOpen, setIsSalesActivityModalOpen] = useState(false);
  const [isBillingAddressCreateModalOpen, setIsBillingAddressCreateModalOpen] = useState(false);
  const [isBillingAddressModalOpen, setIsBillingAddressModalOpen] = useState(false);

  function attachBillingAddress(billingAddress) {
    const url = route('customers.attach-billing-address', customer);
    router.visit(url, {
      method: 'patch',
      data: { billing_address_id: billingAddress.id },
      onSuccess: () => setIsBillingAddressModalOpen(false),
    });
  }

  function detachBillingAddress(billingAddress) {
    const url = route('customers.detach-billing-address', customer)
    router.visit(url, {
      method: 'post',
      data: { billing_address_id: billingAddress.id },
    });
  }

  return (
    <>
      <h1 className="content-title">取引先 詳細</h1>

      <ContentInfoBar
        createdAt={customer.created_at}
        createdBy={customer.created_by.name}
        updatedAt={customer.updated_at}
        updatedBy={customer.updated_by?.name}
      />

      <div className="content-navbar">
        <EditLinkButton href={route('customers.edit', customer)} style={{ marginRight: '16px' }} />
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-secondary u-mr-3">
          +連絡先を追加
        </button>
        <button
          onClick={() => setIsAddressModalOpen(true)}
          className="btn btn-secondary u-mr-3">
          +配送情報を追加
        </button>
        <button
          onClick={() => setIsSalesActivityModalOpen(true)}
          className="btn btn-secondary u-mr-3">
          +営業履歴を追加
        </button>
        <button
          onClick={() => setIsBillingAddressCreateModalOpen(true)}
          className="btn btn-secondary u-mr-3">
          +請求先を追加
        </button>
        <button
          onClick={() => setIsBillingAddressModalOpen(true)}
          className="btn btn-secondary u-mr-3">
          既存の請求先を紐付け
        </button>
      </div>

      {isModalOpen &&
        <Modal closeModal={() => setIsModalOpen(false)} title="連絡先登録">
          <ContactForm
            customer={customer}
            userOptions={userOptions}
            leadSourceOptions={leadSourceOptions}
            closeModal={() => setIsModalOpen(false)}
          />
        </Modal>}

      {isAddressModalOpen &&
        <Modal closeModal={() => setIsAddressModalOpen(false)} title="配送情報 登録">
          <AddressForm customer={customer} addressTypeOptions={addressTypeOptions} closeModal={() => setIsAddressModalOpen(false)} />
        </Modal>}

      {isSalesActivityModalOpen &&
        <Modal closeModal={() => setIsSalesActivityModalOpen(false)} title="営業履歴 登録">
          <SalesActivityForm customer={customer} userOptions={userOptions} closeModal={() => setIsSalesActivityModalOpen(false)} />
        </Modal>}

      {isBillingAddressCreateModalOpen &&
        <Modal closeModal={() => setIsBillingAddressCreateModalOpen(false)} title="請求先 登録">
          <BillingAddressForm customer={customer} closeModal={() => setIsBillingAddressCreateModalOpen(false)} />
        </Modal>}

      {isBillingAddressModalOpen &&
        <Modal closeModal={() => setIsBillingAddressModalOpen(false)} title="請求先 紐付け">
          <BillingAddressLookup
            customer={customer}
            handleClickAttach={billingAddress => attachBillingAddress(billingAddress)}
          />
        </Modal>}

      <Alert type={flash.type} message={flash.message} />

      <div className="content-section">

        <div className="content-section-title">
          基本情報
        </div>

        <div className="table-wrapper">
          <table className="table">
            <tbody className="tbody">

              <tr className="table-row">
                <th className="th-cell u-w-200">取引先名</th>
                <td className="td-cell">{customer.name}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">よみがな</th>
                <td className="td-cell">{customer.name_kana}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">ショートカット名</th>
                <td className="td-cell">{customer.shortcut}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">住所</th>
                <td className="td-cell">{customer.postal_code} {customer.address}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">TEL</th>
                <td className="td-cell">{customer.tel}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">FAX</th>
                <td className="td-cell">{customer.fax}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">支払条件</th>
                <td className="td-cell">
                  <TermDetails term={customer.purchase_term} />
                </td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">請求条件</th>
                <td className="td-cell">
                  <TermDetails term={customer.sales_term} />
                </td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">担当ユーザー</th>
                <td className="td-cell">{customer.in_charge_user?.name}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">備考</th>
                <td className="td-cell">{customer.note}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section-title">
          請求先
        </div>
        <div className="table-wrapper is-scrollable">
          <table className="table">
            <thead className="table-header is-sticky">
              <tr className="table-row">
                <th className="th-cell col-fixed"></th>
                <th className="th-cell">No.</th>
                <th className="th-cell u-min-w-200">請求先</th>
                <th className="th-cell u-min-w-136">請求先担当者</th>
                <th className="th-cell u-min-w-320">住所</th>
                <th className="th-cell u-min-w-160">TEL</th>
                <th className="th-cell u-min-w-160">FAX</th>
                <th className="th-cell u-min-w-160">E-mail</th>
                <th className="th-cell u-w-120">備考</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {customer.billing_addresses.map(billingAddress => (
                <tr key={billingAddress.id} className="table-row is-hoverable">
                  <td className="td-cell col-fixed">
                    <DropdownMenu
                      handleClickDetach={() => detachBillingAddress(billingAddress)}
                    />
                  </td>
                  <td className="td-cell">{billingAddress.id}</td>
                  <td className="td-cell">
                    {billingAddress.name} <br />
                    ({billingAddress.name_kana})
                  </td>
                  <td className="td-cell">{billingAddress.billing_contact_name}</td>
                  <td className="td-cell">{billingAddress.address}</td>
                  <td className="td-cell">{billingAddress.tel}</td>
                  <td className="td-cell">{billingAddress.fax}</td>
                  <td className="td-cell">{billingAddress.email}</td>
                  <td className="td-cell u-ellipsis u-max-w-320">{billingAddress.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section-title">
          連絡先
        </div>
        <div className="table-wrapper is-scrollable">
          <table className="table">
            <thead className="table-header is-sticky">
              <tr className="table-row">
                <th className="th-cell col-fixed">No</th>
                <th className="th-cell">役割</th>
                <th className="th-cell">名前</th>
                <th className="th-cell">よみがな</th>
                <th className="th-cell">TEL</th>
                <th className="th-cell">携帯</th>
                <th className="th-cell">E-mail</th>
                <th className="th-cell">役職</th>
                <th className="th-cell u-min-w-120">担当ユーザー</th>
                <th className="th-cell u-min-w-120">獲得元</th>
                <th className="th-cell u-text-center u-min-w-80">使用状況</th>
                <th className="th-cell u-w-120">備考</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {customer.contacts.map(contact => (
                <tr key={contact.id} className="table-row is-hoverable">
                  <td className="td-cell col-fixed">{contact.id}</td>
                  <td className="td-cell">{contact.role}</td>
                  <td className="td-cell u-min-w-160">{contact.name}</td>
                  <td className="td-cell">{contact.name_kana}</td>
                  <td className="td-cell u-min-w-160">{contact.tel}</td>
                  <td className="td-cell u-min-w-160">{contact.mobile_number}</td>
                  <td className="td-cell u-min-w-160">{contact.email}</td>
                  <td className="td-cell">{contact.position}</td>
                  <td className="td-cell">{contact.in_charge_user?.name}</td>
                  <td className="td-cell">{contact.lead_source?.name}</td>
                  <td className="td-cell u-text-center">{contact.is_active_label}</td>
                  <td className="td-cell u-ellipsis u-max-w-320">{contact.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section-title">
          配送情報
        </div>
        <div className="table-wrapper is-scrollable">
          <table className="table">
            <thead className="table-header is-sticky">
              <tr className="table-row">
                <th className="th-cell u-min-w-120 col-fixed">区分</th>
                <th className="th-cell u-min-w-240">住所</th>
                <th className="th-cell u-min-w-200">会社名</th>
                <th className="th-cell u-min-w-160">担当者名</th>
                <th className="th-cell u-min-w-160">TEL</th>
                <th className="th-cell">備考</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {customer.delivery_addresses.map(delivery => (
                <tr key={delivery.id} className="table-row is-hoverable">
                  <td className="td-cell col-fixed">
                    {delivery.address_type_label}
                  </td>
                  <td className="td-cell">{delivery.postal_code} {delivery.address}</td>
                  <td className="td-cell">{delivery.company_name}</td>
                  <td className="td-cell">{delivery.contact_name}</td>
                  <td className="td-cell">{delivery.tel}</td>
                  <td className="td-cell u-ellipsis u-max-w-320">{delivery.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section-title">
          営業履歴
        </div>
        <div className="table-wrapper is-scrollable">
          <table className="table">
            <thead className="table-header is-sticky">
              <tr className="table-row">
                <th className="th-cell u-w-136">連絡日</th>
                <th className="th-cell u-min-w-120">営業担当</th>
                <th className="th-cell u-min-w-120">連絡先</th>
                <th className="th-cell">提案内容</th>
                <th className="th-cell">反応</th>
                <th className="th-cell">備考</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {customer.contacts.map(contact => (
                contact.sales_activities.map(activity => (
                  <tr key={activity.id} className="table-row is-hoverable">
                    <td className="td-cell">{activity.contact_date}</td>
                    <td className="td-cell">{activity.in_charge_user.name}</td>
                    <td className="td-cell">{contact.name}</td>
                    <td className="td-cell">{activity.proposal}</td>
                    <td className="td-cell">{activity.feedback}</td>
                    <td className="td-cell">{activity.note}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section-title">
          問い合わせ
        </div>
        <div className="table-wrapper is-scrollable">
          <table className="table">
            <thead className="table-header is-sticky">
              <tr className="table-row">
                <th className="th-cell u-min-w-64 u-text-center col-fixed">No.</th>
                <th className="th-cell u-min-w-136">問い合わせ日</th>
                <th className="th-cell u-min-w-160">対応者</th>
                <th className="th-cell u-min-w-120">ステータス</th>
                <th className="th-cell u-min-w-240">顧客情報</th>
                <th className="th-cell u-min-w-240" colSpan={2}>商品情報</th>
                <th className="th-cell u-min-w-120">区分</th>
                <th className="th-cell">件名</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {customer.contacts.map(contact => (
                contact.inquiries.map(inquiry => (
                  <tr key={inquiry.id} className="table-row is-hoverable">
                    <td className="td-cell u-text-center col-fixed">{inquiry.id}</td>
                    <td className="td-cell">{inquiry.inquiry_date}</td>
                    <td className="td-cell">{inquiry.in_charge_user.name}</td>
                    <td className="td-cell">
                      <span className={`inquiry-status status-${inquiry.status}`}>
                        {inquiry.status_label}
                      </span>
                    </td>
                    <td className="td-cell">{contact.name}</td>
                    <td className="td-cell">{inquiry.product?.name}</td>
                    <td className="td-cell">{inquiry.product?.category.name}</td>
                    <td className="td-cell">
                      <span className={`custom-label ${inquiry.inquiry_type.custom_label}`}>
                        {inquiry.inquiry_type.name}
                      </span>
                    </td>
                    <td className="td-cell u-ellipsis u-max-w-200">{inquiry.subject}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section-title">
          受注
        </div>
        <div className="table-wrapper is-scrollable">
          <table className="table has-inner-table">
            <thead className="table-header is-sticky">
              <tr className="table-row">
                <th className="th-cell col-fixed u-w-64">No.</th>
                <th className="th-cell u-w-136 u-min-w-136">納期</th>
                <th className="th-cell u-w-200 u-min-w-200">商品カテゴリ</th>
                <th className="th-cell u-w-104 u-min-w-104"> 受注担当</th>
                <th className="th-cell contains-table u-w-400">
                  <div className="inner-thead">
                    <div className="inner-tr">
                      <div className="inner-th u-w-200">商品</div>
                      <div className="inner-th u-w-104 u-text-right">販売数量</div>
                      <div className="inner-th u-w-112 u-text-right">販売単価</div>
                      <div className="inner-th u-w-120 u-text-right">販売価格</div>
                    </div>
                  </div>
                </th>
                <th className="th-cell u-w-120 u-text-right">受注金額</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {customer.sales_orders.map(salesOrder => (
                <tr key={salesOrder.id} url={route('sales-orders.show', salesOrder)} className="table-row emphasized-row">
                  <td className="td-cell col-fixed">{salesOrder.id}</td>
                  <td className="td-cell">{salesOrder.delivery_date}</td>
                  <td className="td-cell">{salesOrder.product_category.name}</td>
                  <td className="td-cell">{salesOrder.sales_in_charge.name}</td>
                  <td className="td-cell contains-table">
                    <div className="inner-tbody">
                      {salesOrder.sales_order_details.map(detail => (
                        <div key={detail.id} className="inner-tr">
                          <div className="inner-td u-w-200">{detail.product_name}</div>
                          <div className="inner-td u-w-104 u-text-right">{parseNumber(detail.quantity)}</div>
                          <div className="inner-td u-w-112 u-text-right">
                            {formatCurrency(detail.unit_price)} <br />
                            <span className="u-text-sm">
                              {detail.is_tax_inclusive === 1 ? '[内税]' : ''}
                            </span>
                          </div>
                          <div className="inner-td u-w-120 u-text-right">{formatCurrency(detail.price)}</div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="td-cell u-text-right">
                    {formatCurrency(salesOrder.total)} <br />
                    <span className="u-text-sm">
                      ({formatCurrency(salesOrder.total_with_tax)})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
}

Show.layout = page => <AppLayout title="取引先 詳細" children={page} />

export default Show
