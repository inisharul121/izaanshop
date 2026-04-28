<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CacheService;
use Illuminate\Http\Request;

use App\Models\Banner;

class BannerController extends Controller
{
    /**
     * Display a listing of banners.
     */
    public function index()
    {
        $banners = Banner::orderBy('order', 'asc')->get();
        return view('admin.banners.index', compact('banners'));
    }

    /**
     * Store a newly created banner.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|string',
            'link' => 'nullable|string',
            'isActive' => 'boolean',
            'order' => 'integer',
        ]);

        Banner::create($validated);

        // ⚡ Invalidate banner caches
        CacheService::invalidateBanners();

        return redirect()->route('admin.banners.index')->with('success', 'Banner created successfully');
    }

    /**
     * Update the specified banner.
     */
    public function update(Request $request, string $id)
    {
        $banner = Banner::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|string',
            'link' => 'nullable|string',
            'isActive' => 'nullable|boolean',
            'order' => 'integer',
        ]);

        $validated['isActive'] = $request->has('isActive');

        $banner->update($validated);

        // ⚡ Invalidate banner caches
        CacheService::invalidateBanners();

        return redirect()->route('admin.banners.index')->with('success', 'Banner updated successfully');
    }

    /**
     * Remove the specified banner.
     */
    public function destroy(string $id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();
        
        // ⚡ Invalidate banner caches
        CacheService::invalidateBanners();
        
        return redirect()->route('admin.banners.index')->with('success', 'Banner deleted successfully');
    }
}
