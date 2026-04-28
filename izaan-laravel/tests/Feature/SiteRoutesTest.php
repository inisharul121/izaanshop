<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Product;
use App\Models\Category;

class SiteRoutesTest extends TestCase
{
    /**
     * Test all major public routes for a 200 OK status.
     */
    public function test_major_routes_are_accessible()
    {
        $routes = [
            '/',
            '/about',
            '/contact',
            '/faq',
            '/shipping-policy',
            '/return-policy',
            '/privacy-policy',
            '/cart',
        ];

        foreach ($routes as $route) {
            $response = $this->get($route);
            $response->assertStatus(200, "Failed to access route: $route");
        }
    }

    /**
     * Test product details page responsiveness (accessibility).
     */
    public function test_product_details_page_is_accessible()
    {
        // Get any product from the database
        $product = Product::first();
        
        if ($product) {
            $response = $this->get("/product/{$product->slug}");
            $response->assertStatus(200);
            $response->assertSee($product->name);
        } else {
            $this->markTestSkipped('No products found in database to test details page.');
        }
    }
}
