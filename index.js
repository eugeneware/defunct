var xtend = require('xtend'),
    pathos = require('pathos');

exports.div = div;
function div(den) {
  return function (data) {
    return Math.floor(data / den);
  };
}

exports.mul = mul;
function mul(factor) {
  return function (data) {
    return data * factor;
  };
}

exports.add = add;
function add(num) {
  return function (data) {
    return data + num;
  };
}

exports.sub = sub;
function sub(num) {
  return function (data) {
    return data - num;
  };
}

exports.xtend = _xtend;
function _xtend(patch) {
  return function (data) {
    return xtend(data, patch);
  };
}

exports.rewrite = rewrite;
function rewrite(fn) {
  return function (data) {
    pathos.rewrite(data, fn);
    return data;
  };
}

exports.selector = exports.pluck = require('./selector');
exports.monotonic = require('./monotonic');
exports.transform = require('./transform');
