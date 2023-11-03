<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerSearchRequest;
use App\Http\Requests\CustomerStoreRequest;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(CustomerSearchRequest $request): Response
    {
        $keyword    = $request->input('keyword', '');

        $customerQuery = Customer::query()
                        ->with(['inChargeUser', 'contacts'])
                        ->searchByKeyword($keyword);
        $customersPaginator = $customerQuery->paginate(20)->withQueryString();

        return Inertia::render('Customer/Index', [
            'customersPaginator' => $customersPaginator,
            'canAdmin'           => Gate::allows('admin'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Customer/Create', [
            'userSelectOptions' => User::all(),
        ]);
    }

    public function store(CustomerStoreRequest $request): RedirectResponse
    {
        Customer::create([
            'name'              => $request->input('name'),
            'name_kana'         => $request->input('name_kana'),
            'shortcut'          => $request->input('shortcut'),
            'postal_code'       => $request->input('postal_code'),
            'address'           => $request->input('address'),
            'tel_number'        => $request->input('tel_number'),
            'fax_number'        => $request->input('fax_number'),
            'note'              => $request->input('note'),
            'in_charge_user_id' => $request->input('in_charge_user_id'),
            'created_by_id'     => auth()->user()->id,
        ]);

        return to_route('customers.index');
    }
}
