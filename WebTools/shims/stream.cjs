// sax.js reads require('stream').Stream while the module loads.
// Vite externalizes that Node builtin in the browser, so Stream is undefined
// and SAXStream's prototype setup throws. xml-js only uses sax.parser().
function Stream() {}

module.exports = Stream;
module.exports.Stream = Stream;
