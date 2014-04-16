var timestamp = require('monotonic-timestamp');

module.exports = monotonic;
function monotonic() {
  var _last = 0;
  var _count = 1;
  var adjusted = 0;
  var _adjusted = 0;

  return function (time) {
    if (typeof time === 'undefined') {
      time = timestamp();
    }

    if (_last === time) {
      do {
        adjusted = time + ((_count++) / (_count + 999));
      } while (adjusted === _adjusted);
      _adjusted = adjusted;
    } else {
      // If last time was different reset timer back to `1`.
      _count = 1;
      adjusted = time;
    }
    _adjusted = adjusted;
    _last = time;
    return adjusted;
  }
}
