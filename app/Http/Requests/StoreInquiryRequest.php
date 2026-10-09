<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'         => ['required', 'string', 'min:2', 'max:120'],
            'email'        => ['required', 'email:rfc,filter', 'max:254'],
            'project_type' => ['required', 'string', 'in:game-concept,scripting,monetisation,ui-ux,launch,other'],
            'budget_range' => ['required', 'string', 'in:under-2m,2m-5m,5m-15m,over-15m,not-sure'],
            'message'      => ['required', 'string', 'min:20', 'max:3000'],
            // honeypot field: must be empty (validated in middleware, but double-check)
            'website'      => ['sometimes', 'max:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'         => 'Please enter your name.',
            'email.required'        => 'Please enter your email address.',
            'email.email'           => 'That email address does not look right.',
            'project_type.required' => 'Please select a project type.',
            'project_type.in'       => 'Please select a valid project type.',
            'budget_range.required' => 'Please select a budget range.',
            'budget_range.in'       => 'Please select a valid budget range.',
            'message.required'      => 'Please tell us a little about your project.',
            'message.min'           => 'A bit more detail would help: at least 20 characters.',
            'message.max'           => 'Please keep your message under 3,000 characters.',
        ];
    }
}
