const React = require('react');

// @todo name the function for debug purposes
// @todo carry this out into shared central module that is required per loader site
// @todo in dev-mode only, use Proxy to detect and flag undefined keys
const defineXL = function (data) {
    function XL(props, context) {
        const localeName = context.lingo_currentLocale; // @todo throw error if not given?
        const keyMap = data[localeName] || {}; // @todo throw error?

        return props.children(keyMap);
    }

    XL.contextTypes = {
        lingo_currentLocale: function () { return null; }
    };

    return XL;
}

// set up the current locale name
// @todo use PureComponent
class LingoContext extends React.Component {
    getChildContext() {
        return {
            lingo_currentLocale: this.props.locale || '<unknown>'
        };
    }

    render() {
        return React.Children.only(this.props.children);
    }
}

LingoContext.childContextTypes = {
    lingo_currentLocale: function () { return null; }
};

module.exports.LingoContext = LingoContext;
module.exports._defineXL = defineXL;
