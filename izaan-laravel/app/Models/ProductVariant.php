<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $table = 'ProductVariant';

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'sku', 'price', 'salePrice', 'stock', 'options', 'image', 'productId', 'isDefault'
    ];

    protected $casts = [
        'options' => 'json',
        'isDefault' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId');
    }
}
