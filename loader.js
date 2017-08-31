const generateSourceCode = require('./index');

// loader for Webpack
// @todo cacheable
module.exports = function (source) {
    const lingoData = JSON.parse(source);

    return 'module.exports = ' + generateSourceCode(lingoData);
};
