<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Coupon;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $coupons = Coupon::orderBy('createdAt', 'desc')->get();
        return response()->json($coupons);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:Coupon,code',
            'discountType' => 'required|string',
            'discountValue' => 'required|numeric',
            'expiryDate' => 'nullable|date',
            'isActive' => 'nullable|boolean',
            'maxUses' => 'nullable|integer',
        ]);

        $coupon = Coupon::create($validated);

        return response()->json($coupon, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $coupon = Coupon::findOrFail($id);
        return response()->json($coupon);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $coupon = Coupon::findOrFail($id);

        $validated = $request->validate([
            'code' => 'sometimes|required|string|max:255|unique:Coupon,code,' . $id,
            'discountType' => 'sometimes|required|string',
            'discountValue' => 'sometimes|required|numeric',
            'expiryDate' => 'nullable|date',
            'isActive' => 'nullable|boolean',
            'maxUses' => 'nullable|integer',
        ]);

        $coupon->update($validated);

        return response()->json($coupon);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();

        return response()->json(['message' => 'Coupon removed']);
    }

    /**
     * Validate a coupon code.
     */
    public function validateCoupon(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        
        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon) {
            return response()->json(['message' => 'Invalid coupon code'], 404);
        }

        if (!$coupon->isActive) {
            return response()->json(['message' => 'Coupon is inactive'], 400);
        }

        if ($coupon->expiryDate && now()->greaterThan($coupon->expiryDate)) {
            return response()->json(['message' => 'Coupon has expired'], 400);
        }

        if ($coupon->maxUses && $coupon->usedCount >= $coupon->maxUses) {
            return response()->json(['message' => 'Coupon limit reached'], 400);
        }

        return response()->json([
            'code' => $coupon->code,
            'discountType' => $coupon->discountType,
            'discountValue' => $coupon->discountValue
        ]);
    }
}
