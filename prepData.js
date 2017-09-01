function generateDefaultKeyValue(key) {
    return key.toUpperCase().split(/\s+/g).join(' ~ ');
}

function prepData(lingoData) {
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

    return localeDataMap;
}

module.exports = prepData;
