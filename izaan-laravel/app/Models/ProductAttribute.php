<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductAttribute extends Model
{
    use HasFactory;

    protected $table = 'ProductAttribute';
    public $timestamps = false;

    protected $fillable = ['name', 'options', 'productId'];

    protected $casts = [
        'options' => 'json',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId');
    }
}
