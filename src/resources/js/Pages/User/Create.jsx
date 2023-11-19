import { useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import CancelButton from '../../Components/CancelButton';
import TableInputRow from '../../Components/TableInputRow';

const Create = ({ permissionSelectOptions }) => {
  const { data, setData, post, processing, errors, reset, isDirty } = useForm({
    permission_id: '',
    employee_code: '',
    name: '',
    name_kana: '',
    email: '',
    password: '',
    password_confirmation: '',
    mobile_number: '',
    employment_date: '',
  });

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
  }, []);

  function submit(e) {
    e.preventDefault();
    post(route('users.store'));
  };

  return (
    <>
      <h1 className="content-title">ユーザー 登録</h1>
      <div className="content-navbar">
        <button
          type="submit"
          form="userCreateForm"
          className="btn btn-primary u-mr-3"
          disabled={processing}
        >
          登録する
        </button>
        <CancelButton isDirty={isDirty} route={route('users.index')} />
        {processing && <span>Now Loading...</span>}
      </div>
      <form id="userCreateForm" onSubmit={submit}>
        <div className="table-wrapper is-scrollable">
          <table className="table">
            <tbody className="tbody">
              <TableInputRow labelName="社員番号" inputName="employee_code" data={data} errors={errors} setData={setData} isRequired={true} widthClass="u-w-200" />

              <tr className="table-row is-flexible">
                <th className="th-cell">
                  <label htmlFor="permission_id" className="form-label">
                    権限
                    <span className="required-mark">必須</span>
                  </label>
                </th>
                <td className="td-cell u-flex">
                  <select
                    name="permission_id"
                    id="permission_id"
                    value={data.permission_id}
                    onChange={e => setData('permission_id', e.target.value)}
                    className={`input-field ${errors.permission_id ? 'is-invalid' : ''}`}
                  >
                    <option value="">-- 権限を選択 --</option>
                    {permissionSelectOptions.map((permission) => (
                      <option key={permission.id} value={permission.id}>
                        {permission.display_name}
                      </option>
                    ))}
                  </select>
                  {errors.permission_id && (<div className="invalid-feedback">{errors.permission_id}</div>)}
                </td>
              </tr>

              <TableInputRow labelName="名前" inputName="name" data={data} errors={errors} setData={setData} isRequired={true} />

              <TableInputRow labelName="読み仮名" inputName="name_kana" data={data} errors={errors} setData={setData} />

              <TableInputRow type="email" labelName="E-mail" inputName="email" data={data} errors={errors} setData={setData} isRequired={true} />

              <TableInputRow type="password" labelName="Password" inputName="password" data={data} errors={errors} setData={setData} isRequired={true} />

              <TableInputRow type="password" labelName="Password確認" inputName="password_confirmation" data={data} errors={errors} setData={setData} isRequired={true} />

              <TableInputRow labelName="携帯番号" inputName="mobile_number" data={data} errors={errors} setData={setData} />

              <TableInputRow type="date" labelName="入社日" inputName="employment_date" data={data} errors={errors} setData={setData} />
            </tbody>
          </table>
        </div>
      </form>
    </>
  );
}

Create.layout = page => <AppLayout children={page} />

export default Create
