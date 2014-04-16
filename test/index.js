var redtape = require('redtape'),
    d = require('..');

var it = redtape();

it('should be able to multiply', function(t) {
  var mul = d.mul(10);
  t.equal(mul(5), 50, 'multiply')
  t.end();
});

it('should be able to divide', function(t) {
  var div = d.div(10);
  t.equal(div(50), 5, 'divide')
  t.end();
});

it('should be able to add', function(t) {
  var add = d.add(10);
  t.equal(add(50), 60, 'add')
  t.end();
});

it('should be able to subtract', function(t) {
  var sub = d.sub(10);
  t.equal(sub(50), 40, 'subtract')
  t.end();
});

it('should be able to select (string path)', function(t) {
  var locator = d.selector('my.property');
  var data = {
    my: {
      property: 42
    }
  };
  t.equal(locator(data), 42, 'simple selector');

  var data2 = {
    my: {
      property: {
        a: 'nested',
        o: 'object'
      }
    }
  };
  t.deepEqual(locator(data2), { a: 'nested', o: 'object' }, 'nested selector');

  t.end();
});

it('should be able to select (array path)', function(t) {
  var locator = d.selector(['my', 'property']);
  var data = {
    my: {
      property: 42
    }
  };
  t.equal(locator(data), 42, 'simple selector');

  var data2 = {
    my: {
      property: {
        a: 'nested',
        o: 'object'
      }
    }
  };
  t.deepEqual(locator(data2), { a: 'nested', o: 'object' }, 'nested selector');

  t.end();
});

it('should be able to ensure monotonic sequences', function(t) {
  var monotonic = d.monotonic();
  var last = -Infinity;
  t.equal(monotonic(1000), 1000, 'simple case');
  t.equal(monotonic(1001), 1001, 'no conflicts');

  var last = 1001, x;
  for (var i = 0; i < 5; i++) {
    x = monotonic(1001);
    t.ok(x > last, 'multiple conflicts');
    last = x;
  }

  for (var i = 0; i < 5; i++) {
    x = monotonic(1001 + i + 1);
    t.ok(x > last, 'no more conflicts');
    last = x;
  }

  t.end();
});

it('should fallback to normal monotonic timestamp with no args', function(t) {
  var monotonic = d.monotonic();
  var last = -Infinity, x;
  for (var i = 0; i < 10; i++) {
    var now = Date.now();
    x = monotonic();
    t.ok(x >= now, 'gte current time');
    t.ok(x > last, 'should have no conflicts');
    last = x;
  }
  t.end();
});

it('should be able to change a field in an object', function(t) {
  var data = {
    a: {
      field: 42
    },
    b: {
      meaning: 'life'
    }
  };
  var transform = d.transform('a.field', { something: 'else' });
  var result = transform(data);;
  var expect = { a: { field: { something: 'else' } },
                 b: { meaning: 'life' } };
  t.deepEqual(result, expect, 'simple replacement');
  t.end();
});

it('should be able to change multiple fields in an object', function(t) {
  var data = {
    a: {
      field: 42,
      keep: 'this'
    },
    b: {
      meaning: 'life'
    },
    c: 'blah'
  };
  var transform = d.transform(
    'a.field', { something: 'else' },
    'b.meaning', 42
  );

  var result = transform(data);;
  var expect = { a: { field: { something: 'else' }, keep: 'this' },
                 b: { meaning: 42 },
                 c: 'blah' };
  t.deepEqual(result, expect, 'multiple replacement');
  t.end();
});

it('should be able to change a field in an object with a fn', function(t) {
  var data = {
    a: {
      field: 42
    },
    b: {
      meaning: 'life'
    }
  };
  var transform = d.transform('a.field', d.mul(10));
  var result = transform(data);;
  var expect = { a: { field: 420 },
                 b: { meaning: 'life' } };
  t.deepEqual(result, expect, 'function replacement');
  t.end();
});

it('should be able to xtend an object', function(t) {
  var data = {
    a: {
      field: 42
    },
    b: {
      meaning: 'life'
    }
  };

  var patch = {
    a: 'something'
  };

  var xtend = d.xtend(patch);
  var expect = { a: 'something',
                 b: { meaning: 'life' } };
  t.deepEqual(xtend(data), expect, 'object extension');
  t.end();
});
