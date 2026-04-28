<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Banner;

class BannerController extends Controller
{
    /**
     * Get active banners (public).
     */
    public function index()
    {
        $banners = Banner::where('isActive', true)
            ->orderBy('order', 'asc')
            ->get();
        return response()->json($banners);
    }

    /**
     * Get all banners (admin).
     */
    public function adminIndex()
    {
        $banners = Banner::orderBy('order', 'asc')->get();
        return response()->json($banners);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|string',
            'link' => 'nullable|string|max:255',
            'isActive' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        $banner = Banner::create($validated);

        return response()->json($banner, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $banner = Banner::findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'sometimes|required|string',
            'link' => 'nullable|string|max:255',
            'isActive' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        $banner->update($validated);

        return response()->json($banner);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();

        return response()->json(['message' => 'Banner removed']);
    }
}
