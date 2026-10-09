<?php

namespace App\Http\Controllers;

use App\Actions\SubmitInquiry;
use App\Http\Requests\StoreInquiryRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ContactController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Contact', [
            'businessEmail'    => config('business.email'),
            'businessWhatsapp' => config('business.whatsapp'),
            'meta' => [
                'title'       => 'Get in Touch: ' . config('business.name'),
                'description' => 'Tell us about your Roblox project. We respond to all inquiries within two business days.',
            ],
        ]);
    }

    public function store(StoreInquiryRequest $request, SubmitInquiry $action): RedirectResponse
    {
        $action->handle($request->validated(), $request);

        return redirect()->route('contact')->with('success', 'Your message has been sent. We will be in touch within two business days.');
    }
}
