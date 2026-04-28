<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Navbar extends Component
{
    public $user;
    public $cartCount;

    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        $this->user = \Illuminate\Support\Facades\Auth::user();
        // Placeholder for cart count using session
        $this->cartCount = session('cart_count', 0);
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.navbar');
    }
}
