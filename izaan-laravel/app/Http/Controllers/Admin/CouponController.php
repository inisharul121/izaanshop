<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Display a listing of coupons.
     */
    public function index()
    {
        $coupons = Coupon::orderBy('createdAt', 'desc')->get();
        return view('admin.coupons.index', compact('coupons'));
    }

    /**
     * Store a newly created coupon.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:Coupon,code',
            'discountType' => 'required|in:percentage,fixed',
            'discountValue' => 'required|numeric|min:0',
            'expiryDate' => 'nullable|date',
            'maxUses' => 'nullable|integer|min:1',
        ]);

        Coupon::create([
            'code' => strtoupper($request->code),
            'discountType' => $request->discountType,
            'discountValue' => $request->discountValue,
            'expiryDate' => $request->expiryDate,
            'maxUses' => $request->maxUses,
            'isActive' => $request->has('isActive') ? $request->isActive : true,
        ]);

        return redirect()->route('admin.coupons.index')->with('success', 'Coupon created successfully.');
    }

    /**
     * Update the specified coupon.
     */
    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);

        $request->validate([
            'code' => 'required|string|unique:Coupon,code,' . $id,
            'discountType' => 'required|in:percentage,fixed',
            'discountValue' => 'required|numeric|min:0',
            'expiryDate' => 'nullable|date',
            'maxUses' => 'nullable|integer|min:1',
        ]);

        $coupon->update([
            'code' => strtoupper($request->code),
            'discountType' => $request->discountType,
            'discountValue' => $request->discountValue,
            'expiryDate' => $request->expiryDate,
            'maxUses' => $request->maxUses,
            'isActive' => $request->has('isActive') ? (bool) $request->isActive : $coupon->isActive,
        ]);

        return redirect()->route('admin.coupons.index')->with('success', 'Coupon updated successfully.');
    }

    /**
     * Remove the specified coupon.
     */
    public function destroy($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();

        return redirect()->route('admin.coupons.index')->with('success', 'Coupon deleted successfully.');
    }
}
