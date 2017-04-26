const fs = require('fs');

fs.writeFileSync(
    "src/extensions.js",
    "var type = require('./type-mark');\nvar util = require('./util');\n" +
    fs.readdirSync('src/extensions').map(
        name => fs.readFileSync('src/extensions/' + name, 'utf8')
            .replace(/.*require.*/g, '')
    ).join('')
);