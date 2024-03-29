<?php

namespace App\Http\Middleware;

use App\Enums\PaymentTerm\BillingType;
use App\Enums\PaymentTerm\CutoffDay;
use App\Enums\PaymentTerm\PaymentDay;
use App\Enums\PaymentTerm\PaymentDayOffset;
use App\Enums\PaymentTerm\PaymentMonthOffset;
use App\Models\TaxRate;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'appName'   => config('app.name'),
            'auth.user' => fn () => $request->user()
            ? $request->user()->only('id', 'name', 'email', 'is_admin')
            : null,
            'flash' => [
                'type'    => fn () => $request->session()->get('type'),
                'message' => fn () => $request->session()->get('message'),
            ],
            'date' => [
                'today' => Carbon::today()->format('Y-m-d'),
            ],
            'taxRate' => TaxRate::getCurrentTaxRate(),
            'paymentTermOptions' => [
                'billingTypes' => BillingType::toArray(),
                'cutoffDays'   => CutoffDay::toArray(),
                'monthOffsets' => PaymentMonthOffset::toArray(),
                'paymentDay'   => PaymentDay::toArray(),
                'dayOffsets'   => PaymentDayOffset::toArray(),
            ],
        ]);
    }
}
