<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>We received your message</title>
<style>
  body { font-family: Arial, sans-serif; background: #FBF7F2; color: #2B2A33; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e8e2da; }
  .header { background: #CFE8DC; padding: 32px 40px; }
  .header h1 { font-size: 22px; margin: 0; color: #2B2A33; }
  .body { padding: 32px 40px; font-size: 16px; line-height: 1.7; }
  .body p { margin: 0 0 16px; }
  .recap { background: #FBF7F2; border-radius: 8px; padding: 16px 20px; margin: 24px 0; font-size: 14px; }
  .recap p { margin: 4px 0; }
  .footer { padding: 24px 40px; border-top: 1px solid #e8e2da; font-size: 13px; color: #5B5963; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Thanks, {{ $inquiry->name }}.</h1>
  </div>
  <div class="body">
    <p>We received your message and will be in touch within two business days.</p>
    <p>Here is a summary of what you sent:</p>
    <div class="recap">
      <p><strong>Project type:</strong> {{ str_replace('-', ' ', ucfirst($inquiry->project_type)) }}</p>
      <p><strong>Budget range:</strong> {{ str_replace('-', ' ', $inquiry->budget_range) }}</p>
      <p><strong>Your message:</strong> {{ Str::limit($inquiry->message, 200) }}</p>
    </div>
    <p>If you have anything to add in the meantime, just reply to this email.</p>
    <p>Talk soon,<br>{{ config('business.name') }}</p>
  </div>
  <div class="footer">
    {{ config('business.name') }} &middot; {{ config('business.address') }}<br>
    Not affiliated with Roblox Corporation.
  </div>
</div>
</body>
</html>
