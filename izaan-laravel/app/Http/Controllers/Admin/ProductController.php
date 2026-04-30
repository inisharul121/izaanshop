<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductAttribute;
use App\Models\ProductVariant;
use App\Services\CacheService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request)
    {
        $query = Product::with('category')->where('isDeleted', false);

        if ($request->filled('categoryId')) {
            $query->where('categoryId', $request->categoryId);
        }

        $products = $query->orderBy('createdAt', 'desc')->paginate(10);
        return view('admin.products.index', compact('products'));
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $categories = Category::all();
        return view('admin.products.create', compact('categories'));
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:Product,slug',
            'price' => 'required|numeric',
            'salePrice' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'categoryId' => 'required|exists:Category,id',
            'type' => 'required|in:SIMPLE,VARIABLE',
            'description' => 'required|string',
            'mainImage' => 'nullable|string',
            'gallery' => 'nullable|string', // JSON string from frontend
            'attributes' => 'nullable|string', // JSON string from frontend
            'variants' => 'nullable|string', // JSON string from frontend
        ]);

        return DB::transaction(function () use ($request, $validated) {
            // Prepare images JSON
            $gallery = $request->filled('gallery') ? json_decode($request->input('gallery'), true) : [];
            $images = [
                'main' => $request->mainImage ?? '/placeholder.png',
                'gallery' => $gallery
            ];

            // Create Product
            $product = Product::create([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'salePrice' => $validated['salePrice'],
                'stock' => $validated['stock'],
                'type' => $validated['type'],
                'categoryId' => $validated['categoryId'],
                'images' => $images,
                'isDeleted' => false,
                'isFeatured' => $request->has('isFeatured'),
            ]);

            // Handle Attributes & Variants if Variable
            if ($validated['type'] === 'VARIABLE') {
                if ($request->filled('attributes')) {
                    $attributes = json_decode($request->input('attributes'), true);
                    foreach ($attributes as $attr) {
                        ProductAttribute::create([
                            'name' => $attr['name'],
                            'options' => $attr['options'],
                            'productId' => $product->id,
                        ]);
                    }
                }

                if ($request->filled('variants')) {
                    $variants = json_decode($request->input('variants'), true);
                    foreach ($variants as $variant) {
                        ProductVariant::create([
                            'sku' => $variant['sku'] ?? ($product->slug . '-' . Str::random(5)),
                            'price' => (float)($variant['price'] ?? $product->price),
                            'salePrice' => isset($variant['salePrice']) && $variant['salePrice'] !== '' ? (float)$variant['salePrice'] : null,
                            'stock' => (int)($variant['stock'] ?? 0),
                            'options' => $variant['options'],
                            'image' => $variant['image'] ?? $product->images['main'],
                            'productId' => $product->id,
                            'isDefault' => $variant['isDefault'] ?? false,
                        ]);
                    }
                }
            }

            // ⚡ Invalidate product caches
            CacheService::invalidateProducts();

            return redirect()->route('admin.products.index')->with('success', 'Product created successfully');
        });
    }

    /**
     * Show the form for editing the product.
     */
    public function edit(string $id)
    {
        $product = Product::with(['attributes', 'variants'])->findOrFail($id);
        $categories = Category::all();
        return view('admin.products.edit', compact('product', 'categories'));
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:Product,slug,' . $id,
            'price' => 'required|numeric',
            'salePrice' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'categoryId' => 'required|exists:Category,id',
            'type' => 'required|in:SIMPLE,VARIABLE',
            'description' => 'required|string',
            'mainImage' => 'nullable|string',
            'gallery' => 'nullable|string',
            'attributes' => 'nullable|string',
            'variants' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request, $validated, $product) {
            $gallery = $request->filled('gallery') ? json_decode($request->input('gallery'), true) : [];
            $images = [
                'main' => $request->mainImage ?? $product->images['main'] ?? '/placeholder.png',
                'gallery' => $gallery
            ];

            $product->update([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'salePrice' => $validated['salePrice'],
                'stock' => $validated['stock'],
                'type' => $validated['type'],
                'categoryId' => $validated['categoryId'],
                'images' => $images,
                'isFeatured' => $request->has('isFeatured'),
            ]);

            // Re-sync Attributes & Variants
            if ($validated['type'] === 'VARIABLE') {
                $product->attributes()->delete();
                if ($request->filled('attributes')) {
                    $attributes = json_decode($request->input('attributes'), true);
                    foreach ($attributes as $attr) {
                        ProductAttribute::create([
                            'name' => $attr['name'],
                            'options' => $attr['options'],
                            'productId' => $product->id,
                        ]);
                    }
                }

                $product->variants()->delete();
                if ($request->filled('variants')) {
                    $variants = json_decode($request->input('variants'), true);
                    foreach ($variants as $variant) {
                        ProductVariant::create([
                            'sku' => $variant['sku'] ?? ($product->slug . '-' . Str::random(5)),
                            'price' => (float)($variant['price'] ?? $product->price),
                            'salePrice' => isset($variant['salePrice']) && $variant['salePrice'] !== '' ? (float)$variant['salePrice'] : null,
                            'stock' => (int)($variant['stock'] ?? 0),
                            'options' => $variant['options'],
                            'image' => $variant['image'] ?? $product->images['main'],
                            'productId' => $product->id,
                            'isDefault' => $variant['isDefault'] ?? false,
                        ]);
                    }
                }
            } else {
                // If switched to SIMPLE, clear attributes and variants
                $product->attributes()->delete();
                $product->variants()->delete();
            }

            // ⚡ Invalidate product caches
            CacheService::invalidateProducts();

            return redirect()->route('admin.products.index')->with('success', 'Product updated successfully');
        });
    }

    /**
     * Remove the product (soft delete).
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->update(['isDeleted' => true]);
        
        // ⚡ Invalidate product caches
        CacheService::invalidateProducts();
        
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully');
    }
}
