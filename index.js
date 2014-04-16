var xtend = require('xtend');

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
  }
}

exports.selector = exports.pluck = require('./selector');
exports.monotonic = require('./monotonic');
exports.transform = require('./transform');
