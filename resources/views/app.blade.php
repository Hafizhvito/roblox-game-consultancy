<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @if(config('services.turnstile.site_key'))
    <meta name="turnstile-site-key" content="{{ config('services.turnstile.site_key') }}">
    @endif

    <title inertia>{{ config('business.name') }}</title>

    <!-- SEO Meta (overridden per page via Inertia head) -->
    <meta name="description" content="{{ $page['props']['meta']['description'] ?? config('business.tagline') }}">
    <meta property="og:title" content="{{ $page['props']['meta']['title'] ?? config('business.name') }}">
    <meta property="og:description" content="{{ $page['props']['meta']['description'] ?? config('business.tagline') }}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_US">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- Fonts preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="bg-cream text-ink antialiased">
    @inertia
</body>
</html>
