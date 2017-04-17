require('./polyfills')
require('./extensions/types');
require('./extensions/array');
require('./extensions/object');
require('./extensions/integer');
require('./extensions/empty');
require('./extensions/native');
require('./extensions/positive');
require('./extensions/negative');
require('./extensions/even');
require('./extensions/odd');
require('./extensions/exists');
require('./extensions/lengthof');
require('./extensions/instanceof');
require('./extensions/min');
require('./extensions/max');
require('./extensions/range');
require('./extensions/implements');

module.exports = require('./type-mark');