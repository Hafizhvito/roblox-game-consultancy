<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Inquiry</title>
<style>
  body { font-family: 'DM Sans', Arial, sans-serif; background: #FBF7F2; color: #2B2A33; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e8e2da; }
  .header { background: #F9D5C5; padding: 32px 40px; }
  .header h1 { font-size: 22px; margin: 0; color: #2B2A33; }
  .body { padding: 32px 40px; }
  .field { margin-bottom: 20px; }
  .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #5B5963; margin-bottom: 4px; }
  .value { font-size: 16px; color: #2B2A33; }
  .message-box { background: #FBF7F2; border-radius: 8px; padding: 16px; margin-top: 8px; font-size: 15px; line-height: 1.6; white-space: pre-wrap; }
  .footer { padding: 24px 40px; border-top: 1px solid #e8e2da; font-size: 13px; color: #5B5963; }
  .btn { display: inline-block; background: #2B2A33; color: #FBF7F2; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; margin-top: 16px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>New inquiry from {{ $inquiry->name }}</h1>
  </div>
  <div class="body">
    <div class="field">
      <div class="label">Name</div>
      <div class="value">{{ $inquiry->name }}</div>
    </div>
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:{{ $inquiry->email }}">{{ $inquiry->email }}</a></div>
    </div>
    <div class="field">
      <div class="label">Project Type</div>
      <div class="value">{{ str_replace('-', ' ', ucfirst($inquiry->project_type)) }}</div>
    </div>
    <div class="field">
      <div class="label">Budget Range</div>
      <div class="value">{{ str_replace('-', ' ', $inquiry->budget_range) }}</div>
    </div>
    <div class="field">
      <div class="label">Message</div>
      <div class="message-box">{{ $inquiry->message }}</div>
    </div>
    <a class="btn" href="{{ route('admin.inquiries.show', $inquiry) }}">View in admin</a>
  </div>
  <div class="footer">
    Received {{ $inquiry->created_at->format('d M Y, H:i') }} &middot; IP: {{ $inquiry->ip_address }}
  </div>
</div>
</body>
</html>
