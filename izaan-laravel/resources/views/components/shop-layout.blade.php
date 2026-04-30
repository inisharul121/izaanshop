<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Izaan Shop') }} | Toys, Book & Learning Tools</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        /* Multi-range slider styles */
        .range-slider-container {
            position: relative;
            height: 24px;
            width: 100%;
        }
        .range-slider-container input[type="range"] {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            background: none;
            pointer-events: none;
            -webkit-appearance: none;
            appearance: none;
            z-index: 2;
        }
        .range-slider-container input[type="range"]::-webkit-slider-thumb {
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid #FF3B30; /* Primary color */
            pointer-events: auto;
            -webkit-appearance: none;
            appearance: none;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(255, 59, 48, 0.2);
            transition: all 0.2s ease;
        }
        .range-slider-container input[type="range"]::-webkit-slider-thumb:hover {
            scale: 1.1;
            box-shadow: 0 4px 12px rgba(255, 59, 48, 0.3);
        }
        /* Overlap fix */
        .range-slider-container input[type="range"]:last-child {
            z-index: 3;
        }
    </style>
</head>
<body class="font-sans antialiased bg-secondary text-dark">
    <div class="min-h-screen">
        <x-navbar />
        
        <main style="padding-top: 205px;" class="md:hidden">
            {{ $slot }}
        </main>
        <main style="padding-top: 245px;" class="hidden md:block">
            {{ $slot }}
        </main>

        <x-footer />
    </div>


</body>
</html>
