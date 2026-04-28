<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'Product';

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'name', 'slug', 'description', 'price', 'salePrice', 'stock', 
        'isFeatured', 'images', 'rating', 'numReviews', 'type', 'categoryId', 'isDeleted'
    ];

    protected $casts = [
        'images' => 'json',
        'isFeatured' => 'boolean',
        'isDeleted' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryId');
    }

    public function attributes()
    {
        return $this->hasMany(ProductAttribute::class, 'productId');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'productId');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'productId');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'productId');
    }
}
