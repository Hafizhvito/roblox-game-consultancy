<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\PortfolioItem;
use App\Models\Service;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        $stats = [
            'new_inquiries'   => Inquiry::where('status', 'new')->count(),
            'total_inquiries' => Inquiry::count(),
            'services'        => Service::count(),
            'portfolio_items' => PortfolioItem::count(),
        ];

        $recentInquiries = Inquiry::latest()->take(5)->get();

        return view('admin.dashboard', compact('stats', 'recentInquiries'));
    }
}
