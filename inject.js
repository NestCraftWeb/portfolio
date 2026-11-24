const fs = require('fs');
const path = require('path');

const directory = 'e:/portfolio';
const css_link = '<link rel="stylesheet" href="../global-features.css">\n</head>';
const css_link_root = '<link rel="stylesheet" href="global-features.css">\n</head>';
const js_script = '<script src="../global-features.js"></script>\n</body>';
const js_script_root = '<script src="global-features.js"></script>\n</body>';

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk(directory, function(err, results) {
  if (err) throw err;
  results.forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(file, 'utf-8');
        let modified = false;

        let rootPath = path.resolve(directory);
        let dirPath = path.dirname(file);
        let isRoot = rootPath === dirPath;

        let target_css = isRoot ? css_link_root : css_link;
        let target_js = isRoot ? js_script_root : js_script;

        if (!content.includes('global-features.css')) {
            let parts = content.split('</head>');
            if (parts.length > 1) {
                let end = parts.pop();
                content = parts.join('</head>') + target_css + end;
                modified = true;
            }
        }

        if (!content.includes('global-features.js')) {
            let parts = content.split('</body>');
            if (parts.length > 1) {
                let end = parts.pop();
                content = parts.join('</body>') + target_js + end;
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(file, content, 'utf-8');
            console.log(`Updated ${file}`);
        }
    }
  });
});
