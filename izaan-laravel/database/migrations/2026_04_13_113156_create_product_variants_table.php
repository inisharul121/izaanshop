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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique()->nullable();
            $table->double('price');
            $table->double('salePrice')->nullable();
            $table->integer('stock')->default(0);
            $table->longText('options');
            $table->longText('image')->nullable();
            $table->foreignId('productId')->constrained('products')->onDelete('cascade');
            $table->boolean('isDefault')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
