<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>@yield('title', 'Admin'): {{ config('business.name') }}</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, -apple-system, sans-serif; background: #f4f1ee; color: #2B2A33; min-height: 100vh; display: flex; }
.sidebar { width: 220px; background: #2B2A33; color: #FBF7F2; padding: 24px 0; flex-shrink: 0; display: flex; flex-direction: column; min-height: 100vh; }
.sidebar .logo { padding: 0 20px 24px; font-size: 14px; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.1); color: #F9D5C5; }
.sidebar nav { padding: 16px 0; flex: 1; }
.sidebar a { display: block; padding: 10px 20px; color: #c5c0bb; text-decoration: none; font-size: 14px; transition: all 0.15s; }
.sidebar a:hover, .sidebar a.active { background: rgba(255,255,255,0.08); color: #FBF7F2; }
.sidebar .badge { display: inline-block; background: #F9D5C5; color: #2B2A33; border-radius: 10px; padding: 1px 7px; font-size: 11px; margin-left: 6px; font-weight: 600; }
.sidebar-footer { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.1); }
.sidebar-footer form { display: inline; }
.sidebar-footer button { background: none; border: none; color: #c5c0bb; font-size: 13px; cursor: pointer; padding: 0; }
.sidebar-footer button:hover { color: #FBF7F2; }
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.topbar { background: #fff; border-bottom: 1px solid #e8e2da; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; }
.topbar h1 { font-size: 18px; font-weight: 600; }
.content { padding: 32px; flex: 1; }
.alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
.alert-success { background: #CFE8DC; color: #1a4d35; }
.alert-error { background: #fde8e8; color: #7d1a1a; }
.card { background: #fff; border-radius: 12px; border: 1px solid #e8e2da; padding: 24px; margin-bottom: 20px; }
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
.table th { text-align: left; padding: 10px 12px; border-bottom: 2px solid #e8e2da; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #5B5963; }
.table td { padding: 10px 12px; border-bottom: 1px solid #f0ebe4; vertical-align: middle; }
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: #faf7f4; }
.btn { display: inline-block; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; text-decoration: none; cursor: pointer; border: none; transition: all 0.15s; }
.btn-primary { background: #2B2A33; color: #FBF7F2; }
.btn-primary:hover { background: #3d3c47; }
.btn-secondary { background: #e8e2da; color: #2B2A33; }
.btn-secondary:hover { background: #ddd6cc; }
.btn-danger { background: #fee2e2; color: #991b1b; }
.btn-danger:hover { background: #fecaca; }
.btn-sm { padding: 5px 10px; font-size: 12px; }
.status-badge { display: inline-block; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.status-new { background: #F9D5C5; color: #7d3a1f; }
.status-read { background: #CFE8DC; color: #1a4d35; }
.status-archived { background: #e8e2da; color: #5B5963; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: #5B5963; }
.form-group input, .form-group textarea, .form-group select { width: 100%; padding: 8px 12px; border: 1px solid #e8e2da; border-radius: 6px; font-size: 14px; font-family: inherit; background: #fff; color: #2B2A33; }
.form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #DCD3F0; box-shadow: 0 0 0 3px rgba(220,211,240,0.3); }
.form-group textarea { min-height: 100px; resize: vertical; }
.error-msg { color: #991b1b; font-size: 12px; margin-top: 4px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat-card { background: #fff; border-radius: 10px; border: 1px solid #e8e2da; padding: 20px; }
.stat-card .number { font-size: 28px; font-weight: 700; }
.stat-card .label { font-size: 12px; color: #5B5963; margin-top: 4px; }
.pagination { display: flex; gap: 8px; margin-top: 20px; }
.pagination a, .pagination span { padding: 6px 12px; border-radius: 6px; font-size: 13px; border: 1px solid #e8e2da; text-decoration: none; color: #2B2A33; }
.pagination a:hover { background: #f4f1ee; }
.pagination .active { background: #2B2A33; color: #FBF7F2; border-color: #2B2A33; }
</style>
</head>
<body>
<aside class="sidebar">
    <div class="logo">{{ config('business.name') }}<br><span style="font-size:11px;color:#888;font-weight:400">Admin</span></div>
    <nav>
        <a href="{{ route('admin.dashboard') }}" class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">Dashboard</a>
        <a href="{{ route('admin.inquiries.index') }}" class="{{ request()->routeIs('admin.inquiries*') ? 'active' : '' }}">
            Inquiries
            @php $newCount = \App\Models\Inquiry::where('status','new')->count() @endphp
            @if($newCount > 0)<span class="badge">{{ $newCount }}</span>@endif
        </a>
        <a href="{{ route('admin.services.index') }}" class="{{ request()->routeIs('admin.services*') ? 'active' : '' }}">Services</a>
        <a href="{{ route('admin.packages.index') }}" class="{{ request()->routeIs('admin.packages*') ? 'active' : '' }}">Packages</a>
        <a href="{{ route('admin.portfolio.index') }}" class="{{ request()->routeIs('admin.portfolio*') ? 'active' : '' }}">Portfolio</a>
        <a href="{{ route('home') }}" target="_blank" style="margin-top:16px;border-top:1px solid rgba(255,255,255,0.1);padding-top:20px">View site ↗</a>
    </nav>
    <div class="sidebar-footer">
        <form method="POST" action="{{ route('admin.logout') }}">
            @csrf
            <button type="submit">Sign out</button>
        </form>
    </div>
</aside>
<div class="main">
    <div class="topbar">
        <h1>@yield('title', 'Dashboard')</h1>
        <span style="font-size:13px;color:#5B5963">{{ auth()->user()->name }}</span>
    </div>
    <div class="content">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        @if($errors->any())
            <div class="alert alert-error">
                @foreach($errors->all() as $error)<div>{{ $error }}</div>@endforeach
            </div>
        @endif
        @yield('content')
    </div>
</div>
</body>
</html>
