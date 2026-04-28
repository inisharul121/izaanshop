<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->double('totalPrice');
            $table->string('paymentMethod');
            $table->double('itemsPrice');
            $table->double('taxPrice')->default(0);
            $table->double('shippingPrice')->default(0);
            $table->boolean('isPaid')->default(false);
            $table->dateTime('paidAt')->nullable();
            $table->boolean('isDelivered')->default(false);
            $table->dateTime('deliveredAt')->nullable();
            $table->string('status')->default('Pending');
            $table->string('street')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('zipCode')->nullable();
            $table->string('country')->default('Bangladesh')->nullable();
            $table->string('paymentId')->nullable();
            $table->string('transactionId')->nullable();
            $table->string('paymentStatus')->nullable();
            $table->string('paymentEmail')->nullable();
            $table->foreignId('userId')->nullable()->constrained('users')->onDelete('set null');
            $table->string('guestName')->nullable();
            $table->string('guestEmail')->nullable();
            $table->string('guestPhone')->nullable();
            $table->string('phone')->nullable();
            $table->string('shippingEmail')->nullable();
            $table->string('shippingMethod')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
