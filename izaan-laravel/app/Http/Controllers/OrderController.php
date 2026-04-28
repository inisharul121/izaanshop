<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Create a new order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'orderItems' => 'required|array|min:1',
            'shippingAddress' => 'required|array',
            'shippingAddress.street' => 'required|string',
            'paymentMethod' => 'nullable|string',
            'itemsPrice' => 'required|numeric',
            'taxPrice' => 'nullable|numeric',
            'shippingPrice' => 'nullable|numeric',
            'totalPrice' => 'required|numeric',
            'guestName' => 'nullable|string',
            'guestEmail' => 'nullable|email',
            'guestPhone' => 'nullable|string',
            'shippingMethod' => 'nullable|string',
            'shippingEmail' => 'nullable|email',
            'transactionId' => 'nullable|string',
        ]);

        if (!Auth::check() && empty($validated['guestName'])) {
            return response()->json(['message' => 'Name is required for guest orders'], 400);
        }

        return DB::transaction(function () use ($validated, $request) {
            $user = Auth::user();
            $address = $validated['shippingAddress'];

            $order = Order::create([
                'userId' => $user ? $user->id : null,
                'guestName' => $user ? null : $validated['guestName'],
                'guestEmail' => $user ? null : ($validated['guestEmail'] ?? null),
                'guestPhone' => $user ? null : ($validated['guestPhone'] ?? $address['phone'] ?? null),
                'phone' => $user ? ($address['phone'] ?? null) : ($validated['guestPhone'] ?? $address['phone'] ?? null),
                'totalPrice' => $validated['totalPrice'],
                'paymentMethod' => $validated['paymentMethod'] ?? 'Cash on Delivery',
                'transactionId' => $validated['transactionId'] ?? null,
                'itemsPrice' => $validated['itemsPrice'],
                'taxPrice' => $validated['taxPrice'] ?? 0,
                'shippingPrice' => $validated['shippingPrice'] ?? 0,
                'shippingMethod' => $validated['shippingMethod'] ?? null,
                'shippingEmail' => $validated['shippingEmail'] ?? null,
                'street' => $address['street'],
                'city' => $address['city'] ?? null,
                'state' => $address['state'] ?? null,
                'zipCode' => $address['zipCode'] ?? null,
                'country' => $address['country'] ?? 'Bangladesh',
            ]);

            foreach ($validated['orderItems'] as $item) {
                OrderItem::create([
                    'name' => $item['name'] ?? 'Unknown Product',
                    'quantity' => $item['quantity'] ?? 1,
                    'image' => $item['image'] ?? ($item['images']['main'] ?? ''),
                    'price' => $item['salePrice'] ?? $item['price'] ?? 0,
                    'productId' => $item['id'] ?? $item['productId'],
                    'variantId' => $item['selectedVariant']['id'] ?? null,
                    'orderId' => $order->id,
                ]);
            }

            return response()->json($order->load('orderItems'), 201);
        });
    }

    /**
     * Get order by ID.
     */
    public function show(string $id)
    {
        $order = Order::with(['orderItems', 'user'])->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Update order to paid.
     */
    public function updateToPaid(Request $request, string $id)
    {
        $order = Order::findOrFail($id);
        $order->update([
            'isPaid' => true,
            'paidAt' => now(),
            'paymentId' => $request->id,
            'paymentStatus' => $request->status,
            'paymentEmail' => $request->email_address,
        ]);

        return response()->json($order->load('orderItems'));
    }

    /**
     * Update order to delivered.
     */
    public function updateToDelivered(string $id)
    {
        $order = Order::findOrFail($id);
        $order->update([
            'isDelivered' => true,
            'deliveredAt' => now(),
            'status' => 'Delivered',
        ]);

        return response()->json($order->load('orderItems'));
    }

    /**
     * Get logged-in user's orders.
     */
    public function myOrders()
    {
        $orders = Order::with('orderItems')
            ->where('userId', Auth::id())
            ->orderBy('createdAt', 'desc')
            ->get();
        return response()->json($orders);
    }

    /**
     * Get all orders (Admin).
     */
    public function allOrders()
    {
        $orders = Order::with(['orderItems', 'user:id,name'])
            ->orderBy('createdAt', 'desc')
            ->get();
        return response()->json($orders);
    }

    /**
     * Analytics for dashboard.
     */
    public function analytics()
    {
        // Simple KPIs for now
        $totalOrders = Order::count();
        $totalRevenue = Order::sum('totalPrice');
        $totalCustomers = User::where('role', 'user')->count();
        $totalProducts = Product::count();

        return response()->json([
            'kpis' => [
                'totalOrders' => $totalOrders,
                'totalRevenue' => (float)$totalRevenue,
                'totalCustomers' => $totalCustomers,
                'totalProducts' => $totalProducts,
                'pendingOrders' => Order::where('status', 'Pending')->count(),
                'processingOrders' => Order::where('status', 'Processing')->count(),
                'shippedOrders' => Order::where('status', 'Shipped')->count(),
                'deliveredOrders' => Order::where('status', 'Delivered')->count(),
            ],
            // Add trends if needed
        ]);
    }
}
