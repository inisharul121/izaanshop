<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $table = 'Order';

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'totalPrice', 'paymentMethod', 'itemsPrice', 'taxPrice', 'shippingPrice', 
        'isPaid', 'paidAt', 'isDelivered', 'deliveredAt', 'status', 
        'street', 'city', 'state', 'zipCode', 'country', 
        'paymentId', 'transactionId', 'paymentStatus', 'paymentEmail', 
        'userId', 'guestName', 'guestEmail', 'guestPhone', 'phone', 
        'shippingEmail', 'shippingMethod', 'discountAmount', 'couponCode'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'orderId');
    }
}
