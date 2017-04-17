var npmConfig = require('./package.json');
var fs        = require('fs');

function modify(path, fn) {
    console.log('Modifying ' + path + '...');
    fs.writeFileSync(path, fn(fs.readFileSync(path, 'utf8')));
}

var config = './docs/_config.yml';
var readme = './README.md';
var hash   = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

modify(config, function(source) {
    return source
        .replace(/version:.*/, 'version: ' + npmConfig.version)
        .replace(/https:\/\/cdn.rawgit.com\/ejrbuss\/type-mark\/.*\/type-mark.min.js/g,
            'https://cdn.rawgit.com/ejrbuss/type-mark/' + hash + '/type-mark.min.js'
        );
});

modify(readme, function(source) {
    return source
        .replace(
            /https:\/\/cdn.rawgit.com\/ejrbuss\/type-mark\/.*\/type-mark.min.js/g,
            'https://cdn.rawgit.com/ejrbuss/type-mark/' + hash + '/type-mark.min.js'
        );

});

console.log('done');