<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - Order #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { 
            font-family: 'Inter', sans-serif;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
            color: black !important;
        }
        @media print {
            @page { margin: 0; size: a4 portrait; }
            body { margin: 0; padding: 0; }
            .custom-padding { padding: 1.5cm !important; }
            .no-print { display: none !important; }
        }
        .text-dark { color: #111827 !important; }
        .bg-dark { background-color: #111827 !important; }
    </style>
</head>
<body class="custom-padding p-12">
    <!-- Header Actions -->
    <div class="no-print fixed top-6 right-6 flex gap-3">
        <button onclick="window.print()" class="px-6 py-3 bg-dark text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl shadow-dark/20 hover:scale-105 transition-all">
            Print Invoice
        </button>
        <button onclick="window.close()" class="px-6 py-3 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all">
            Close
        </button>
    </div>

    <div id="invoice-content">
        <!-- Logo & Title -->
        <div class="flex justify-between items-start mb-12">
            <div>
                <h1 class="text-3xl font-black text-dark mb-2 uppercase tracking-tighter">IZAAN SHOP</h1>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                    Toys, Book & Learning Tools<br/>
                    Dhaka, Bangladesh<br/>
                    Support: +880 1752-530303<br/>
                    Email: info@izaanshop.com
                </p>
            </div>
            <div class="text-right">
                <h2 class="text-4xl font-black text-gray-100 uppercase tracking-tighter mb-2">INVOICE</h2>
                <p class="text-sm font-black text-dark">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase">{{ $order->createdAt->format('d M Y') }}</p>
            </div>
        </div>

        <!-- Customer & Order Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 py-8 border-t border-b border-gray-100">
            <div class="space-y-4">
                <h5 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bill To:</h5>
                <div>
                    <p class="text-base font-black text-dark uppercase">{{ $order->guestName ?? ($order->user->name ?? 'N/A') }}</p>
                    <p class="text-sm text-gray-500 font-bold mt-1">{{ $order->guestPhone ?? ($order->phone ?? 'N/A') }}</p>
                    <p class="text-[11px] text-gray-400 font-medium italic mt-0.5">{{ $order->shippingEmail ?? ($order->user->email ?? '') }}</p>
                    <p class="text-sm text-gray-500 underline leading-relaxed mt-3 italic max-w-[250px]">
                        {{ $order->street }}
                    </p>
                </div>
            </div>
            <div class="space-y-4 text-right">
                <h5 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Details:</h5>
                <div class="space-y-1.5">
                    <p class="text-xs font-bold text-dark uppercase">Payment: <span class="bg-gray-100 px-2 py-0.5 rounded">{{ $order->paymentMethod }}</span></p>
                    <p class="text-xs font-bold text-dark uppercase">Shipping: {{ $order->shippingMethod ?? 'Standard' }}</p>
                    <p class="text-xs font-bold text-dark uppercase">Status: <span class="text-primary">{{ $order->status }}</span></p>
                    <p class="text-xs font-bold text-dark uppercase">Time: {{ $order->createdAt->format('h:i A') }}</p>
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <table class="w-full mb-12">
            <thead>
                <tr class="border-b-2 border-dark text-left">
                    <th class="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Description</th>
                    <th class="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Unit Price</th>
                    <th class="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Qty</th>
                    <th class="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Total</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                @foreach($order->orderItems as $item)
                <tr>
                    <td class="py-5">
                        <p class="text-sm font-black text-dark uppercase">{{ $item->product->name ?? 'Unknown Product' }}</p>
                        @if($item->variant)
                        <div class="flex gap-1 mt-1">
                            @foreach($item->variant->options as $key => $val)
                            <span class="text-[9px] font-bold bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100 uppercase">{{ $key }}: {{ $val }}</span>
                            @endforeach
                        </div>
                        @endif
                    </td>
                    <td class="py-5 text-center text-sm font-bold text-dark">৳{{ number_format($item->price, 2) }}</td>
                    <td class="py-5 text-center text-sm font-bold text-dark">{{ $item->quantity }}</td>
                    <td class="py-5 text-right text-sm font-black text-dark">৳{{ number_format($item->price * $item->quantity, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Totals -->
        <div class="flex justify-end">
            <div class="w-full max-w-[280px] space-y-3">
                <div class="flex justify-between text-sm">
                    <span class="font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                    <span class="font-black text-dark">৳{{ number_format($order->itemsPrice, 2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="font-bold text-gray-400 uppercase tracking-widest">Shipping</span>
                    <span class="font-black text-dark">৳{{ number_format($order->shippingPrice, 2) }}</span>
                </div>
                @if($order->discountAmount > 0)
                <div class="flex justify-between text-sm text-green-500">
                    <span class="font-bold uppercase tracking-widest">Discount ({{ $order->couponCode ?? 'Coupon' }})</span>
                    <span class="font-black">-৳{{ number_format($order->discountAmount, 2) }}</span>
                </div>
                @endif
                <div class="flex justify-between items-center pt-3 border-t-2 border-dark mt-2">
                    <span class="text-xs font-black text-dark uppercase tracking-[0.2em]">Grand Total</span>
                    <span class="text-2xl font-black text-dark">৳{{ number_format($order->totalPrice, 2) }}</span>
                </div>
                <div class="pt-4 text-right">
                    <span class="px-4 py-1.5 bg-dark text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {{ $order->isPaid ? 'PAID' : 'PAYMENT PENDING' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="mt-24 text-center">
            <p class="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">Than you for shopping with Izaan Shop</p>
            <div class="w-16 h-1 bg-gray-50 mx-auto rounded-full"></div>
            <p class="text-[8px] text-gray-300 mt-4 leading-relaxed">
                This is a computer generated invoice. No signature is required.<br/>
                All toys are tested for safety standards.
            </p>
        </div>
    </div>

    <script>
        // Auto print logic can be added if requested, but manual print is safer.
        window.onafterprint = function() {
            // Optional: window.close();
        }
    </script>
</body>
</html>
