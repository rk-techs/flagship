import { useForm } from '@inertiajs/react';

export default function InquiryTypeCreateForm() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    custom_label: '',
  });

  const customLabelOptions = [
    'red', 'blue', 'green', 'orange', 'gray',
  ];

  function submit(e) {
    e.preventDefault();
    post(route('inquiry-types.store'), {
      onSuccess: () => reset(),
    });
  };

  return (
    <form onSubmit={submit}>
      <div className="form-inner u-mb-4">
        <div className="input-group">
          <label htmlFor="name" className="form-label">
            区分名
            <span className="required-mark">必須</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={data.name}
            className={`input-field ${errors.name ? 'is-invalid' : ''}`}
            onChange={e => setData('name', e.target.value)}
          />
          <div className="invalid-feedback">{errors.name}</div>
        </div>

        <div className="input-group">
          <span className="form-label">
            カスタムラベル
          </span>
          <div className="custom-radio-group">
            {customLabelOptions.map((option, index) => (
              <label key={index} className={`custom-radio-label custom-label ${option}`}>
                <input
                  type="radio"
                  name="custom_label"
                  value={option}
                  checked={data.custom_label === option}
                  onChange={e => setData('custom_label', e.target.value)}
                  className="custom-radio-input-field"
                />
                {option}
              </label>
            ))}
          </div>
          <div className="invalid-feedback">{errors.custom_label}</div>
        </div>

        <button
          type="submit"
          className="btn btn-primary u-mt-3 u-mr-3"
          disabled={processing}
        >
          区分を追加
        </button>
      </div>
    </form>
  );
}
