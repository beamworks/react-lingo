const main = require('./index');
const prepData = require('./prepData');

// loader for Webpack
// @todo cacheable
module.exports = function (source) {
    const lingoData = JSON.parse(source);

    return 'module.exports = (' + main.XL.toString() + ').bind(' + JSON.stringify(prepData(lingoData)) + ')';
};
