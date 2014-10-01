var pathos = require('pathos');

module.exports = selector;
function selector(s, build) {
  if (typeof build === 'undefined') build = false;

  if (s === null) {
    s = [];
  }

  if (typeof s === 'string') {
    // treat string as a path
    if (s === '') {
      s = [];
    } else {
      s = s.split('.');
    }
  }

  if (typeof s === 'function') {
    // function predicate
    return s;
  } else if (Array.isArray(s)) {
    // pathos
    if (build) {
      return function (data) {
        return {
          key: s,
          value: pathos.walk(data, s)
        };
      };
    } else {
      return function (data, newVal) {
        if (typeof newVal === 'undefined') {
          return pathos.walk(data, s);
        } else {
          pathos.set(data, s, newVal);
        }
      };
    }
  } else {
    // don't know, return undefined
    return function (data) {
      return void(0);
    };
  }
}

