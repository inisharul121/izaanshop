<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin User
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => \Illuminate\Support\Facades\Hash::make('admin123456'),
                'role' => 'admin',
                'isApproved' => true,
            ]
        );

        // 2. Categories
        $categories = [
            ['name' => 'Books', 'slug' => 'books', 'description' => 'Educational and story books'],
            ['name' => 'Educational Toys', 'slug' => 'educational-toys', 'description' => 'Learning toys for kids'],
            ['name' => 'Stationery', 'slug' => 'stationery', 'description' => 'School and office supplies'],
        ];

        foreach ($categories as $cat) {
            \App\Models\Category::create($cat);
        }

        // 3. Products
        $products = [
            [
                'name' => 'Kids Math Adventure',
                'slug' => 'kids-math-adventure',
                'description' => 'A fun way to learn math with puzzles and games.',
                'price' => 450,
                'salePrice' => 350,
                'stock' => 50,
                'images' => json_encode(['main' => 'https://placehold.co/600x400/FF6B35/white?text=Math+Adventure', 'gallery' => []]),
                'categoryId' => 1,
            ],
            [
                'name' => 'Story of the World',
                'slug' => 'story-of-the-world',
                'description' => 'History for young readers.',
                'price' => 600,
                'salePrice' => 520,
                'stock' => 20,
                'images' => json_encode(['main' => 'https://placehold.co/600x400/FF6B35/white?text=History+Book', 'gallery' => []]),
                'categoryId' => 1,
            ],
            [
                'name' => 'Smart Building Blocks',
                'slug' => 'smart-building-blocks',
                'description' => 'STEM building blocks for creative minds.',
                'price' => 1200,
                'salePrice' => 950,
                'stock' => 15,
                'images' => json_encode(['main' => 'https://placehold.co/600x400/FF6B35/white?text=Building+Blocks', 'gallery' => []]),
                'categoryId' => 2,
            ],
        ];

        foreach ($products as $prod) {
            \App\Models\Product::create($prod);
        }

        // 4. Banners
        \App\Models\Banner::create([
            'title' => 'New Arrival',
            'subtitle' => 'Educational Toys for Kids',
            'image' => 'https://placehold.co/1920x600/FF6B35/white?text=New+Arrivals',
            'link' => '/shop',
            'isActive' => true,
            'order' => 1,
        ]);
    }
}
