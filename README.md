# defunct

Library of functional helper functions

[![build status](https://secure.travis-ci.org/eugeneware/defunct.png)](http://travis-ci.org/eugeneware/defunct)

## Installation

This module is installed via npm:

``` bash
$ npm install defunct
```

## Example Usage

``` js
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
```
