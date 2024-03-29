import { useState, useEffect } from 'react';

import { Link, useForm, usePage } from '@inertiajs/react';

import SalesActivityFilter from './Partials/SalesActivityFilter';
import SalesActivityTable from './Partials/SalesActivityTable';

import Alert from '@/Components/Alert';
import DateRangePicker from '@/Components/DateRangePicker';
import FilterForm from '@/Components/FilterForm';
import KeywordSearchForm from '@/Components/KeywordSearchForm';
import PageSizeSelector from '@/Components/PageSizeSelector';
import Pagination from '@/Components/Pagination';
import ToggleFilterButton from '@/Components/ToggleFilterButton';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ salesActivities, inChargeUserOptions, salesActivityStatusOptions }) => {
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
    start_date: urlParams.start_date || '',
    end_date: urlParams.end_date || '',
    status: urlParams.status || '',
    in_charge_user_id: urlParams.in_charge_user_id || '',
  });

  function submit(e) {
    e.preventDefault();
    get(route('sales-activities.index'), {
      preserveState: true,
    });
  }

  const [prevPageSize, setPrevPageSize] = useState(data.page_size);

  if (data.page_size !== prevPageSize) {
    get(route('sales-activities.index'), {
      preserveState: true,
    });
    setPrevPageSize(data.page_size);
  }

  function resetSearchInputs() {
    setData({
      ...data,
      page_size: 100,
      keyword: '',
      start_date: '',
      end_date: '',
      in_charge_user_id: '',
      status: '',
    })
    setPrevPageSize(100);
  }

  return (
    <>
      <h1 className="content-title">営業履歴 一覧</h1>
      <div className="content-navbar">
        <Link
          href={route('sales-activities.create')}
          className="btn btn-primary u-mr-3"
        >
          新規登録
        </Link>

        <KeywordSearchForm
          placeholder="顧客名・取引先名で検索"
          data={data}
          setData={setData}
          errors={errors}
          submit={submit}
        />

        <DateRangePicker
          dateColumnLabel="連絡日"
          data={data}
          setData={setData}
          errors={errors}
          submit={submit}
        />

        <ToggleFilterButton isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />

        <div className="record-count">
          {salesActivities.total}件
        </div>

        <PageSizeSelector
          pageSize={data.page_size}
          onChange={e => setData('page_size', e.target.value)}
        />

        <Pagination paginator={salesActivities} />
      </div>

      <FilterForm submit={submit} isFilterOpen={isFilterOpen}>
        <SalesActivityFilter
          submit={submit}
          data={data}
          setData={setData}
          errors={errors}
          inChargeUserOptions={inChargeUserOptions}
          salesActivityStatusOptions={salesActivityStatusOptions}
          resetSearchInputs={resetSearchInputs}
        />
      </FilterForm>

      <Alert type={flash.type} message={flash.message} />

      <SalesActivityTable salesActivities={salesActivities.data} />
    </>
  );
}

Index.layout = page => <AppLayout title="営業履歴 一覧" children={page} />

export default Index
