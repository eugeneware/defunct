var pathos = require('pathos'),
    selector = require('./selector');
module.exports = function(mapping) {
  var slices = pathos.slice(mapping).map(function (slice) {
    return {
      key: slice.key,
      value: slice.value,
      fn: selector(slice.value)
    };
  });
  return function (data) {
    var components = slices.map(function (slice) {
      return {
        key: slice.key,
        value: slice.fn(data)
      };
    });
    return pathos.build(components);
  };
};
