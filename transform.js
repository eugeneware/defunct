var selector = require('./selector'),
    xtend = require('xtend'),
    pathos = require('pathos');

module.exports = transform;
function transform() {
  var args = Array.prototype.slice.call(arguments);
  return function (data) {
    var slices = [];
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
      slices.push(slice);
    }

    return xtend(data, pathos.build(slices));
  }
}
