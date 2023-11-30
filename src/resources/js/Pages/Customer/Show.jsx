import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Modal from '@/Components/Modal';
import ContactForm from './Partials/ContactForm';
import AddressForm from './Partials/AddressForm';

const Show = ({ customer, userOptions, deliveryAddressTypes }) => {
  const { flash } = usePage().props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const {
    name,
    name_kana,
    shortcut,
    postal_code,
    address,
    tel,
    fax,
    note,
    created_at,
    updated_at,
    in_charge_user,
    contacts,
    created_by,
    updated_by,
    delivery_addresses,
    purchase_term,
    sales_term,
  } = customer;

  return (
    <>
      <h1 className="content-title">取引先 詳細</h1>
      <div className="content-navbar">
        <Link
          href={route('customers.edit', customer)}
          className="btn btn-secondary u-mr-3"
        >
          編集する
        </Link>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-secondary u-mr-3">
          +連絡先を追加
        </button>
        <button
          onClick={() => setIsAddressModalOpen(true)}
          className="btn btn-secondary">
          +配送情報を追加
        </button>
      </div>

      {isModalOpen &&
        <Modal closeModal={() => setIsModalOpen(false)} title="連絡先登録">
          <ContactForm customer={customer} userOptions={userOptions} closeModal={() => setIsModalOpen(false)} />
        </Modal>}

      {isAddressModalOpen &&
        <Modal closeModal={() => setIsAddressModalOpen(false)} title="配送情報 登録">
          <AddressForm customer={customer} deliveryAddressTypes={deliveryAddressTypes} closeModal={() => setIsAddressModalOpen(false)} />
        </Modal>}

      <div className="content-section">

        <div className="u-flex">
          <div className="u-mr-4">基本情報</div>
          <span className="u-mr-3">登録: {created_at} {created_by.name}</span>
          {updated_by && (<span>更新: {updated_at} {updated_by.name}</span>)}
        </div>

        {flash.message && (
          <div className="alert alert-success">{flash.message}</div>
        )}

        <div className="table-wrapper">
          <table className="table">
            <tbody className="tbody">

              <tr className="table-row">
                <th className="th-cell u-w-200">取引先名</th>
                <td className="td-cell">{name}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">よみがな</th>
                <td className="td-cell">{name_kana}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">ショートカット名</th>
                <td className="td-cell">{shortcut}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">住所</th>
                <td className="td-cell">{postal_code} {address}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">TEL</th>
                <td className="td-cell">{tel}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">FAX</th>
                <td className="td-cell">{fax}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">備考</th>
                <td className="td-cell">{note}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">担当ユーザー</th>
                <td className="td-cell">{in_charge_user?.name}</td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">支払条件</th>
                <td className="td-cell">
                  {purchase_term?.billing_type === 1 ? (
                    <>
                      <span className="u-mr-3">{purchase_term?.cutoff_day_label}</span>
                      <span>{purchase_term?.payment_month_offset_label}{purchase_term?.payment_day_label}払い</span>
                    </>
                  ) : (
                    <>
                      <span>{purchase_term?.payment_day_offset_label}</span>
                    </>
                  )}
                </td>
              </tr>

              <tr className="table-row">
                <th className="th-cell">請求条件</th>
                <td className="td-cell">
                  {sales_term?.billing_type === 1 ? (
                    <>
                      <span className="u-mr-3">{sales_term?.cutoff_day_label}</span>
                      <span>{sales_term?.payment_month_offset_label}{sales_term?.payment_day_label}払い</span>
                    </>
                  ) : (
                    <>
                      <span>{sales_term?.payment_day_offset_label}</span>
                    </>
                  )}
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section">
        <div>連絡先一覧</div>
        <div className="table-wrapper is-scrollable">
          <table className="table">
            <thead className="table-header is-sticky">
              <tr className="table-row">
                <th className="th-cell col-fixed">ID</th>
                <th className="th-cell">役割</th>
                <th className="th-cell">名前</th>
                <th className="th-cell">よみがな</th>
                <th className="th-cell">TEL</th>
                <th className="th-cell">携帯</th>
                <th className="th-cell">E-mail</th>
                <th className="th-cell">役職</th>
                <th className="th-cell">使用状況</th>
                <th className="th-cell">備考</th>
                <th className="th-cell">担当ユーザー</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {contacts.map(contact => (
                <tr key={contact.id} className="table-row is-hoverable">
                  <td className="td-cell col-fixed">{contact.id}</td>
                  <td className="td-cell">{contact.role}</td>
                  <td className="td-cell">{contact.name}</td>
                  <td className="td-cell">{contact.name_kana}</td>
                  <td className="td-cell">{contact.tel}</td>
                  <td className="td-cell">{contact.mobile_number}</td>
                  <td className="td-cell">{contact.email}</td>
                  <td className="td-cell">{contact.position}</td>
                  <td className="td-cell">{contact.is_active_label}</td>
                  <td className="td-cell">{contact.note}</td>
                  <td className="td-cell">{contact.in_charge_user?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section">
        <div>配送情報 一覧</div>
        <div className="table-wrapper is-scrollable">
          <table className="table">
            <thead className="table-header is-sticky">
              <tr className="table-row">
                <th className="th-cell col-fixed">ID</th>
                <th className="th-cell">区分</th>
                <th className="th-cell">住所</th>
                <th className="th-cell">会社名</th>
                <th className="th-cell">担当者名</th>
                <th className="th-cell">TEL</th>
                <th className="th-cell">備考</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {delivery_addresses.map(delivery => (
                <tr key={delivery.id} className="table-row is-hoverable">
                  <td className="td-cell col-fixed">{delivery.id}</td>
                  <td className="td-cell">
                    {delivery.address_type_label}
                  </td>
                  <td className="td-cell">{delivery.postal_code} {delivery.address}</td>
                  <td className="td-cell">{delivery.company_name}</td>
                  <td className="td-cell">{delivery.contact_name}</td>
                  <td className="td-cell">{delivery.tel}</td>
                  <td className="td-cell">{delivery.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
}

Show.layout = page => <AppLayout children={page} />

export default Show
