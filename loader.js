const main = require('./index');
const prepData = require('./prepData');

// loader for Webpack
// @todo cacheable
module.exports = function (source) {
    const lingoData = JSON.parse(source);

    // @todo require defineXL as shared dependency
    return 'module.exports = (' + main._defineXL.toString() + ')(' + JSON.stringify(prepData(lingoData)) + ')';
};
