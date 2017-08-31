# React Lingo

Component-friendly i18n. Optimized for developer workflow (adding/removing translation keys).

## Sample Code

Translation file `MyComponent.i18n.json`:

```
{
    "HELLO_WORLD": {
        "en-US": "Hello world!",
        "fr-FR": "Bonjour le monde"
    },
    "PLEASE_ENTER_PASSWORD": {
        "en-US": "Please enter your password",
        "fr-FR": "En fait, je ne parle pas Français"
    }
}
```

Component file `MyComponent.jsx`:

```
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
