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
        Schema::table('Order', function (Blueprint $table) {
            $table->double('discountAmount')->default(0)->after('itemsPrice');
            $table->string('couponCode')->nullable()->after('discountAmount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Order', function (Blueprint $table) {
            $table->dropColumn(['discountAmount', 'couponCode']);
        });
    }
};
