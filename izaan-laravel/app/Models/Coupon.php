<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $table = 'Coupon';

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'code', 'discountType', 'discountValue', 'expiryDate', 'isActive', 'maxUses', 'usedCount'
    ];
}
