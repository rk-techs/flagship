import CustomSelect from '@/Components/Form/CustomSelect';
import DateInput from '@/Components/Form/DateInput';
import FormLabel from '@/Components/Form/FormLabel';
import Input from '@/Components/Form/Input';
import InvalidFeedback from '@/Components/Form/InvalidFeedback'
import Textarea from '@/Components/Form/Textarea';
import LookupButton from '@/Components/LookupButton';

export default function InquiryForm({
  data, setData, errors, submit,
  inChargeUserOptions, inquiryStatusOptions, inquiryTypeOptions,
  contactMethodOptions, productOptions,
  setIsModalOpen,
  contactInfo,
}) {
  return (
    <form id="inquiryForm" onSubmit={submit}>
      <div className="table-wrapper">
        <table className="table">
          <tbody className="tbody">
            <tr className="table-row is-flexible">
              <th className="th-cell u-w-160">
                <FormLabel htmlFor="inquiry_date" label="問い合わせ日" isRequired />
              </th>
              <td className="td-cell">
                <DateInput
                  id="inquiry_date"
                  value={data.inquiry_date}
                  onChange={e => setData('inquiry_date', e.target.value)}
                  error={errors.inquiry_date}
                />
                <InvalidFeedback errors={errors} name="inquiry_date" />
              </td>
            </tr>

            <tr className="table-row is-flexible">
              <th className="th-cell">
                <FormLabel label="対応者" isRequired />
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
                <FormLabel label="ステータス" />
              </th>
              <td className="td-cell">
                <CustomSelect
                  onChange={value => setData('status', value)}
                  options={inquiryStatusOptions}
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
                <FormLabel label="問い合わせ区分" isRequired />
              </th>
              <td className="td-cell">
                <CustomSelect
                  onChange={value => setData('inquiry_type_id', value)}
                  options={inquiryTypeOptions}
                  value={data.inquiry_type_id}
                  valueKey="id"
                  labelKey="name"
                  isClearable={true}
                  isSearchable={true}
                  placeholder="..."
                  error={errors.inquiry_type_id}
                  width="360px"
                />
                <InvalidFeedback errors={errors} name="inquiry_type_id" />
              </td>
            </tr>


            <tr className="table-row is-flexible">
              <th className="th-cell">
                <FormLabel label="問い合わせ由来" />
              </th>
              <td className="td-cell">
                <CustomSelect
                  onChange={value => setData('contact_method', value)}
                  options={contactMethodOptions}
                  value={data.contact_method}
                  valueKey="value"
                  labelKey="label"
                  isClearable={true}
                  isSearchable={true}
                  placeholder="..."
                  error={errors.contact_method}
                  width="360px"
                />
                <InvalidFeedback errors={errors} name="contact_method" />
              </td>
            </tr>

            <tr className="table-row is-flexible">
              <th className="th-cell">
                <FormLabel htmlFor="project_scale" label="案件規模" />
              </th>
              <td className="td-cell">
                <Input
                  id="project_scale"
                  type="number"
                  value={data.project_scale}
                  onChange={e => setData('project_scale', e.target.value)}
                  error={errors.project_scale}
                  placeholder="1 ~ 10,000までの数値を入力"
                  className="u-w-360"
                />
                <InvalidFeedback errors={errors} name="project_scale" />
              </td>
            </tr>

            <tr className="table-row is-flexible">
              <th className="th-cell">
                <FormLabel label="対象商品" />
              </th>
              <td className="td-cell">
                <CustomSelect
                  onChange={value => setData('product_id', value)}
                  options={productOptions}
                  value={data.product_id}
                  valueKey="id"
                  labelKey="name"
                  isClearable={true}
                  isSearchable={true}
                  placeholder="..."
                  error={errors.product_id}
                />
                <InvalidFeedback errors={errors} name="product_id" />
              </td>
            </tr>

            <tr className="table-row is-flexible">
              <th className="th-cell">
                <FormLabel htmlFor="product_detail" label="商品詳細" />
              </th>
              <td className="td-cell">
                <Input
                  id="product_detail"
                  type="text"
                  value={data.product_detail}
                  onChange={e => setData('product_detail', e.target.value)}
                  error={errors.product_detail}
                />
                <InvalidFeedback errors={errors} name="product_detail" />
              </td>
            </tr>


            <tr className="table-row is-flexible">
              <th className="th-cell">
                <FormLabel htmlFor="subject" label="件名" />
              </th>
              <td className="td-cell">
                <Input
                  id="subject"
                  type="text"
                  value={data.subject}
                  onChange={e => setData('subject', e.target.value)}
                  error={errors.subject}
                />
                <InvalidFeedback errors={errors} name="subject" />
              </td>
            </tr>

            <tr className="table-row is-flexible">
              <th className="th-cell">
                <FormLabel htmlFor="message" label="問い合わせ内容" isRequired />
              </th>
              <td className="td-cell">
                <Textarea
                  id="message"
                  value={data.message}
                  onChange={e => setData('message', e.target.value)}
                  error={errors.message}
                  height="large"
                />
                <InvalidFeedback errors={errors} name="message" />
              </td>
            </tr>

            <tr className="table-row is-flexible">
              <th className="th-cell">
                <FormLabel htmlFor="answer" label="回答内容" />
              </th>
              <td className="td-cell">
                <Textarea
                  id="answer"
                  value={data.answer}
                  onChange={e => setData('answer', e.target.value)}
                  error={errors.answer}
                  height="large"
                />
                <InvalidFeedback errors={errors} name="answer" />
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
                  height="large"
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
