<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index()
    {
        $orders = Order::with('user')->orderBy('createdAt', 'desc')->paginate(15);
        return view('admin.orders.index', compact('orders'));
    }

    /**
     * Display the specified order.
     */
    public function show(string $id)
    {
        $order = Order::with(['user', 'orderItems.product', 'orderItems.variant'])->findOrFail($id);
        return view('admin.orders.show', compact('order'));
    }

    /**
     * Update the order status.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Processing,Shipped,Delivered,Cancelled',
            'isPaid' => 'nullable|boolean',
            'isDelivered' => 'nullable|boolean',
        ]);

        if (isset($validated['status'])) {
            $order->status = $validated['status'];
            if ($validated['status'] === 'Delivered') {
                $order->isDelivered = true;
                $order->deliveredAt = now();
            }
        }

        if ($request->has('isPaid')) {
            $order->isPaid = $request->isPaid;
            if ($request->isPaid) {
                $order->paidAt = now();
            }
        }

        $order->save();

        return redirect()->back()->with('success', 'Order updated successfully');
    }

    /**
     * Display the order invoice for printing.
     */
    public function invoice(string $id)
    {
        $order = Order::with(['user', 'orderItems.product', 'orderItems.variant'])->findOrFail($id);
        return view('admin.orders.invoice', compact('order'));
    }

    /**
     * Remove the specified order.
     */
    public function destroy(string $id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return redirect()->route('admin.orders.index')->with('success', 'Order deleted successfully');
    }
}
