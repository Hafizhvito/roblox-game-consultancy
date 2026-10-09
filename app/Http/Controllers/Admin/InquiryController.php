<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InquiryController extends Controller
{
    public function index(Request $request): View
    {
        $status   = $request->get('status', 'all');
        $query    = Inquiry::latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $inquiries = $query->paginate(20);

        return view('admin.inquiries.index', compact('inquiries', 'status'));
    }

    public function show(Inquiry $inquiry): View
    {
        if ($inquiry->status === 'new') {
            $inquiry->markAsRead();
        }

        return view('admin.inquiries.show', compact('inquiry'));
    }

    public function updateStatus(Request $request, Inquiry $inquiry): RedirectResponse
    {
        $request->validate(['status' => ['required', 'in:new,read,archived']]);
        $inquiry->update(['status' => $request->status]);

        return back()->with('success', 'Inquiry status updated.');
    }

    public function destroy(Inquiry $inquiry): RedirectResponse
    {
        $inquiry->delete();
        return redirect()->route('admin.inquiries.index')->with('success', 'Inquiry deleted.');
    }
}
