<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\CalculatorController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\EarlyAccessController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\PackagesController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProcessController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SnippetController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Route;

// ── Public routes ────────────────────────────────────────────────────────────
Route::get('/', HomeController::class)->name('home');
Route::get('/services', ServicesController::class)->name('services');
Route::get('/packages', PackagesController::class)->name('packages');
Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio');
Route::get('/portfolio/{slug}', [PortfolioController::class, 'show'])->name('portfolio.show');
Route::get('/process', ProcessController::class)->name('process');
Route::get('/about', AboutController::class)->name('about');
Route::get('/calculator', CalculatorController::class)->name('calculator');
Route::get('/snippets', SnippetController::class)->name('snippets');
Route::post('/early-access', [EarlyAccessController::class, 'store'])
    ->name('early-access.store')
    ->middleware('throttle:contact');
Route::get('/privacy-policy', [LegalController::class, 'privacy'])->name('privacy');
Route::get('/terms', [LegalController::class, 'terms'])->name('terms');

// Contact
Route::get('/contact', [ContactController::class, 'show'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])
    ->name('contact.store')
    ->middleware(['throttle:contact', 'honeypot']);

// Assistant Chat
Route::post('/api/chat', [ChatController::class, 'handle'])->middleware('throttle:chat');

// Sitemap
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

// Auth routes (minimal: only login for admin)
Route::redirect('/login', '/admin/login')->name('login');

Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [Admin\AuthController::class, 'showLogin'])->name('admin.login');
    Route::post('/admin/login', [Admin\AuthController::class, 'login'])
        ->name('admin.login.post')
        ->middleware('throttle:5,1');
});

// Admin routes
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function () {
        Route::post('/logout', [Admin\AuthController::class, 'logout'])->name('logout');

        Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');

        // Inquiries
        Route::get('/inquiries', [Admin\InquiryController::class, 'index'])->name('inquiries.index');
        Route::get('/inquiries/{inquiry}', [Admin\InquiryController::class, 'show'])->name('inquiries.show');
        Route::patch('/inquiries/{inquiry}/status', [Admin\InquiryController::class, 'updateStatus'])->name('inquiries.status');
        Route::delete('/inquiries/{inquiry}', [Admin\InquiryController::class, 'destroy'])->name('inquiries.destroy');

        // Services
        Route::get('/services', [Admin\ServiceController::class, 'index'])->name('services.index');
        Route::get('/services/{service}/edit', [Admin\ServiceController::class, 'edit'])->name('services.edit');
        Route::put('/services/{service}', [Admin\ServiceController::class, 'update'])->name('services.update');

        // Packages
        Route::get('/packages', [Admin\PackageController::class, 'index'])->name('packages.index');
        Route::get('/packages/{package}/edit', [Admin\PackageController::class, 'edit'])->name('packages.edit');
        Route::put('/packages/{package}', [Admin\PackageController::class, 'update'])->name('packages.update');

        // Portfolio
        Route::get('/portfolio', [Admin\PortfolioController::class, 'index'])->name('portfolio.index');
        Route::get('/portfolio/{item}/edit', [Admin\PortfolioController::class, 'edit'])->name('portfolio.edit');
        Route::put('/portfolio/{item}', [Admin\PortfolioController::class, 'update'])->name('portfolio.update');
        Route::patch('/portfolio/{item}/featured', [Admin\PortfolioController::class, 'toggleFeatured'])->name('portfolio.featured');
    });
