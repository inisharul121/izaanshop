<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:Category,name',
            'slug' => 'required|string|max:255|unique:Category,slug',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($validated);

        // In a real app, we might clear cache here
        // Cache::forget('shop-init');

        return response()->json($category, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:Category,name,' . $id,
            'slug' => 'sometimes|required|string|max:255|unique:Category,slug,' . $id,
            'image' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);

        $productCount = Product::where('categoryId', $id)->count();

        if ($productCount > 0) {
            return response()->json([
                'message' => "Cannot delete category. It currently has {$productCount} products assigned to it."
            ], 400);
        }

        $category->delete();

        return response()->json(['message' => 'Category removed']);
    }
}
