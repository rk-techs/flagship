import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import CategoryCreateForm from './Partials/CategoryCreateForm';
import CategoryGroupCreateForm from './Partials/CategoryGroupCreateForm';
import ProductCreateForm from './Partials/ProductCreateForm';

const Create = ({ groupSelectOptions, categorySelectOptions }) => {
  const { flash } = usePage().props;

  return (
    <>
      <h1 className="content-title">商品登録</h1>
      <div className="content-navbar">
        <Link
          href={route('products.index')}
          className="btn btn-secondary"
        >
          キャンセル
        </Link>
      </div>
      {flash.message && (
        <div className="alert alert-success">{flash.message}</div>
      )}

      <CategoryGroupCreateForm />
      <CategoryCreateForm groupSelectOptions={groupSelectOptions} />
      <ProductCreateForm groupSelectOptions={groupSelectOptions} categorySelectOptions={categorySelectOptions} />
    </>
  );
}

Create.layout = page => <AppLayout children={page} />

export default Create
