<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ProcessController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Process', [
            'meta' => [
                'title'       => 'How We Work: ' . config('business.name'),
                'description' => 'Four clear phases: consultation, scoping, execution, and handover. Realistic timelines with no surprises.',
            ],
        ]);
    }
}
