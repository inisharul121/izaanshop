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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->double('price');
            $table->double('salePrice')->nullable();
            $table->integer('stock')->default(0);
            $table->boolean('isFeatured')->default(false);
            $table->longText('images')->nullable();
            $table->double('rating')->default(0);
            $table->integer('numReviews')->default(0);
            $table->enum('type', ['SIMPLE', 'VARIABLE'])->default('SIMPLE');
            $table->foreignId('categoryId')->constrained('categories')->onDelete('cascade');
            $table->boolean('isDeleted')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
