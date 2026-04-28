<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\ProductVariant;

class CartController extends Controller
{
    /**
     * Display the cart page.
     */
    public function index()
    {
        $cart = session('cart', []);
        $totalPrice = array_reduce($cart, function($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);

        return view('cart', [
            'cart' => $cart,
            'totalPrice' => $totalPrice
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function store(Request $request)
    {
        $product = Product::findOrFail($request->product_id);
        $quantity = $request->input('quantity', 1);
        $variantId = $request->input('variant_id');

        $price = (float)$product->salePrice ?: (float)$product->price;
        $name = $product->name;
        $image = $product->images['main'] ?? '/placeholder.png';

        if ($variantId) {
            $variant = ProductVariant::findOrFail($variantId);
            $price = (float)$variant->salePrice ?: (float)$variant->price;
            $name = $product->name . ' (' . implode(', ', $variant->options) . ')';
            if ($variant->image) $image = $variant->image;
        }

        $cart = session('cart', []);
        $id = $variantId ? "v{$variantId}" : "p{$product->id}";

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

        session(['cart' => $cart]);
        session(['cart_count' => array_sum(array_column($cart, 'quantity'))]);

        return redirect()->back()->with('success', 'Product added to cart');
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(Request $request, $id)
    {
        $cart = session('cart', []);
        if (isset($cart[$id])) {
            $cart[$id]['quantity'] = $request->quantity;
            session(['cart' => $cart]);
            session(['cart_count' => array_sum(array_column($cart, 'quantity'))]);
        }
        return redirect()->back();
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy($id)
    {
        $cart = session('cart', []);
        unset($cart[$id]);
        session(['cart' => $cart]);
        session(['cart_count' => array_sum(array_column($cart, 'quantity'))]);
        return redirect()->back();
    }
}
