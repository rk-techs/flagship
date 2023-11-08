import { useForm } from "@inertiajs/react";

function TableInputRow({ labelName, inputName, data, errors, setData, isRequired = false }) {
  return (
    <tr className="table-row">
      <th className="th-cell u-w-200">
        <label htmlFor={inputName} className="form-label">
          {labelName}
          {isRequired && <span className="required-mark">必須</span>}
        </label>
      </th>
      <td className="td-cell">
        <input
          type="text"
          id={inputName}
          name={inputName}
          value={data[inputName]}
          className={`input-field ${errors[inputName] ? 'is-invalid' : ''}`}
          onChange={e => setData(inputName, e.target.value)}
        />
        {errors[inputName] && (<div className="invalid-feedback">{errors[inputName]}</div>)}
      </td>
    </tr>
  );
}

function RadioComponent({ labelName, inputName, options, isRequired, data, errors, setData }) {
  return (
    <tr className="table-row">
      <th className="th-cell u-w-200">
        <label className="form-label">
          {labelName}
          {isRequired && <span className="required-mark">必須</span>}
        </label>
      </th>
      <td className="td-cell u-flex">
        {options.map((option, index) => (
          <div key={index} className="radio-option u-mr-2">
            <input
              type="radio"
              id={`${inputName}-${option.value}`}
              name={inputName}
              value={option.value}
              checked={data[inputName] == option.value}
              onChange={e => setData(inputName, e.target.value)}
              className={errors[inputName] ? 'is-invalid' : ''}
            />
            <label htmlFor={`${inputName}-${option.value}`}>{option.label}</label>
          </div>
        ))}
        {errors[inputName] && (<div className="invalid-feedback">{errors[inputName]}</div>)}
      </td>
    </tr>
  );
}



export default function AddressForm({ customer, closeModal }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    address_type: 1,
    post_code: '',
    address: '',
    company_name: '',
    contact_name: '',
    tel: '',
    note: '',
  });

  function submit(e) {
    e.preventDefault();
    post(route('customers.logistics-addresses.add', customer), {
      onSuccess: () => {
        reset();
        closeModal();
      }
    });
  };

  return (
    <>
      <form id="logisticsAddressCreateForm" onSubmit={submit}>
        <div className="table-wrapper is-scrollable">
          <table className="table">
            <tbody className="tbody">
            <RadioComponent
                labelName="区分"
                inputName="address_type"
                options={[
                  { label: '出荷元', value: 1 },
                  { label: '納品先', value: 2 },
                  { label: '出荷/納品兼用', value: 3 },
                ]}
                isRequired={true}
                data={data}
                errors={errors}
                setData={setData}
              />
              <TableInputRow labelName="郵便番号" inputName="post_code" data={data} errors={errors} setData={setData} />
              <TableInputRow labelName="住所" inputName="address" data={data} errors={errors} setData={setData} isRequired={true} />
              <TableInputRow labelName="会社名" inputName="company_name" data={data} errors={errors} setData={setData} />
              <TableInputRow labelName="担当者名" inputName="contact_name" data={data} errors={errors} setData={setData} />
              <TableInputRow labelName="TEL" inputName="tel" data={data} errors={errors} setData={setData} />
              <TableInputRow labelName="備考" inputName="note" data={data} errors={errors} setData={setData} />

            </tbody>
          </table>
        </div>
      </form>
      <button
        type="submit"
        form="logisticsAddressCreateForm"
        className="btn btn-primary u-mt-3"
        disabled={processing}
      >
        登録する
      </button>
    </>
  );
}

