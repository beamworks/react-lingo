const fs = require('fs');
const glob = require('glob');
const minimist = require('minimist');
const csvStringify = require('csv-stringify');

// grab the needed arguments
const argv = minimist(process.argv.slice(2));
const baseLocale = argv.base;
const targetLocale = argv.locale;

if (!baseLocale) {
    throw new Error('use --base parameter to define base locale');
}

if (!targetLocale) {
    throw new Error('use --locale parameter to define target locale');
}

glob('**/*.i18n.json', function (err, jsonPathList) {
    if (err) {
        throw new Error(err);
    }

    Promise.all(jsonPathList.map(function (jsonPath) {
        return new Promise(function (resolve, reject) {
            // force UTF-8 encoding on all JSON data
            fs.readFile(jsonPath, 'utf8', function (err, contents) {
                if (err) {
                    reject(err);
                } else {
                    resolve(contents);
                }
            });
        });
    })).then(function (jsonDataList) {
        // output flattened array of translatable data rows
        return jsonDataList.reduce(function (outputRowList, jsonData, fileIndex) {
            const filePath = jsonPathList[fileIndex];
            const i18nContent = JSON.parse(jsonData); // @todo error reporting with file context
            const i18nKeyList = Object.keys(i18nContent);

            // produce translatable rows
            const i18nRowList = i18nKeyList.map(function (i18nKey) {
                const translations = i18nContent[i18nKey];

                return [
                    filePath,
                    i18nKey,
                    translations[baseLocale],
                    translations[targetLocale]
                ];
            });

            // append the current file's data to the overall row list
            return outputRowList.concat(i18nRowList);
        }, []);
    }).then(function (translatableRowList) {
        const stringifier = csvStringify();

        // pipe out results in CSV format to stdout
        stringifier.pipe(process.stdout);

        translatableRowList.forEach(function (row) {
            stringifier.write(row);
        });

        stringifier.end();
    });
});
