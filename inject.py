import os

directory = 'e:/portfolio'
css_link = '<link rel="stylesheet" href="../global-features.css">\n</head>'
css_link_root = '<link rel="stylesheet" href="global-features.css">\n</head>'
js_script = '<script src="../global-features.js"></script>\n</body>'
js_script_root = '<script src="global-features.js"></script>\n</body>'

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except UnicodeDecodeError:
                continue
            
            modified = False
            
            # Check if it's the root index.html
            is_root = os.path.normpath(root) == os.path.normpath('e:/portfolio')
            target_css = css_link_root if is_root else css_link
            target_js = js_script_root if is_root else js_script
            
            if 'global-features.css' not in content:
                # Replace the last occurrence of </head>
                parts = content.rsplit('</head>', 1)
                if len(parts) == 2:
                    content = parts[0] + target_css + parts[1]
                    modified = True
                
            if 'global-features.js' not in content:
                # Replace the last occurrence of </body>
                parts = content.rsplit('</body>', 1)
                if len(parts) == 2:
                    content = parts[0] + target_js + parts[1]
                    modified = True
                
            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filepath}")
