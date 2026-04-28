<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ShippingMethod;

class ShippingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $shippingMethods = ShippingMethod::latest()->get();
        return view('admin.shipping.index', compact('shippingMethods'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'isActive' => 'boolean',
        ]);

        ShippingMethod::create($validated);

        return redirect()->route('admin.shipping.index')->with('success', 'Shipping method created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $method = ShippingMethod::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'isActive' => 'boolean',
        ]);

        $method->update($validated);

        return redirect()->route('admin.shipping.index')->with('success', 'Shipping method updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $method = ShippingMethod::findOrFail($id);
        $method->delete();

        return redirect()->route('admin.shipping.index')->with('success', 'Shipping method deleted successfully.');
    }
}
