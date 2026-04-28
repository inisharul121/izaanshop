<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $table = 'OrderItem';
    public $timestamps = false;

    protected $fillable = [
        'name', 'quantity', 'image', 'price', 'variantId', 'orderId', 'productId'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId');
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variantId');
    }
}
