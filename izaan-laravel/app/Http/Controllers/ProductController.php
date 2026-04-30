<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductAttribute;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $pageSize = $request->input('pageSize', 12);
        
        $query = Product::with(['category', 'attributes', 'variants'])
            ->where('isDeleted', false);

        if ($request->has('keyword')) {
            $query->where('name', 'like', '%' . $request->keyword . '%');
        }

        if ($request->filled('minPrice')) {
            $query->whereRaw('(CASE WHEN salePrice > 0 THEN salePrice ELSE price END) >= ?', [$request->minPrice]);
        }

        if ($request->filled('maxPrice')) {
            $query->whereRaw('(CASE WHEN salePrice > 0 THEN salePrice ELSE price END) <= ?', [$request->maxPrice]);
        }

        if ($request->has('category')) {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $query->where('categoryId', $category->id);
            }
        }

        // Sorting
        $sort = $request->input('sort', 'popular');
        switch ($sort) {
            case 'price-low':
                $query->orderBy('price', 'asc');
                break;
            case 'price-high':
                $query->orderBy('price', 'desc');
                break;
            default:
                $query->orderBy('createdAt', 'desc');
                break;
        }

        $allProcessedQuery = clone $query;
        $maxPrice = $allProcessedQuery->max('price') ?: 5000;
        $storeMaxPrice = Product::where('isDeleted', false)->max('price') ?: 5000;

        $products = $query->paginate($pageSize);

        return response()->json([
            'products' => $products->items(),
            'page' => $products->currentPage(),
            'pages' => $products->lastPage(),
            'maxPrice' => (float)$maxPrice,
            'storeMaxPrice' => (float)$storeMaxPrice
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'categoryId' => 'required|exists:Category,id',
            'stock' => 'required|integer',
            'slug' => 'nullable|string|unique:Product,slug',
            'salePrice' => 'nullable|numeric',
            'type' => 'required|in:SIMPLE,VARIABLE',
            'mainImage' => 'nullable|string',
            'gallery' => 'nullable|array',
            'attributes' => 'nullable|array',
            'variants' => 'nullable|array',
        ]);

        $images = [
            'main' => $validated['mainImage'] ?? '/placeholder.png',
            'gallery' => $validated['gallery'] ?? []
        ];

        $slug = $validated['slug'] ?? Str::slug($validated['name']);

        return DB::transaction(function () use ($validated, $images, $slug) {
            $product = Product::create([
                'name' => $validated['name'],
                'slug' => $slug,
                'description' => $validated['description'] ?? '',
                'price' => $validated['price'],
                'salePrice' => $validated['salePrice'],
                'stock' => $validated['stock'],
                'categoryId' => $validated['categoryId'],
                'type' => $validated['type'],
                'images' => $images,
            ]);

            if ($validated['type'] === 'VARIABLE' && !empty($validated['attributes'])) {
                foreach ($validated['attributes'] as $attr) {
                    ProductAttribute::create([
                        'name' => $attr['name'],
                        'options' => $attr['options'],
                        'productId' => $product->id,
                    ]);
                }
            }

            if ($validated['type'] === 'VARIABLE' && !empty($validated['variants'])) {
                foreach ($validated['variants'] as $variant) {
                    ProductVariant::create([
                        'sku' => $variant['sku'] ?? null,
                        'price' => (float)($variant['price'] ?? 0),
                        'salePrice' => isset($variant['salePrice']) && $variant['salePrice'] !== '' ? (float)$variant['salePrice'] : null,
                        'stock' => (int)($variant['stock'] ?? 0),
                        'options' => $variant['options'],
                        'image' => $variant['image'] ?? '',
                        'isDefault' => $variant['isDefault'] ?? false,
                        'productId' => $product->id,
                    ]);
                }
            }

            return response()->json($product->load(['category', 'attributes', 'variants']), 201);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $query = Product::with(['category', 'attributes', 'variants'])
            ->where('isDeleted', false);

        if (is_numeric($id)) {
            $product = $query->find($id);
        } else {
            $product = $query->where('slug', $id)->first();
        }

        if (!$product) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Product not found'], 404);
            }
            abort(404);
        }

        $relatedProducts = Product::with(['category', 'attributes', 'variants'])
            ->where('categoryId', $product->categoryId)
            ->where('id', '!=', $product->id)
            ->where('isDeleted', false)
            ->limit(4)
            ->get();

        if ($request->wantsJson()) {
            return response()->json([
                ...$product->toArray(),
                'relatedProducts' => $relatedProducts
            ]);
        }

        return view('product', [
            'product' => $product,
            'relatedProducts' => $relatedProducts
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'description' => 'sometimes|string',
            'categoryId' => 'sometimes|required|exists:Category,id',
            'stock' => 'sometimes|required|integer',
            'slug' => 'sometimes|string|unique:Product,slug,' . $id,
            'salePrice' => 'nullable|numeric',
            'type' => 'nullable|in:SIMPLE,VARIABLE',
            'mainImage' => 'nullable|string',
            'gallery' => 'nullable|array',
            'attributes' => 'nullable|array',
            'variants' => 'nullable|array',
        ]);

        return DB::transaction(function () use ($validated, $product) {
            $images = $product->images ?? ['main' => '', 'gallery' => []];
            if (isset($validated['mainImage'])) $images['main'] = $validated['mainImage'];
            if (isset($validated['gallery'])) $images['gallery'] = $validated['gallery'];

            $product->update([
                'name' => $validated['name'] ?? $product->name,
                'slug' => $validated['slug'] ?? $product->slug,
                'description' => $validated['description'] ?? $product->description,
                'price' => $validated['price'] ?? $product->price,
                'salePrice' => $validated['salePrice'] ?? $product->salePrice,
                'stock' => $validated['stock'] ?? $product->stock,
                'categoryId' => $validated['categoryId'] ?? $product->categoryId,
                'type' => $validated['type'] ?? $product->type,
                'images' => $images,
            ]);

            if (isset($validated['type']) && ($validated['type'] === 'VARIABLE' || $product->type === 'VARIABLE')) {
                $product->attributes()->delete();
                $product->variants()->delete();

                if ($validated['type'] === 'VARIABLE' && !empty($validated['attributes'])) {
                    foreach ($validated['attributes'] as $attr) {
                        ProductAttribute::create([
                            'name' => $attr['name'],
                            'options' => $attr['options'],
                            'productId' => $product->id,
                        ]);
                    }
                }

                if ($validated['type'] === 'VARIABLE' && !empty($validated['variants'])) {
                    foreach ($validated['variants'] as $variant) {
                        ProductVariant::create([
                            'sku' => $variant['sku'] ?? null,
                            'price' => (float)($variant['price'] ?? 0),
                            'salePrice' => isset($variant['salePrice']) && $variant['salePrice'] !== '' ? (float)$variant['salePrice'] : null,
                            'stock' => (int)($variant['stock'] ?? 0),
                            'options' => $variant['options'],
                            'image' => $variant['image'] ?? '',
                            'isDefault' => $variant['isDefault'] ?? false,
                            'productId' => $product->id,
                        ]);
                    }
                }
            }

            return response()->json($product->load(['category', 'attributes', 'variants']));
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->update(['isDeleted' => true]);
        return response()->json(['message' => 'Product removed']);
    }
}
