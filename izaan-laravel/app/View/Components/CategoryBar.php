<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class CategoryBar extends Component
{
    public $categories;

    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        $this->categories = \App\Models\Category::all();
    }

    /**
     * Get the icon name for a category.
     */
    public function getIcon($name)
    {
        $upperName = strtoupper($name);
        if (str_contains($upperName, 'AGE')) return 'baby';
        if (str_contains($upperName, 'CLOTH')) return 'shirt';
        if (str_contains($upperName, 'FOOT') || str_contains($upperName, 'SHOE')) return 'footprints';
        if (str_contains($upperName, 'TOY')) return 'gamepad-2';
        if (str_contains($upperName, 'CARE') && str_contains($upperName, 'BABY')) return 'shopping-bag';
        if (str_contains($upperName, 'MOM')) return 'heart-pulse';
        if (str_contains($upperName, 'FOOD')) return 'utensils';
        if (str_contains($upperName, 'ART') || str_contains($upperName, 'CRAFT')) return 'palette';
        if (str_contains($upperName, 'LIFE')) return 'home';
        return 'sparkles';
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.category-bar');
    }
}
