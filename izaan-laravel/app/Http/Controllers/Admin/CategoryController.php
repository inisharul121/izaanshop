<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index()
    {
        $categories = Category::withCount('products')->orderBy('name', 'asc')->get();
        return view('admin.categories.index', compact('categories'));
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:Category,name',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $slug = Str::slug($validated['name']);
        
        // Check if slug exists
        if (Category::where('slug', $slug)->exists()) {
            return back()->withErrors(['name' => 'A category with a similar name already exists.'])->withInput();
        }

        $validated['slug'] = $slug;

        Category::create($validated);

        // ⚡ Invalidate category caches
        CacheService::invalidateCategories();

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully');
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:Category,name,'.$id,
            'image' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $slug = Str::slug($validated['name']);

        // Check if slug exists for other categories
        if (Category::where('slug', $slug)->where('id', '!=', $id)->exists()) {
            return back()->withErrors(['name' => 'A category with a similar name already exists.'])->withInput();
        }

        $validated['slug'] = $slug;

        $category->update($validated);

        // ⚡ Invalidate category caches
        CacheService::invalidateCategories();

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        
        // ⚡ Invalidate category caches
        CacheService::invalidateCategories();
        
        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully');
    }
}
