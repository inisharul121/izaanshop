<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function finance()
    {
        $orders = Order::where('status', '!=', 'Cancelled')->get();
        
        $totalRevenue = $orders->sum('totalPrice');
        $totalOrders = $orders->count();
        $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
        
        // Group by month
        $monthlyRevenue = $orders->groupBy(function($order) {
            return Carbon::parse($order->createdAt)->format('Y-m');
        })->map(function($row) {
            return $row->sum('totalPrice');
        });

        // Group by day for the last 30 days
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        $dailyRevenue = Order::where('status', '!=', 'Cancelled')
            ->where('createdAt', '>=', $thirtyDaysAgo)
            ->get()
            ->groupBy(function($order) {
                return Carbon::parse($order->createdAt)->format('Y-m-d');
            })->map(function($row) {
                return $row->sum('totalPrice');
            });

        return view('admin.reports.finance', compact('totalRevenue', 'totalOrders', 'avgOrderValue', 'monthlyRevenue', 'dailyRevenue'));
    }

    public function stock()
    {
        $products = Product::where('isDeleted', false)->get();
        
        $totalProducts = $products->count();
        $totalInventoryValue = $products->sum(function ($product) {
            return $product->price * $product->stock;
        });

        $lowStockProducts = $products->filter(function ($product) {
            return $product->stock !== null && $product->stock < 5 && $product->stock > 0;
        });

        $outOfStockProducts = $products->filter(function ($product) {
            return $product->stock !== null && $product->stock <= 0;
        });

        return view('admin.reports.stock', compact('totalProducts', 'totalInventoryValue', 'lowStockProducts', 'outOfStockProducts'));
    }

    public function payments()
    {
        $orders = Order::where('status', '!=', 'Cancelled')->get();
        
        $paymentMethods = $orders->groupBy('paymentMethod')->map(function ($rows) {
            return [
                'count' => $rows->count(),
                'revenue' => $rows->sum('totalPrice')
            ];
        });

        $totalRevenue = $orders->sum('totalPrice');
        $totalOrders = $orders->count();

        return view('admin.reports.payments', compact('paymentMethods', 'totalRevenue', 'totalOrders'));
    }
}
