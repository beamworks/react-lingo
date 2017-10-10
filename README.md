# React Lingo

Component-friendly i18n. Optimized for developer workflow (adding/removing translation keys).

## Sample Code

Translation file `MyComponent.i18n.json`:

```json
{
    "HELLO_WORLD": {
        "en-US": "Hello world!",
        "fr-FR": "Bonjour le monde!"
    },
    "PLEASE_ENTER_PASSWORD": {
        "en-US": "Please enter your password",
        "fr-FR": "En fait, je ne parle pas Français"
    }
}
```

Component file `MyComponent.jsx`:

```js
import XL from './MyComponent.i18n.json';

class MyComponent extends React.PureComponent {
    render() {
        return <XL>{(xl) =>
            <div className="my-component">
                <h1>{xl.HELLO_WORLD}</h1>

                <span>{xl.PLEASE_ENTER_PASSWORD}</span>
            </div>
        }</XL>
    }
}
```

Wrap everything in Lingo context (usually in app root component):

```
...
<LingoContext locale={userLocale || 'en-US'}>
    ... rendered app components with XL tags go here ...
</LingoContext>
...
```

Rendered output:

```html
<div class="my-component">
    <h1>Hello world!</h1>
    <span>Please enter your password</span>
</div>
```

## Translation Pipeline

Assuming you are mainly developing in English and want to export a CSV file for French translation work, start off by writing your code with just the English keys in `.i18n.json` files.

```json
{
    "HELLO_WORLD": {
        "en-US": "Hello world!"
    },
    ...etc
}
```

Then, run the following in your project directory:

```sh
node_modules/.bin/lingo-export --base=en-US --locale=fr-FR > i18n-latest.csv
```

This scans for *all* `.i18n.json` files in your current folder and creates a single combined CSV file that looks like this:

```
src/components/MyComponent.i18n.json,HELLO_WORLD,Hello world!,
src/components/MyComponent.i18n.json,PLEASE_ENTER_PASSWORD,Please enter your password,
src/components/SomeOtherComponent.i18n.json,WHAT_IS_YOUR_FAVORITE_COLOR,What is your favorite color?,

...etc
```

Columns are:

- file path
- internal translation key
- value for the base locale (`en-US` in this case)
- value for the target locale (`fr-FR` in this case)

Initially, the fourth column (target locale text) will be empty. This is what the translator should be filling in.

Then, when translation work is done, place the file in the same spot where it was generated. It should now look something like this, with the fourth column filled in and the others unchanged:

```
src/components/MyComponent.i18n.json,HELLO_WORLD,Hello world!,Bonjour le monde!
src/components/MyComponent.i18n.json,PLEASE_ENTER_PASSWORD,Please enter your password,"En fait, je ne parle pas Français"
src/components/SomeOtherComponent.i18n.json,WHAT_IS_YOUR_FAVORITE_COLOR,What is your favorite color?,La traduction française

...etc
```

Ensure that Git working directory is clean and everything is safely committed (important!) and run the import script that integrates changes back into `.i18n.json` files:

```sh
node_modules/.bin/lingo-import --base=en-US --locale=fr-FR > i18n-latest.csv
```

**Warning:** This modifies the existing JSON files in place, please be careful with any prior uncommitted changes that might get mixed in. Automated import process might change your translation files in unexpected ways, so make sure everything is committed prior to running it!

Then review the JSON file changes and commit/push them as usual. For further translation passes, simply re-run the export process, fill in any new blanks as needed, then re-import.

Developers must be careful when changing the base locale wording for already-translated text: make sure that the other language values are cleared out for that key. This makes it easier to see what needs to be re-translated again. Even better approach is to create a new translation key and delete the old one, since even small changes in wording make for a different meaning.
