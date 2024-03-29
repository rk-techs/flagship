import { useForm, usePage } from '@inertiajs/react';

import CustomSelect from '@/Components/Form/CustomSelect';
import InvalidFeedback from '@/Components/Form/InvalidFeedback'


export default function ProductCreateForm({ categoryOptions }) {
  const { productTypeOptions } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    category_id: '',
    product_number: '',
    product_type: '',
    name: '',
    description: '',
    sales_price: '',
    purchase_price: '',
    display_order: '',
  });

  function submit(e) {
    e.preventDefault();
    post(route('products.store'), {
      onSuccess: () => {
        reset();
      }
    });
  }

  return (
    <form onSubmit={submit}>
      <div className="form-inner u-mt-4">
        <div className="input-group">
          <label id="category_id" className="form-label">
            カテゴリ
            <span className="required-mark">*</span>
          </label>
          <select
            name="category_id"
            id="category_id"
            value={data.category_id}
            onChange={e => setData('category_id', e.target.value)}
            className={`input-field ${errors.category_id ? 'is-invalid' : ''}`}
          >
            <option value="">-- カテゴリを選択 --</option>
            {categoryOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <InvalidFeedback errors={errors} name="category_id" />
        </div>

        <div className="input-group">
          <label id="product_type" className="form-label">
            区分
            <span className="required-mark">*</span>
          </label>
          <CustomSelect
            onChange={value => setData('product_type', value)}
            options={productTypeOptions}
            value={data.product_type}
            valueKey="value"
            labelKey="label"
            isClearable={true}
            isSearchable={true}
            placeholder="..."
            error={errors.product_type}
          />
          <InvalidFeedback errors={errors} name="product_type" />
        </div>

        <div className="input-group">
          <label htmlFor="name" className="form-label">
            商品名
            <span className="required-mark">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={data.name}
            className={`input-field ${errors.name ? 'is-invalid' : ''}`}
            onChange={e => setData('name', e.target.value)}
          />
          <InvalidFeedback errors={errors} name="name" />
        </div>

        <div className="input-group">
          <label htmlFor="product_number" className="form-label">
            商品番号
          </label>
          <input
            type="text"
            id="product_number"
            name="product_number"
            value={data.product_number}
            className={`input-field ${errors.product_number ? 'is-invalid' : ''}`}
            onChange={e => setData('product_number', e.target.value)}
          />
          <InvalidFeedback errors={errors} name="product_number" />
        </div>

        <div className="input-group">
          <label htmlFor="sales_price" className="form-label">
            販売単価
          </label>
          <input
            type="text"
            id="sales_price"
            name="sales_price"
            value={data.sales_price}
            className={`input-field ${errors.sales_price ? 'is-invalid' : ''}`}
            onChange={e => setData('sales_price', e.target.value)}
          />
          <InvalidFeedback errors={errors} name="sales_price" />
        </div>

        <div className="input-group">
          <label htmlFor="purchase_price" className="form-label">
            仕入単価
          </label>
          <input
            type="text"
            id="purchase_price"
            name="purchase_price"
            value={data.purchase_price}
            className={`input-field ${errors.purchase_price ? 'is-invalid' : ''}`}
            onChange={e => setData('purchase_price', e.target.value)}
          />
          <InvalidFeedback errors={errors} name="purchase_price" />
        </div>

        <div className="input-group">
          <label htmlFor="description" className="form-label">
            説明
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={data.description}
            className={`input-field ${errors.description ? 'is-invalid' : ''}`}
            onChange={e => setData('description', e.target.value)}
          />
          <InvalidFeedback errors={errors} name="description" />
        </div>

        <div className="input-group">
          <label htmlFor="display_order" className="form-label">
            表示順
          </label>
          <input
            type="number"
            id="display_order"
            name="display_order"
            value={data.display_order}
            className={`input-field ${errors.display_order ? 'is-invalid' : ''}`}
            onChange={e => setData('display_order', e.target.value)}
            placeholder="数値を入力"
          />
          <InvalidFeedback errors={errors} name="display_order" />
        </div>

        <button
          type="submit"
          className="btn btn-primary u-mt-3 u-mr-3"
          disabled={processing}
        >
          商品を追加
        </button>
      </div>
    </form>
  );
}
