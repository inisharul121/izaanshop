<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    public function contact() { return view('pages.contact'); }
    public function shippingPolicy() { return view('pages.shipping-policy'); }
    public function returnPolicy() { return view('pages.return-policy'); }
    public function faq() { return view('pages.faq'); }
    public function privacyPolicy() { return view('pages.privacy-policy'); }
}
