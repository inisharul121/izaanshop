<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Settings;

class SettingsController extends Controller
{
    /**
     * Get all settings as a map.
     */
    public function index()
    {
        $settings = Settings::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * Update settings.
     */
    public function updateSettings(Request $request)
    {
        $settingsData = $request->all();

        foreach ($settingsData as $key => $value) {
            Settings::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
