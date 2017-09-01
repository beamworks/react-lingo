// @todo name the function for debug purposes
// @todo carry this out into shared central module that is required per loader site
// @todo in dev-mode only, use Proxy to detect and flag undefined keys
function XL(props) {
    const localeName = window.LINGO_LOCALE; // @todo this better
    const keyMap = this[localeName] || {}; // @todo throw error?

    return props.children(keyMap);
}

module.exports.XL = XL;
