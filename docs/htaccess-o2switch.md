# o2switch pagespeed start / DO NOT REMOVE OR EDIT
<IfModule pagespeed_module>
ModPagespeed on
ModPagespeedRewriteLevel PassThrough
ModPagespeedEnableFilters add_head,canonicalize_javascript_libraries,collapse_whitespace,combine_css,combine_heads,convert_meta_tags,dedup_inlined_images,extend_cache,recompress_images,flatten_css_imports,hint_preload_subresources,lazyload_images,rewrite_javascript,move_css_above_scripts,move_css_to_head,insert_dns_prefetch,remove_comments,remove_quotes,rewrite_images,strip_image_meta_data,sprite_images
</IfModule>
# o2switch pagespeed end / DO NOT REMOVE OR EDIT

DirectoryIndex index.html

ErrorDocument 404 /404.html

<IfModule mod_expires.c>
    ExpiresActive On

    # HTML
    ExpiresByType text/html "access plus 10 minutes"
    
    # CSS
    ExpiresByType text/css "access plus 1 year"
    
    # JavaScript
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/javascript "access plus 1 year"
    ExpiresByType application/x-javascript "access plus 1 year"
    
    # Source maps / modules
    ExpiresByType application/json "access plus 1 year"
    ExpiresByType text/plain "access plus 1 year"
    
    # Images
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    
    # Fonts
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
    # JS / CSS / modules / sourcemaps
    <FilesMatch "\.(css|js|mjs|map)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>

    # Images
    <FilesMatch "\.(png|jpg|jpeg|gif|webp|svg|ico)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    
    # Fonts
    <FilesMatch "\.(woff|woff2|ttf|otf|eot)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    
    # HTML
    <FilesMatch "\.(html)$">
        Header set Cache-Control "public, max-age=600"
    </FilesMatch>
</IfModule>