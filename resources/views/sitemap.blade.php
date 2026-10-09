<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    @foreach($staticRoutes as $route)
    <url>
        <loc>{{ $route['url'] }}</loc>
        <changefreq>{{ $route['freq'] }}</changefreq>
        <priority>{{ $route['priority'] }}</priority>
    </url>
    @endforeach
    @foreach($portfolio as $item)
    <url>
        <loc>{{ url('/portfolio/' . $item->slug) }}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
        <lastmod>{{ $item->updated_at->toAtomString() }}</lastmod>
    </url>
    @endforeach
</urlset>
