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

it('should be able to select a whole object', function(t) {
  var data = {
    a: {
      field: 42
    },
    b: {
      meaning: 'life'
    }
  };
  var locator, results, expected;

  locator = d.selector(null);
  results = locator(data);
  expected = JSON.parse(JSON.stringify(data));
  t.deepEqual(results, data, 'select whole object null arg');

  locator = d.selector('');
  results = locator(data);
  expected = JSON.parse(JSON.stringify(data));
  t.deepEqual(results, data, 'select whole object empty string arg');
  t.end();
});

it('should be able to rewrite an object', function(t) {
  var data = {
    a: {
      field: 42
    },
    b: {
      meaning: 'life'
    }
  };

  var rewriter = d.rewrite(function (key, value) {
    if (key[key.length - 1] === 'field') {
      key[key.length - 1] = 'prop';
      return {
        key: key,
        value: 'changed'
      };
      return data;
    } else {
      return true;
    }
  });

  var results = rewriter(data);
  var expected = {
    a: {
      prop: 'changed'
    },
    b: {
      meaning: 'life'
    }
  };
  t.deepEqual(results, expected);
  t.end();
});

it('should be able to objectify an array', function(t) {
  var rows = require('./fixtures/weblog');
  var results = rows.map(d.objectify({
    ip: '0',
    ts: '3',
    request: '5',
    status: '7',
    size: '8',
    referer: '9',
    useragent: '11'
  }));
  var expected =
    [ { ip: '68.205.23.113',
        ts: '24/Jun/2012:06:44:56 +1000',
        request: 'GET /affiliate/MarketSamuraiBanner2.jpg HTTP/1.1',
        status: '200',
        size: '18629',
        referer: 'http://www.ferreemoney.com/blog/category/social-media/',
        useragent: 'Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B206 Safari/7534.48.3' },
      { ip: '67.193.234.164',
        ts: '24/Jun/2012:06:44:56 +1000',
        request: 'POST /app/register.php HTTP/1.1',
        status: '200',
        size: '1021',
        referer: '-',
        useragent: 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9) Gecko/2008052906 Firefox/3.0' },
      { ip: '190.98.91.239',
        ts: '24/Jun/2012:06:44:56 +1000',
        request: 'GET /dojo/marketsamurai HTTP/1.1',
        status: '200',
        size: '5042',
        referer: 'http://www.noblesamurai.com/dojo/marketsamurai/7284-introduction-to-keyword-research',
        useragent: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; SV1; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)' } ];

  t.deepEquals(results, expected);
  t.end();
});

it('should be able to object a more complex structure', function(t) {
  var rows = require('./fixtures/weblog');
  var results = rows.map(d.objectify({
    mykey: [ '3', '0' ],
    mydata: {
      request: '5',
      useragent: '11'
    }
  }));
  var expected = [
    { mykey: { '0': '24/Jun/2012:06:44:56 +1000', '1': '68.205.23.113' },
      mydata:
       { request: 'GET /affiliate/MarketSamuraiBanner2.jpg HTTP/1.1',
         useragent: 'Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B206 Safari/7534.48.3' } },
    { mykey: { '0': '24/Jun/2012:06:44:56 +1000', '1': '67.193.234.164' },
      mydata:
       { request: 'POST /app/register.php HTTP/1.1',
         useragent: 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9) Gecko/2008052906 Firefox/3.0' } },
    { mykey: { '0': '24/Jun/2012:06:44:56 +1000', '1': '190.98.91.239' },
      mydata:
       { request: 'GET /dojo/marketsamurai HTTP/1.1',
         useragent: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; SV1; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)' } } ];
  t.deepEquals(results, expected);
  t.end();
});
