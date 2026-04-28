<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ShippingMethod;

class ShippingController extends Controller
{
    /**
     * Get all active shipping methods (Public).
     */
    public function index()
    {
        $methods = ShippingMethod::where('isActive', true)
            ->orderBy('price', 'asc')
            ->get();
        return response()->json($methods);
    }

    /**
     * Get all shipping methods (Admin).
     */
    public function adminIndex()
    {
        $methods = ShippingMethod::orderBy('createdAt', 'desc')->get();
        return response()->json($methods);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'isActive' => 'nullable|boolean',
        ]);

        $method = ShippingMethod::create($validated);

        return response()->json($method, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $method = ShippingMethod::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'isActive' => 'nullable|boolean',
        ]);

        $method->update($validated);

        return response()->json($method);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $method = ShippingMethod::findOrFail($id);
        $method->delete();

        return response()->json(['message' => 'Shipping method removed']);
    }
}
