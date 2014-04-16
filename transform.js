var selector = require('./selector'),
    clone = require('clone'),
    pathos = require('pathos');

module.exports = transform;
function transform() {
  var args = Array.prototype.slice.call(arguments);
  return function (data) {
    data = clone(data);
    for (var i = 0; i < args.length; i += 2) {
      var selectorExpr = args[i];
      var replacement = args[i + 1];
      var locator = selector(selectorExpr, true);
      var slice = locator(data);
      if (typeof replacement === 'function') {
        slice.value = replacement(slice.value);
      } else {
        slice.value = replacement;
      }
      pathos.set(data, slice.key, slice.value);
    }

    return data;
  }
}
