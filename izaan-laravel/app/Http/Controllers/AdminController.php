<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        // KPI Data
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'Delivered')->sum('totalPrice');
        $totalCustomers = User::where('role', 'user')->count();
        $totalProducts = Product::count();

        $kpis = [
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
            'totalCustomers' => $totalCustomers,
            'totalProducts' => $totalProducts,
        ];

        $recentOrders = Order::with('user')->orderBy('createdAt', 'desc')->limit(10)->get();

        return view('admin.dashboard', [
            'kpis' => $kpis,
            'recentOrders' => $recentOrders,
        ]);
    }
}
