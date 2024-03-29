import { useState, useEffect } from 'react';

import { Link, useForm, usePage } from '@inertiajs/react';
import MenuItem from '@mui/material/MenuItem';

import CustomerFilter from './Partials/CustomerFilter';
import CustomerTable from './Partials/CustomerTable';

import Alert from '@/Components/Alert';
import DropdownMenu from '@/Components/DropdownMenu';
import FilterForm from '@/Components/FilterForm';
import KeywordSearchForm from '@/Components/KeywordSearchForm';
import PageSizeSelector from '@/Components/PageSizeSelector';
import Pagination from '@/Components/Pagination';
import ToggleFilterButton from '@/Components/ToggleFilterButton';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ customers, inChargeUserOptions }) => {
  const urlParams = route().params;
  const { flash } = usePage().props;

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(urlParams).length > 0) {
      setIsFilterOpen(true);
    }
  }, []);

  const { data, setData, get, errors } = useForm({
    page_size: urlParams.page_size || 100,
    keyword: urlParams.keyword || '',
    customer_id: urlParams.customer_id || '',
    address: urlParams.address || '',
    phone: urlParams.phone || '',
    in_charge_user_id: urlParams.in_charge_user_id || '',
    delivery_address: urlParams.delivery_address || '',
  });


  function submit(e) {
    e.preventDefault();
    get(route('customers.index'), {
      preserveState: true,
    });
  }

  const [prevPageSize, setPrevPageSize] = useState(data.page_size);

  if (data.page_size !== prevPageSize) {
    get(route('customers.index'), {
      preserveState: true,
    });
    setPrevPageSize(data.page_size);
  }

  function resetSearchInputs() {
    setData({
      ...data,
      page_size: 100,
      keyword: '',
      customer_id: '',
      address: '',
      phone: '',
      in_charge_user_id: '',
      delivery_address: '',
    })

    setPrevPageSize(100);
  }

  return (
    <>
      <h1 className="content-title">取引先 一覧</h1>
      <div className="content-navbar">
        <Link
          href={route('customers.create')}
          className="btn btn-primary u-mr-3"
        >
          新規登録
        </Link>

        <DropdownMenu
          buttonLabel="設定"
          buttonClassName="u-mr-3"
        >
          <Link href={route('billing-addresses.index')}>
            <MenuItem>
              請求先管理
            </MenuItem>
          </Link>
          <Link href={route('lead-sources.index')}>
            <MenuItem>
              リード獲得元管理
            </MenuItem>
          </Link>
        </DropdownMenu>

        <KeywordSearchForm
          placeholder="取引先名, ヨミガナで検索"
          data={data}
          setData={setData}
          errors={errors}
          submit={submit}
        />

        <ToggleFilterButton
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
        />

        <div className="record-count">
          {customers.total}件
        </div>

        <PageSizeSelector
          pageSize={data.page_size}
          onChange={e => setData('page_size', e.target.value)}
        />

        <Pagination paginator={customers} />
      </div>

      <FilterForm submit={submit} isFilterOpen={isFilterOpen}>
        <CustomerFilter
          submit={submit}
          data={data}
          setData={setData}
          errors={errors}
          inChargeUserOptions={inChargeUserOptions}
          resetSearchInputs={resetSearchInputs}
        />
      </FilterForm>

      <Alert type={flash.type} message={flash.message} />

      <CustomerTable customers={customers.data} />
    </>
  );
}

Index.layout = page => <AppLayout title="取引先 一覧" children={page} />

export default Index
