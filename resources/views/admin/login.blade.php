<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Admin Login: {{ config('business.name') }}</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #FBF7F2; color: #2B2A33; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.box { background: #fff; border-radius: 16px; border: 1px solid #e8e2da; padding: 40px; width: 100%; max-width: 380px; }
.box h1 { font-size: 20px; margin-bottom: 8px; }
.box p { font-size: 14px; color: #5B5963; margin-bottom: 28px; }
label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: #5B5963; }
input { width: 100%; padding: 10px 12px; border: 1px solid #e8e2da; border-radius: 8px; font-size: 14px; font-family: inherit; margin-bottom: 16px; }
input:focus { outline: none; border-color: #DCD3F0; box-shadow: 0 0 0 3px rgba(220,211,240,0.3); }
button { width: 100%; padding: 12px; background: #2B2A33; color: #FBF7F2; border: none; border-radius: 8px; font-size: 15px; font-weight: 500; cursor: pointer; margin-top: 8px; }
button:hover { background: #3d3c47; }
.error { background: #fde8e8; color: #7d1a1a; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
.remember { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #5B5963; margin-bottom: 4px; }
.remember input { width: auto; margin-bottom: 0; }
</style>
</head>
<body>
<div class="box">
    <h1>Admin access</h1>
    <p>{{ config('business.name') }}</p>
    @if($errors->any())
        <div class="error">{{ $errors->first() }}</div>
    @endif
    <form method="POST" action="{{ route('admin.login.post') }}">
        @csrf
        <label for="email">Email</label>
        <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="username">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required autocomplete="current-password">
        <div class="remember">
            <input type="checkbox" id="remember" name="remember">
            <label for="remember" style="margin-bottom:0">Remember me</label>
        </div>
        <button type="submit">Sign in</button>
    </form>
</div>
</body>
</html>
