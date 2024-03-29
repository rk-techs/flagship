import CustomSelect from '@/Components/Form/CustomSelect';
import DateInput from '@/Components/Form/DateInput';
import FormLabel from '@/Components/Form/FormLabel';
import Input from '@/Components/Form/Input';
import InvalidFeedback from '@/Components/Form/InvalidFeedback'
import Textarea from '@/Components/Form/Textarea';
import LookupButton from '@/Components/LookupButton';

export default function SalesActivityForm({ setIsModalOpen, data, setData, errors, submit, inChargeUserOptions, contactInfo, salesActivityStatusOptions}) {

  return (
    <form id="salesActivityForm" onSubmit={submit}>
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
                />
                <InvalidFeedback errors={errors} name="contact_date" />
              </td>
            </tr>

            <tr className="table-row is-flexible">
              <th className="th-cell">
                <FormLabel label="ステータス" />
              </th>
              <td className="td-cell">
                <CustomSelect
                  onChange={value => setData('status', value)}
                  options={salesActivityStatusOptions}
                  value={data.status}
                  valueKey="value"
                  labelKey="label"
                  isClearable={false}
                  isSearchable={true}
                  placeholder="..."
                  error={errors.status}
                  width="360px"
                />
                <InvalidFeedback errors={errors} name="status" />
              </td>
            </tr>

            <tr className="table-row is-flexible">
              <th className="th-cell">
                <FormLabel label="営業担当" isRequired />
              </th>
              <td className="td-cell">
                <CustomSelect
                  onChange={value => setData('in_charge_user_id', value)}
                  options={inChargeUserOptions}
                  value={data.in_charge_user_id}
                  valueKey="id"
                  labelKey="name"
                  searchKey="name_kana"
                  isClearable={true}
                  isSearchable={true}
                  placeholder="..."
                  error={errors.in_charge_user_id}
                  width="360px"
                />
                <InvalidFeedback errors={errors} name="in_charge_user_id" />
              </td>
            </tr>

            <tr className="table-row is-flexible">
              <th className="th-cell">
                <FormLabel label="顧客情報" isRequired />
              </th>
              <td className="td-cell">
                <div className="u-flex">
                  <Input
                    type="text"
                    value={data.customer_contact_id}
                    className="u-max-w-64 u-mr-1"
                    placeholder="No"
                    readOnly={true}
                  />
                  <Input
                    type="text"
                    value={contactInfo.contactName}
                    className="u-max-w-240 u-mr-1"
                    placeholder="顧客名"
                    readOnly={true}
                  />
                  <LookupButton onClick={() => setIsModalOpen(true)} />
                </div>
                <div className="u-mt-2">
                  <Input
                    type="text"
                    value={contactInfo.customerName}
                    className="u-max-w-360"
                    placeholder="取引先名"
                    readOnly={true}
                  />
                </div>
                <div className="u-mt-2">
                  <Input
                    type="text"
                    value={contactInfo.contactEmail}
                    className="u-max-w-360"
                    placeholder="E-mail"
                    readOnly={true}
                  />
                </div>
                <div className="u-flex u-mt-2">
                  <Input
                    type="text"
                    value={contactInfo.contactTel}
                    className="u-max-w-176 u-mr-2"
                    placeholder="TEL"
                    readOnly={true}
                  />
                  <Input
                    type="text"
                    value={contactInfo.contactMobile}
                    className="u-max-w-176"
                    placeholder="携帯"
                    readOnly={true}
                  />
                </div>
                <InvalidFeedback errors={errors} name="customer_contact_id" />
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
                <FormLabel htmlFor="feedback" label="フィードバック" />
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
                  height="medium"
                />
                <InvalidFeedback errors={errors} name="note" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  );
}
