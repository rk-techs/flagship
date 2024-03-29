import { useForm, usePage } from '@inertiajs/react';

import CustomSelect from '@/Components/Form/CustomSelect';
import DateInput from '@/Components/Form/DateInput';
import FormLabel from '@/Components/Form/FormLabel';
import InvalidFeedback from '@/Components/Form/InvalidFeedback'
import Textarea from '@/Components/Form/Textarea';
import OptionsList from '@/Components/OptionsList';

export default function SalesActivityForm({ customer, userOptions, salesActivityStatusOptions, closeModal }) {
  const { auth, date } = usePage().props;

  const { data, setData, post, processing, errors, reset } = useForm({
    contact_date: date.today,
    status: 1,
    customer_contact_id: '',
    proposal: '',
    feedback: '',
    note: '',
    in_charge_user_id: auth.user.id,
  });

  function submit(e) {
    e.preventDefault();
    post(route('customers.contacts.sales-activities.add', customer), {
      onSuccess: () => {
        reset();
        closeModal();
      }
    });
  }

  const contactOptions = customer.contacts.map(contact => {
    return { value: contact.id, label: contact.name };
  })

  return (
    <>
      <form id="salesActivityCreateForm" onSubmit={submit}>
        <div className="table-wrapper">
          <table className="table">
            <tbody className="tbody">

              <tr className="table-row is-flexible">
                <th className="th-cell u-w-160">
                  <FormLabel htmlFor="contact_date" label="連絡日" isRequired />
                </th>
                <td className="td-cell">
                  <DateInput
                    id="contact_date"
                    value={data.contact_date}
                    onChange={e => setData('contact_date', e.target.value)}
                    error={errors.contact_date}
                    max={date.today}
                  />
                  <InvalidFeedback errors={errors} name="contact_date" />
                </td>
              </tr>

              <tr className="table-row is-flexible">
                <th className="th-cell">
                  <FormLabel htmlFor="customer_contact_id" label="連絡先" isRequired />
                </th>
                <td className="td-cell">
                  <select
                    className="form-select u-max-w-160"
                    value={data.customer_contact_id}
                    onChange={e => setData('customer_contact_id', e.target.value)}
                    error={errors.customer_contact_id}
                  >
                    <option hidden></option>
                    <OptionsList options={contactOptions} />
                  </select>
                  <InvalidFeedback errors={errors} name="customer_contact_id" />
                </td>
              </tr>

              <tr className="table-row is-flexible">
                <th className="th-cell">
                  <FormLabel label="ステータス" isRequired />
                </th>
                <td className="td-cell">
                  <CustomSelect
                    onChange={value => setData('status', value)}
                    options={salesActivityStatusOptions}
                    value={data.status}
                    valueKey="value"
                    labelKey="label"
                    isClearable={true}
                    isSearchable={true}
                    placeholder="..."
                    error={errors.status}
                  />
                  <InvalidFeedback errors={errors} name="status" />
                </td>
              </tr>

              <tr className="table-row is-flexible">
                <th className="th-cell">
                  <FormLabel htmlFor="proposal" label="提案内容" isRequired />
                </th>
                <td className="td-cell">
                  <Textarea
                    id="proposal"
                    value={data.proposal}
                    onChange={e => setData('proposal', e.target.value)}
                    error={errors.proposal}
                    height="medium"
                  />
                  <InvalidFeedback errors={errors} name="proposal" />
                </td>
              </tr>

              <tr className="table-row is-flexible">
                <th className="th-cell">
                  <FormLabel htmlFor="feedback" label="反応" />
                </th>
                <td className="td-cell">
                  <Textarea
                    id="feedback"
                    value={data.feedback}
                    onChange={e => setData('feedback', e.target.value)}
                    error={errors.feedback}
                    height="medium"
                  />
                  <InvalidFeedback errors={errors} name="feedback" />
                </td>
              </tr>

              <tr className="table-row is-flexible">
                <th className="th-cell">
                  <FormLabel htmlFor="note" label="備考" />
                </th>
                <td className="td-cell">
                  <Textarea
                    id="note"
                    value={data.note}
                    onChange={e => setData('note', e.target.value)}
                    error={errors.note}
                    height="small"
                  />
                  <InvalidFeedback errors={errors} name="note" />
                </td>
              </tr>

              <tr className="table-row is-flexible">
                <th className="th-cell">
                  <FormLabel label="対応者" isRequired />
                </th>
                <td className="td-cell">
                  <CustomSelect
                    onChange={value => setData('in_charge_user_id', value)}
                    options={userOptions}
                    value={data.in_charge_user_id}
                    valueKey="id"
                    labelKey="name"
                    searchKey="name_kana"
                    isClearable={true}
                    isSearchable={true}
                    placeholder="担当ユーザーを選択..."
                    error={errors.in_charge_user_id}
                  />
                  <InvalidFeedback errors={errors} name="in_charge_user_id" />
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </form>
      <button
        type="submit"
        form="salesActivityCreateForm"
        className="btn btn-primary u-mt-3"
        disabled={processing}
      >
        登録する
      </button>
    </>
  );
}
