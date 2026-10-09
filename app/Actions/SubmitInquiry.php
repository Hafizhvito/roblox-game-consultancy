<?php

namespace App\Actions;

use App\Mail\InquiryConfirmation;
use App\Mail\InquiryReceived;
use App\Models\Inquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class SubmitInquiry
{
    public function handle(array $validated, Request $request): Inquiry
    {
        $inquiry = Inquiry::create([
            'name'         => $validated['name'],
            'email'        => $validated['email'],
            'project_type' => $validated['project_type'],
            'budget_range' => $validated['budget_range'],
            'message'      => $validated['message'],
            'status'       => 'new',
            'ip_address'   => $request->ip(),
            'user_agent'   => $request->userAgent(),
        ]);

        // Notifications must go to OWNER_NOTIFICATION_EMAIL, never to placeholder
        $ownerEmail = config('business.owner_notification_email');
        if (!empty($ownerEmail) && !str_starts_with(trim($ownerEmail), '[')) {
            try {
                Mail::to($ownerEmail)
                    ->send(new InquiryReceived($inquiry));
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Could not deliver owner notification email: ' . $e->getMessage());
            }
        }

        // Confirm to sender only when a real business email is configured
        $businessEmail = config('business.email');
        if (!empty($businessEmail) && !str_starts_with(trim($businessEmail), '[')) {
            try {
                Mail::to($inquiry->email)
                    ->send(new InquiryConfirmation($inquiry));
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::info('Could not deliver confirmation email to sender: ' . $e->getMessage());
            }
        }

        return $inquiry;
    }
}
