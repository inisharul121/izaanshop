<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\ShopController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Shop Init
Route::get('/shop/init', [ShopController::class, 'getShopData']);

// Categories
Route::apiResource('categories', CategoryController::class);

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// Orders
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/myorders', [OrderController::class, 'myOrders'])->middleware('auth:sanctum');
Route::get('/orders/analytics', [OrderController::class, 'analytics'])->middleware('auth:sanctum');
Route::get('/orders', [OrderController::class, 'allOrders'])->middleware('auth:sanctum');
Route::get('/orders/{id}', [OrderController::class, 'show'])->middleware('auth:sanctum');
Route::put('/orders/{id}/pay', [OrderController::class, 'updateToPaid'])->middleware('auth:sanctum');
Route::put('/orders/{id}/deliver', [OrderController::class, 'updateToDelivered'])->middleware('auth:sanctum');

// Coupons
Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);
Route::apiResource('coupons', CouponController::class);

// Shipping
Route::get('/shipping', [ShippingController::class, 'index']);
Route::get('/shipping/admin', [ShippingController::class, 'adminIndex'])->middleware('auth:sanctum');
Route::post('/shipping', [ShippingController::class, 'store'])->middleware('auth:sanctum');
Route::put('/shipping/{id}', [ShippingController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/shipping/{id}', [ShippingController::class, 'destroy'])->middleware('auth:sanctum');

// Banners
Route::get('/banners', [BannerController::class, 'index']);
Route::get('/banners/all', [BannerController::class, 'adminIndex'])->middleware('auth:sanctum');
Route::post('/banners', [BannerController::class, 'store'])->middleware('auth:sanctum');
Route::put('/banners/{id}', [BannerController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/banners/{id}', [BannerController::class, 'destroy'])->middleware('auth:sanctum');

// Settings
Route::get('/settings', [SettingsController::class, 'index']);
Route::put('/settings', [SettingsController::class, 'updateSettings'])->middleware('auth:sanctum');
