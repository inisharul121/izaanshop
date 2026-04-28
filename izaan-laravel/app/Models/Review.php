<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $table = 'Review';

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null;

    protected $fillable = ['name', 'rating', 'comment', 'productId', 'userId'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
