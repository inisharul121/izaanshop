<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CartController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CouponController;

Route::get('/', [ShopController::class, 'index'])->name('home');
Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');
Route::get('/about', function () {
    return view('about');
})->name('about');

// Static Pages
use App\Http\Controllers\PageController;
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/shipping-policy', [PageController::class, 'shippingPolicy'])->name('shipping-policy');
Route::get('/return-policy', [PageController::class, 'returnPolicy'])->name('return-policy');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/privacy-policy', [PageController::class, 'privacyPolicy'])->name('privacy-policy');

// cPanel Performance Optimization Route (Run once after upload)
Route::get('/optimize-site', function () {
    \Illuminate\Support\Facades\Artisan::call('config:cache');
    \Illuminate\Support\Facades\Artisan::call('route:cache');
    \Illuminate\Support\Facades\Artisan::call('view:cache');
    return "🚀 Site Optimized Successfully! Caches are now warm.";
});

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::post('/coupon/validate', [CouponController::class, 'validateCoupon'])->name('coupon.validate');

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::post('/checkout/direct', [CheckoutController::class, 'direct'])->name('checkout.direct');
Route::get('/order-success/{id}', [CheckoutController::class, 'success'])->name('order.success');
use App\Http\Controllers\AdminController;

use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ApprovalController as AdminApprovalController;
use App\Http\Controllers\Admin\ShippingController as AdminShippingController;

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    });
    Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::resource('products', AdminProductController::class)->names('admin.products');
    Route::get('/orders/{id}/invoice', [AdminOrderController::class, 'invoice'])->name('admin.orders.invoice');
    Route::resource('orders', AdminOrderController::class)->only(['index', 'show', 'update', 'destroy'])->names('admin.orders');
    Route::resource('categories', AdminCategoryController::class)->only(['index', 'store', 'update', 'destroy'])->names('admin.categories');
    Route::resource('banners', AdminBannerController::class)->only(['index', 'store', 'update', 'destroy'])->names('admin.banners');
    Route::resource('coupons', AdminCouponController::class)->only(['index', 'store', 'update', 'destroy'])->names('admin.coupons');
    
    // New Resource Routes
    Route::resource('users', AdminUserController::class)->only(['index', 'show', 'destroy'])->names('admin.users');
    Route::get('/approvals', [AdminApprovalController::class, 'index'])->name('admin.approvals.index');
    Route::post('/approvals/{id}/approve', [AdminApprovalController::class, 'approve'])->name('admin.approvals.approve');
    Route::resource('shipping', AdminShippingController::class)->names('admin.shipping');

    // Media Library Routes
    Route::get('/media/page', [AdminMediaController::class, 'page'])->name('admin.media.page');
    Route::get('/media', [AdminMediaController::class, 'index'])->name('admin.media.index');
    Route::post('/media/upload', [AdminMediaController::class, 'store'])->name('admin.media.upload');
    Route::delete('/media/{filename}', [AdminMediaController::class, 'destroy'])->name('admin.media.destroy');

    // Reports Routes
    Route::prefix('reports')->name('admin.reports.')->group(function () {
        Route::get('/finance', [\App\Http\Controllers\Admin\ReportController::class, 'finance'])->name('finance');
        Route::get('/stock', [\App\Http\Controllers\Admin\ReportController::class, 'stock'])->name('stock');
        Route::get('/payments', [\App\Http\Controllers\Admin\ReportController::class, 'payments'])->name('payments');
    });
});

Route::get('/dashboard', function () {
    if (auth()->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
