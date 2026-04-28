<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class HeroSlider extends Component
{
    public $banners;

    /**
     * Create a new component instance.
     */
    public function __construct($banners = [])
    {
        $this->banners = $banners;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.hero-slider');
    }
}
