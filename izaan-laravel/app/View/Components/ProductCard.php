<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class ProductCard extends Component
{
    public $product;
    public $priority;
    public $discount;
    public $mainImage;

    /**
     * Create a new component instance.
     */
    public function __construct($product, $priority = false)
    {
        $this->product = $product;
        $this->priority = $priority;

        $price = (float)$product->price;
        $salePrice = (float)$product->salePrice;

        if ($salePrice > 0 && $salePrice < $price) {
            $this->discount = round((($price - $salePrice) / $price) * 100);
        } else {
            $this->discount = null;
        }

        $images = $product->images;
        $this->mainImage = $images['main'] ?? '/placeholder.png';
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.product-card');
    }
}
