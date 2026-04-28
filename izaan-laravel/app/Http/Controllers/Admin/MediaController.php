<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Display the media library page.
     */
    public function page()
    {
        return view('admin.media.page');
    }

    /**
     * Get all uploaded images.
     */
    public function index()
    {
        $directory = public_path('uploads/products');
        
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $files = File::files($directory);
        
        $media = collect($files)
            ->filter(function ($file) {
                return in_array(strtolower($file->getExtension()), ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']);
            })
            ->map(function ($file) {
                return [
                    'name' => $file->getFilename(),
                    'url' => '/uploads/products/' . $file->getFilename(),
                ];
            })
            ->values();

        return response()->json($media);
    }

    /**
     * Upload an image to the media library.
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp,svg|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/products'), $filename);

            return response()->json([
                'name' => $filename,
                'url' => '/uploads/products/' . $filename,
            ]);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }

    /**
     * Delete an image from the media library.
     */
    public function destroy($filename)
    {
        // Security check: prevent directory traversal
        if (str_contains($filename, '..') || str_contains($filename, '/') || str_contains($filename, '\\')) {
            return response()->json(['message' => 'Invalid file name'], 400);
        }

        $path = public_path('uploads/products/' . $filename);

        if (File::exists($path)) {
            File::delete($path);
            return response()->json(['message' => 'File deleted successfully']);
        }

        return response()->json(['message' => 'File not found'], 404);
    }
}
