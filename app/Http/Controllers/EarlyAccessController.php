<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\InquiryReceived;

class EarlyAccessController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'   => ['required', 'email:rfc,filter', 'max:254'],
            'name'    => ['nullable', 'string', 'max:100'],
            'discord' => ['nullable', 'string', 'max:100'],
        ]);

        $inquiry = Inquiry::create([
            'name'         => $validated['name'] ?? 'Creator Early Access',
            'email'        => $validated['email'],
            'project_type' => 'saas-early-access',
            'budget_range' => 'pro-subscription',
            'message'      => 'Early Access Waitlist Signup for Economy Studio PRO. Discord/Contact: ' . ($validated['discord'] ?? 'None'),
            'status'       => 'new',
            'ip_address'   => $request->ip(),
            'user_agent'   => $request->userAgent(),
        ]);

        // Send owner notification
        $ownerEmail = config('business.owner_notification_email');
        if (!empty($ownerEmail) && !str_starts_with(trim($ownerEmail), '[')) {
            try {
                Mail::to($ownerEmail)->send(new InquiryReceived($inquiry));
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::info('Early access notification: ' . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Thank you. You have been successfully registered for the Economy Studio PRO early access waitlist.',
        ]);
    }
}
