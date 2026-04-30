<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingMethod;
use App\Models\Settings;
use App\Models\Coupon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function index()
    {
        $cart = session('cart', []);
        if (count($cart) === 0) {
            return redirect()->route('cart.index');
        }

        $shippingMethods = ShippingMethod::where('isActive', true)->get();
        $settings = Settings::all()->pluck('value', 'key');
        
        $subtotal = array_reduce($cart, function($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);

        return view('checkout', [
            'cart' => $cart,
            'subtotal' => $subtotal,
            'shippingMethods' => $shippingMethods,
            'settings' => $settings,
            'user' => Auth::user()
        ]);
    }

    /**
     * Process the order.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string',
            'email' => 'nullable|email',
            'paymentMethod' => 'required|string',
            'shippingMethodId' => 'required|exists:ShippingMethod,id',
            'transaction_id' => 'nullable|string',
            'coupon_code' => 'nullable|string',
        ]);

        $cart = session('cart', []);
        if (count($cart) === 0) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        $shippingMethod = ShippingMethod::find($request->shippingMethodId);
        
        $subtotal = array_reduce($cart, function($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);

        $discount = 0;
        $coupon = null;
        if ($request->coupon_code) {
            $coupon = Coupon::where('code', $request->coupon_code)->first();
            if ($coupon && $coupon->isActive && 
                (!$coupon->expiryDate || now()->lessThan($coupon->expiryDate)) &&
                (!$coupon->maxUses || $coupon->usedCount < $coupon->maxUses)) {
                
                if ($coupon->discountType === 'percentage') {
                    $discount = ($subtotal * $coupon->discountValue) / 100;
                } else {
                    $discount = $coupon->discountValue;
                }
            } else {
                // If coupon is invalid or expired or reached limit, we null it out
                $coupon = null;
            }
        }

        $totalPrice = $subtotal - $discount + $shippingMethod->price;

        return DB::transaction(function () use ($request, $cart, $subtotal, $shippingMethod, $totalPrice, $discount) {
            $order = Order::create([
                'userId' => Auth::id(),
                'totalPrice' => $totalPrice,
                'itemsPrice' => $subtotal,
                'taxPrice' => 0,
                'shippingPrice' => $shippingMethod->price,
                'discountAmount' => $discount,
                'couponCode' => $request->coupon_code,
                'paymentMethod' => $request->paymentMethod,
                'isPaid' => false,
                'isDelivered' => false,
                'status' => 'Pending',
                'street' => $request->address,
                'city' => 'N/A',
                'zipCode' => 'N/A',
                'country' => 'Bangladesh',
                'phone' => $request->phone,
                'guestName' => $request->name,
                'guestPhone' => $request->phone,
                'shippingEmail' => $request->email,
                'shippingMethod' => $shippingMethod->name,
                'transactionId' => $request->transaction_id,
            ]);

            foreach ($cart as $item) {
                OrderItem::create([
                    'orderId' => $order->id,
                    'productId' => $item['product_id'],
                    'variantId' => $item['variant_id'],
                    'name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'image' => $item['image'],
                    'price' => $item['price'],
                ]);
            }

            // Increment Coupon usage
            if ($request->coupon_code) {
                $couponToUpdate = Coupon::where('code', $request->coupon_code)->first();
                if ($couponToUpdate) {
                    $couponToUpdate->increment('usedCount');
                }
            }

            // Clear Cart
            session()->forget('cart');
            session()->forget('cart_count');

            return redirect()->route('order.success', ['id' => $order->id]);
        });
    }

    /**
     * Handle direct checkout (Buy Now).
     */
    public function direct(Request $request)
    {
        $product = Product::findOrFail($request->product_id);
        $quantity = $request->input('quantity', 1);
        $variantId = $request->input('variant_id');

        $price = (float)$product->salePrice ?: (float)$product->price;
        $name = $product->name;
        $image = $product->images['main'] ?? '/placeholder.png';

        if ($variantId) {
            $variant = \App\Models\ProductVariant::findOrFail($variantId);
            $price = (float)$variant->salePrice ?: (float)$variant->price;
            $name = $product->name . ' (' . implode(', ', $variant->options) . ')';
            if ($variant->image) $image = $variant->image;
        }

        $id = $variantId ? "v{$variantId}" : "p{$product->id}";

        // Add to existing cart (preserve existing items)
        $cart = session()->get('cart', []);
        
        // Ensure $cart is an array
        if (!is_array($cart)) {
            $cart = [];
        }

        if (isset($cart[$id])) {
            $cart[$id]['quantity'] += $quantity;
        } else {
            $cart[$id] = [
                'id' => $id,
                'product_id' => $product->id,
                'variant_id' => $variantId,
                'name' => $name,
                'price' => $price,
                'quantity' => $quantity,
                'image' => $image,
            ];
        }

        session()->put('cart', $cart);
        session()->put('cart_count', array_sum(array_column($cart, 'quantity')));
        session()->save(); // Explicitly save session before redirect

        return redirect()->route('checkout.index');
    }

    /**
     * Show success page.
     */
    public function success($id)
    {
        $order = Order::findOrFail($id);
        return view('order-success', ['order' => $order]);
    }
}
