// sax.js optionally requires Node's string_decoder when writing Buffers
// through SAXStream. Vite externalizes that builtin in the browser.
function StringDecoder() {}

StringDecoder.prototype.write = function write(buffer) {
  return buffer.toString();
};

StringDecoder.prototype.end = function end(buffer) {
  return buffer ? buffer.toString() : '';
};

module.exports = { StringDecoder };
