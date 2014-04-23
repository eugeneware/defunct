var selector = require('./selector');
module.exports = function(mapping) {
  var keys = Object.keys(mapping);
  var fns = keys.map(function (key, i) {
    return selector(mapping[key]);
  });
  return function (data) {
    var result = {};
    keys.forEach(function (key, i) {
      result[key] = fns[i](data);
    });
    return result;
  };
};
