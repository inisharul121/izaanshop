<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;

class ShopController extends Controller
{
    /**
     * Fetch consolidated shop data.
     */
    public function getShopData(Request $request)
    {
        $pageSize = $request->input('pageSize', 12);
        $page = $request->input('pageNumber', 1);

        // 1. CACHE GLOBAL DATA
        $bannerData = \Cache::remember('shop_banners', 3600, function () {
            return Banner::where('isActive', true)->orderBy('order', 'asc')->get()->toArray();
        });

        $allCategories = \Cache::remember('shop_categories', 3600, function () {
            return Category::all()->toArray();
        });

        $storeMaxPrice = \Cache::remember('shop_store_max_price', 3600, function () {
            return Product::where('isDeleted', false)->max('price') ?: 5000;
        });

        // 2. BUILD PRODUCT QUERY
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
            $category = $allCategories->where('slug', $request->category)->first();
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

        $products = $query->paginate($pageSize, ['*'], 'pageNumber', $page);

        return response()->json([
            'banners' => $bannerData,
            'categories' => $allCategories,
            'products' => $products->items(),
            'pagination' => [
                'page' => $products->currentPage(),
                'pages' => $products->lastPage(),
                'total' => $products->total(),
            ],
            'maxPrice' => (float)$products->max('price') ?: (float)$storeMaxPrice,
            'storeMaxPrice' => (float)$storeMaxPrice,
        ]);
    }
    /**
     * Render the shop homepage (Web).
     */
    public function index(Request $request)
    {
        $pageSize = $request->input('pageSize', 12);
        $page = $request->input('pageNumber', 1);

        // 1. CACHE GLOBAL DATA (Banners, Categories, Store Max Price)
        // This avoids 3 expensive DB queries on every single page load
        $bannerData = \Cache::remember('shop_banners', 3600, function () {
            return Banner::where('isActive', true)->orderBy('order', 'asc')->get()->toArray();
        });

        $allCategories = \Cache::remember('shop_categories', 3600, function () {
            return Category::all()->toArray();
        });

        $storeMaxPrice = \Cache::remember('shop_store_max_price', 3600, function () {
            return Product::where('isDeleted', false)->max('price') ?: 5000;
        });

        // 2. BUILD PRODUCT QUERY (Dynamic based on user filters)
        $query = Product::with(['category', 'attributes', 'variants'])
            ->where('isDeleted', false);

        if ($request->has('keyword')) {
            $query->where('name', 'like', '%' . $request->keyword . '%');
        }

        if ($request->has('category')) {
            $category = collect($allCategories)->where('slug', $request->category)->first();
            if ($category) {
                $query->where('categoryId', $category['id'] ?? $category->id);
            }
        }

        if ($request->filled('minPrice')) {
            $query->whereRaw('(CASE WHEN salePrice > 0 THEN salePrice ELSE price END) >= ?', [$request->minPrice]);
        }

        if ($request->filled('maxPrice')) {
            $query->whereRaw('(CASE WHEN salePrice > 0 THEN salePrice ELSE price END) <= ?', [$request->maxPrice]);
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
        }

        $products = $query->paginate($pageSize, ['*'], 'page', $page);

        return view('shop', [
            'banners'       => $bannerData,
            'categories'    => $allCategories,
            'products'      => $products,
            'storeMaxPrice' => (float) $storeMaxPrice,
        ]);
    }
}
