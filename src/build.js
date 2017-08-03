const fs = require('fs');

function build(dir) {
    fs.writeFileSync(
        dir + '.js',
        "var type = require('./type-mark');\n" + // all files need access to type-mark
        fs.readdirSync(dir).map(
            // name mangling to shorten the resulting source
            name => fs.readFileSync(dir + '/' + name, 'utf8')
                .replace(/.*require.*/g, '')
                .replace(/.extendfn/g, '.ef')
                .replace(/.extend/g, '.e')
                .replace(/.modify/g, '.m')
        ).join('\n')
    )
}

build('src/extensions');
build('src/modifiers');