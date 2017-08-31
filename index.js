// @todo name the function for debug purposes
// @todo carry this out into shared central module that is required per loader site
// @todo in dev-mode only, use Proxy to detect and flag undefined keys
function XL(props) {
    const localeName = window.LINGO_LOCALE; // @todo this better
    const keyMap = this[localeName] || {}; // @todo throw error?

    return props.children(keyMap);
}

function generateDefaultKeyValue(key) {
    return key.toUpperCase().split(/\s+/g).join(' ~ ');
}

function generateReactComponentSourceCode(lingoData) {
    // get supported locale list based on first key @todo check all keys?
    const keyList = Object.keys(lingoData);
    const localeList = Object.keys(lingoData[keyList[0]]);

    const localeDataMap = {};
    localeList.forEach(locale => {
        const keyMap = {};

        keyList.forEach(key => {
            const value = lingoData[key][locale];

            keyMap[key] = typeof value !== 'undefined' // eslint-disable-line no-negated-condition
                ? value
                : generateDefaultKeyValue(key);
        });

        localeDataMap[locale] = keyMap;
    });

    return '(' + XL.toString() + ').bind(' + JSON.stringify(localeDataMap) + ')';
}

module.exports = generateReactComponentSourceCode;
