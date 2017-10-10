const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse');
const through = require('through');

// @todo get from argv
const baseLocale = 'en';
const targetLocale = 'fr';

const jsonWorkset = {};
const modifiedFileSet = {};

process.stdin.pipe(
    csvParse()
).pipe(
    through(function (row) {
        // process data changes from the translation file row
        const unsafeFilePath = row[0];
        const i18nKey = row[1];
        const baseValue = row[2] || '';
        const targetTranslation = row[3] || '';

        // sanitize file path that we will be modifying
        const filePath = path.relative('.', unsafeFilePath);

        if (filePath[0] === '.') {
            throw new Error('unsafe file path: ' + unsafeFilePath);
        }

        // load and cache parsed JSON data
        if (!jsonWorkset[filePath]) {
            jsonWorkset[filePath] = JSON.parse(fs.readFileSync(filePath, ''));
        }

        // modify the parsed data if key is present and base value matches
        const translationData = jsonWorkset[filePath][i18nKey];

        // coalesce original values to empty string for proper CSV comparison
        const originalBase = translationData[baseLocale] || '';
        const originalTarget = translationData[targetLocale] || '';

        if (!translationData) {
            console.error(filePath, 'key not found:', i18nKey);
        } else if (originalBase !== baseValue) {
            console.error(filePath, 'original text has changed:', i18nKey);
            console.error('    source code:', originalBase);
            console.error('    imported data:', baseValue);
        } else if (originalTarget === targetTranslation) {
            // silently ignore unchanged values, to e.g. avoid filling default blanks
        } else {
            // update the dataset and mark for writing
            translationData[targetLocale] = targetTranslation;
            modifiedFileSet[filePath] = true;
        }
    }, function () {
        const modifiedFileList = Object.keys(modifiedFileSet);

        // apply changed files
        modifiedFileList.forEach(function (filePath) {
            const modifiedData = jsonWorkset[filePath];
            const encoded = JSON.stringify(modifiedData, null, 4); // @todo configurable indentation

            console.log('updating', filePath);

            // @todo warn/require flag/etc
            fs.writeFileSync(filePath, encoded + '\n', 'utf8');
        });
    })
);
