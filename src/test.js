(() => {
	'use strict';
	      
  let dc;
  try {
    dc = require('../dist/data-cube.js');
    console.log('--- Testing ./dist/data-cube.js');
  }
  catch (e) {
    dc = require( './data-cube.js');
    console.log('--- Testing ./src/data-cube.js');
  }
  
  const assert = dc._assert,
        test = assert.test,
        h = Array.prototype._helper,
        _isEqual = require('lodash.isequal');
  
  const runTests = (name, f) => {
    try { 
      f();
    }
    catch (err) {
      console.log(`Could not run tests for ${name + (err.stack ? `:\n  ${err.stack}` : '')}`);
    }
  };

  
  //--------------- tests ---------------//
    
  runTests('helper functions', () => {
  
    //assert functions
    {
      assert.each('assert-int', [
        [() => h.assert.int(5), 5],
        [() => h.assert.int(0), 0],
        [() => h.assert.int(-2), -2],
      ]);
      assert.throwEach('invalid-assert-int', [
        () => h.assert.int(1.2),
        () => h.assert.int(Infinity),
        () => h.assert.int(-Infinity),
        () => h.assert.int(NaN),
        () => h.assert.int('2'),
        () => h.assert.int([2])
      ]);
      
      assert.each('assert-non-neg-int', [
        [() => h.assert.nonNegInt(5), 5],
        [() => h.assert.nonNegInt(0), 0]
      ]);
      assert.throwEach('invalid-assert-non-neg-int', [
        () => h.assert.nonNegInt(-2),
        () => h.assert.nonNegInt(1.2),
        () => h.assert.nonNegInt(Infinity),
        () => h.assert.nonNegInt(NaN),
        () => h.assert.nonNegInt('2'),
        () => h.assert.nonNegInt([2])
      ]);
      
      assert.each('assert-non-neg-fin', [
        [() => h.assert.nonNegFin(5), 5],
        [() => h.assert.nonNegFin(1.23), 1.23],
        [() => h.assert.nonNegFin(0), 0],
      ]);
      assert.throwEach('invalid-assert-non-neg-fin', [
        () => h.assert.nonNegFin(-2),
        () => h.assert.nonNegFin(Infinity),
        () => h.assert.nonNegFin(-Infinity),
        () => h.assert.nonNegFin(NaN),
        () => h.assert.nonNegFin('2'),
        () => h.assert.nonNegFin([2]),
      ]);
      
      assert.each('assert-fin', [
        [() => h.assert.fin(5), 5],
        [() => h.assert.fin(1.23), 1.23],
        [() => h.assert.fin(0), 0],
        [() => h.assert.fin(-2), -2],
      ]);
      assert.throwEach('invalid-assert-fin', [
        () => h.assert.fin(Infinity),
        () => h.assert.fin(-Infinity),
        () => h.assert.fin(NaN),
        () => h.assert.fin('2'),
        () => h.assert.fin([2]),
        () => h.assert.fin(null),
      ]);
      
      assert.each('assert-pos-int', [
        [() => h.assert.posInt(5), 5]
      ]);
      assert.throwEach('invalid-assert-pos-int', [
        () => h.assert.posInt(-2),
        () => h.assert.posInt(0),
        () => h.assert.posInt(1.2),
        () => h.assert.posInt(Infinity),
        () => h.assert.posInt(NaN),
        () => h.assert.posInt('2'),
        () => h.assert.posInt([2])
      ]);

      assert.each('assert-number', [
        [() => h.assert.number(5), 5],
        [() => h.assert.number(0), 0],
        [() => h.assert.number(-2.3), -2.3]
      ]);
      assert.throwEach('invalid-assert-number', [
        () => h.assert.number('2'),
        () => h.assert.number(false),
        () => h.assert.number([]),
        () => h.assert.number([2]),
        () => h.assert.number([0])
      ]);

      assert.each('assert-string', [
        [() => h.assert.string(''), ''],
        [() => h.assert.string('a'), 'a'],
        [() => h.assert.string('abc defg'), 'abc defg']
      ]);
      assert.throwEach('invalid-assert-string', [
        () => h.assert.string(2),
        () => h.assert.string(false),
        () => h.assert.string([]),
        () => h.assert.string(['a']),
        () => h.assert.string([''])
      ]);

      {
        const obj = {a:5};
        const a0 = [];
        const a1 = [5];
        const a2 = [5,6];
        assert.each('assert-single', [
          [() => h.assert.single(5), 5],
          [() => h.assert.single([5]), 5],
          [() => h.assert.single(obj), obj],
          [() => h.assert.single([obj]), obj],
          [() => h.assert.single([a0]), a0],
          [() => h.assert.single([a1]), a1],
          [() => h.assert.single([a2]), a2]
        ]);
        assert.throwEach('invalid-assert-single', [
          () => h.assert.single([]),
          () => h.assert.single([5,6]),
        ]);
      }

      {
        assert.each('assert-dim', [
          [() => h.assert.dim(0), 0],
          [() => h.assert.dim(1), 1],
          [() => h.assert.dim(2), 2],
          [() => h.assert.dim(undefined), 0],
          [() => h.assert.dim(), 0],
          [() => h.assert.dim([0]), 0],
          [() => h.assert.dim([1]), 1],
          [() => h.assert.dim([2]), 2],
          [() => h.assert.dim([undefined]), 0]
        ]);
        assert.throwEach('invalid-assert-dim', [
          () => h.assert.dim(-1),
          () => h.assert.dim(2.3),
          () => h.assert.dim(NaN),
          () => h.assert.dim([[undefined]]),
          () => h.assert.dim(3),
          () => h.assert.dim('1'),
          () => h.assert.dim([0,1]),
          () => h.assert.dim([]),
          () => h.assert.dim([[0]]),
          () => h.assert.dim([[]]),
          () => h.assert.dim(['0']),
          () => h.assert.dim(['2']),
          () => h.assert.dim([false]),
          () => h.assert.dim(''),
          () => h.assert.dim(null)
        ]);    
      }

    }

    //isSingle
    {
      assert.each('is-single', [
        [() => h.isSingle(5), true],
        [() => h.isSingle([5]), true],
        [() => h.isSingle({a:5}), true],
        [() => h.isSingle([{a:5}]), true],
        [() => h.isSingle([[]]), true],
        [() => h.isSingle([[5]]), true],
        [() => h.isSingle([[5,6]]), true],
        [() => h.isSingle([]), false],
        [() => h.isSingle([5,6]), false]
      ]);
    }

    //equalArray
    {
      const obj = {a:5};
      assert('equal-array-1', () => h.equalArray([2,'a'],[2,'a']), true);
      assert('equal-array-2', () => h.equalArray([2,obj],[2,obj]), true);
      assert('equal-array-3', () => h.equalArray([],[]), true);
      assert('equal-array-4', () => h.equalArray([2,'a'],[2,'b']), false);
      assert('equal-array-5', () => h.equalArray([2,'a',true],[2,'a']), false);
      assert('equal-array-6', () => h.equalArray([2,obj],[2,{a:5}]), false);
    }

    //equalArrayOfArray
    {
      const obj = {a:5};
      assert('equal-array-of-array-1', () => h.equalArrayOfArray( [], [] ), true);
      assert('equal-array-of-array-2', () => h.equalArrayOfArray( [[]], [[]] ), true);
      assert('equal-array-of-array-3', () => h.equalArrayOfArray( [[5]], [[5]] ), true);
      assert('equal-array-of-array-4', () => h.equalArrayOfArray( [[5,6]], [[5,6]] ), true);
      assert('equal-array-of-array-5', () => h.equalArrayOfArray( [[5,obj],[6]], [[5,obj],[6]] ), true);
      assert('equal-array-of-array-6', () => h.equalArrayOfArray( [[5,6,7],[8,9,10]], [[5,6,7],[8,9,10]] ), true);
      assert('equal-array-of-array-7', () => h.equalArrayOfArray( [[5,6]], [[5]] ), false);
      assert('equal-array-of-array-8', () => h.equalArrayOfArray( [[5]], [[5,6]] ), false);
      assert('equal-array-of-array-9', () => h.equalArrayOfArray( [[5,6]], [[5,6,7]] ), false);
      assert('equal-array-of-array-10', () => h.equalArrayOfArray( [[5,6],[]], [[5,6]] ), false);
      assert('equal-array-of-array-11', () => h.equalArrayOfArray( [[obj]], [{a:5}] ), false);
      assert('equal-array-of-array-12', () => h.equalArrayOfArray( [[5,6],['7',8]], [[5,6],[7,8]] ), false);
      assert('equal-array-of-array-13', () => h.equalArrayOfArray( [5,6], [5,6] ), false);
      assert('equal-array-of-array-14', () => h.equalArrayOfArray( [[[5,6]]], [[[5,6]]] ), false);
      assert('equal-array-of-array-15', () => h.equalArrayOfArray( 'abc', 'abc' ), false);
    }

    //toArray
    {
      const obj = {a:5};
      const a0 = [];
      const a1 = [5];
      const a2 = [5,6];
      const a3 = [obj];
      assert.each('to-array', [
        [() => h.equalArray(h.toArray(5), [5]), true],
        [() => h.equalArray(h.toArray(obj), [obj]), true],
        [() => h.toArray(a0), a0],
        [() => h.toArray(a1), a1],
        [() => h.toArray(a2), a2],
        [() => h.toArray(a3), a3]
      ]);
    }

    //copyArray
    {
      const obj = {a:5};
      assert.each('copy-array', [
        [() => h.equalArray(h.copyArray([]), []), true],
        [() => h.equalArray(h.copyArray([5]), [5]), true],
        [() => h.equalArray(h.copyArray([5,obj]), [5,obj]), true],
        [() => h.equalArray(h.copyArray([5,obj]), [5,{a:5}]), false]
      ]);
    }

    //equalMap
    {
      const obj = {};
      const m0    = new Map();
      const m0_1  = new Map();
      const m1    = new Map([ ['a', 5] ]);
      const m1_1  = new Map([ ['a', 5] ]);
      const m2    = new Map([ ['a', 5],   ['b',6] ]);
      const m2_1  = new Map([ ['a', 5],   ['b',6] ]);
      const m2_2  = new Map([ ['a', 5],   ['b',7] ]);
      const m2_3  = new Map([ ['a', {}],  ['b',6] ]);
      const m2_4  = new Map([ ['a', {}],  ['b',6] ]);
      const m2_5  = new Map([ ['c', 5],   ['b',6] ]);
      const m2_6  = new Map([ [{} , 5],   ['b',6] ]);
      const m2_7  = new Map([ [{} , 5],   ['b',6] ]);
      const m2_8  = new Map([ [obj, 5],   ['b',6] ]);
      const m2_9  = new Map([ [obj, 5],   ['b',6] ]);
      const m2_10 = new Map([ ['a', obj], ['b',6] ]);
      const m2_11 = new Map([ ['a', obj], ['b',6] ]);
      const m2_12 = new Map([ ['b', 6],   ['a',5] ]);
      assert('equal-map-1',  () => h.equalMap(m0,m0_1), true);
      assert('equal-map-2',  () => h.equalMap(m1,m1_1), true);
      assert('equal-map-3',  () => h.equalMap(m2,m2_1), true);
      assert('equal-map-4',  () => h.equalMap(m2_8,m2_9), true);
      assert('equal-map-5',  () => h.equalMap(m2_10,m2_11), true);
      assert('equal-map-6',  () => h.equalMap(m0,m1), false);
      assert('equal-map-7',  () => h.equalMap(m1,m2), false);
      assert('equal-map-8',  () => h.equalMap(m2,m2_2), false);
      assert('equal-map-9',  () => h.equalMap(m2_3,m2_4), false);
      assert('equal-map-10', () => h.equalMap(m2,m2_5), false);
      assert('equal-map-11', () => h.equalMap(m2_6,m2_7), false);
      assert('equal-map-12', () => h.equalMap(m2,m2_12), false);
    }

    //toMap
    {
      const obj = {};
      assert('to-map-1', () => 
             h.equalMap( h.toMap(), new Map() ), true);
      assert('to-map-2', () => 
             h.equalMap( h.toMap('a',5), new Map([ ['a',5] ]) ), true);
      assert('to-map-3', () => 
             h.equalMap( h.toMap('a',5,'b',6), new Map([ ['a',5], ['b',6] ]) ), true);
      assert('to-map-4', () => 
             h.equalMap( h.toMap('a',5,'b',obj), new Map([ ['a',5], ['b',obj] ]) ), true);
      assert('to-map-5', () => 
             h.equalMap( h.toMap(obj,5,'b',6), new Map([ [obj,5], ['b',6] ]) ), true);
      assert.throw('throw-to-map-1', () => h.toMap(1));
      assert.throw('throw-to-map-2', () => h.toMap('a','b','c'));
      assert.throw('throw-to-map-3', () => h.toMap('a','b','a','c'));
      assert.throw('throw-to-map-4', () => h.toMap(0,1,obj,3,obj,4));
    }

    //copyMap
    {
      const obj = {};
      const m0 = new Map();
      const m1 = new Map([ ['a', 5] ]);
      const m2 = new Map([ ['a', 5],   ['b',6] ]);
      const m3 = new Map([ ['a', {}],  ['b',6] ]);
      const m4 = new Map([ [{} , 5],   ['b',6] ]);
      const m5 = new Map([ [obj, 5],   ['b',6] ]);
      const m6 = new Map([ ['a', obj], ['b',6] ]);
      assert('copy-map-0',  () => 
             h.equalMap(h.copyMap(m0), new Map()), true);
      assert('copy-map-1',  () => 
             h.equalMap(h.copyMap(m1), new Map([ ['a', 5] ])), true);
      assert('copy-map-2',  () => 
             h.equalMap(h.copyMap(m2), new Map([ ['a', 5],   ['b',6] ])), true);
      assert('copy-map-3',  () => 
             h.equalMap(h.copyMap(m3), new Map([ ['a', {}],  ['b',6] ])), false);
      assert('copy-map-4',  () => 
             h.equalMap(h.copyMap(m4), new Map([ [{} , 5],   ['b',6] ])), false);
      assert('copy-map-5',  () => 
             h.equalMap(h.copyMap(m5), new Map([ [obj, 5],   ['b',6] ])), true);
      assert('copy-map-6',  () => 
             h.equalMap(h.copyMap(m6), new Map([ ['a', obj], ['b',6] ])), true);
    }

    //keyMap
    {
      const obj = {};
      assert('key-map-1', () => 
             h.equalMap( h.keyMap([]), new Map() ), true);
      assert('key-map-2', () => 
             h.equalMap( h.keyMap(['a']), new Map([ ['a',0] ]) ), true);
      assert('key-map-3', () =>
             h.equalMap( h.keyMap(['a',obj]), new Map([ ['a',0], [obj,1] ]) ), true);
      assert('key-map-4', () =>   
             h.equalMap( h.keyMap([false,true,5]), new Map([ [false,0], [true,1], [5,2] ]) ), true);
      assert('key-map-5', () =>   
             h.equalMap( h.keyMap(['a','b',5]), new Map([ ['a',0], ['b',1], [5,2] ]) ), true);
      assert.throw('throw-key-map-1', () => h.keyMap([5,undefined]));
      assert.throw('throw-key-map-2', () => h.keyMap([null]));
      assert.throw('throw-key-map-3', () => h.keyMap([5,5]));
      assert.throw('throw-key-map-4', () => h.keyMap([0,1,2,1]));
    }

    //polarize
    {
      const obj = {a:5};
      const a0 = [];
      const a1 = [5];
      const a2 = [5,6];
      const a3 = [obj,5,[]];
      assert.each('polarize', [
        [() => h.equalArray(h.polarize(5), [5,true]), true],
        [() => h.equalArray(h.polarize(a1), [5,true]), true],
        [() => h.equalArray(h.polarize(undefined), [undefined,true]), true],
        [() => h.equalArray(h.polarize([undefined]), [undefined,true]), true],
        [() => h.equalArray(h.polarize(obj), [obj,true]), true],
        [() => h.equalArray(h.polarize([obj]), [obj,true]), true],
        [() => h.equalArray(h.polarize([a0]), [a0,true]), true],
        [() => h.equalArray(h.polarize([a2]), [a2,true]), true],
        [() => h.equalArray(h.polarize([a3]), [a3,true]), true],
        [() => h.equalArray(h.polarize(a0), [a0,false]), true],
        [() => h.equalArray(h.polarize(a2), [a2,false]), true],
        [() => h.equalArray(h.polarize(a3), [a3,false]), true]
      ]);
    }

    //simpleRange
    {
      assert('simple-range-1', () => h.equalArray(h.simpleRange(0), []), true);
      assert('simple-range-2', () => h.equalArray(h.simpleRange(1), [0]), true);
      assert('simple-range-3', () => h.equalArray(h.simpleRange(2), [0,1]), true);
      assert('simple-range-4', () => h.equalArray(h.simpleRange(3), [0,1,2]), true);
      assert.throw('throw-simple-range-1', () => h.simpleRange('2'));
      assert.throw('throw-simple-range-2', () => h.simpleRange([2]));
    }

    //fill, fillEW
    {
      assert('fill-1', () => h.equalArray( h.fill(new Array(1), 5), [5] ), true);
      assert('fill-2', () => h.equalArray( h.fill(new Array(2), 'a'), ['a','a']), true);
      assert('fill-3', () => Array.isArray(h.fill([], 5)), true);
      assert('fill-4', () => h.fill([], 5).length, 0);

      assert('fill-ew-1', () => h.equalArray( h.fillEW([4], [5]), [5] ), true);
      assert('fill-ew-2', () => h.equalArray( h.fillEW(new Array(2), [5,'a']), [5,'a'] ), true);
      assert('fill-ew-3', () => Array.isArray(h.fillEW([], [])), true);
      assert('fill-ew-4', () => h.fillEW([], []).length, 0);
      assert.throw('invalid-fill-ew-1', () => h.fillEW(new Array(3), [5,'a']));
    }

    //nni
    {
      assert.each('nni', [
        [() => h.nni(0,3), 0],
        [() => h.nni(2,3), 2],
        [() => h.nni(-1,3), 2],
        [() => h.nni(-3,3), 0],
        [() => h.nni(0,1), 0],
        [() => h.nni(-1,1), 0]
      ]);
      assert.throwEach('throw-nni', [
        () => h.nni(3,3),
        () => h.nni(-4,3),
        () => h.nni('1',3),
        () => h.nni(Infinity,3),
        () => h.nni(1,1),
        () => h.nni(0,0),
        () => h.nni(1,0),
        () => h.nni(-1,0),
      ]);
    }

    //rangeKey
    {
      const e = new Map();    
      assert('range-key-0', () => h.equalArray(h.rangeKey(null, null, e), []), true);
      assert.throw('throw-range-key-0', () => h.rangeKey('a', null, e));
      assert.throw('throw-range-key-1', () => h.rangeKey(null, 'a', e));
      assert.throw('throw-range-key-2', () => h.rangeKey('a', 'a', e));

      const obj = {};    
      const mp = new Map([ ['a',0], [obj,1], [55,2], ['d',3], ['e',4] ]);
      const allKeys = ['a', obj, 55, 'd', 'e'];
      assert('range-key-1', () => h.equalArray(h.rangeKey(null, null, mp), allKeys), true);
      assert('range-key-2', () => h.equalArray(h.rangeKey('a', undefined, mp), allKeys), true);
      assert('range-key-3', () => h.equalArray(h.rangeKey(undefined, 'e', mp), allKeys), true);
      assert('range-key-4', () => h.equalArray(h.rangeKey('a', 55, mp), ['a', obj, 55]), true);
      assert('range-key-5', () => h.equalArray(h.rangeKey(obj, 'd', mp), [obj, 55, 'd']), true);
      assert('range-key-6', () => h.equalArray(h.rangeKey(obj, obj, mp), [obj]), true);
      assert('range-key-7', () => h.equalArray(h.rangeKey('a','a', mp), ['a']), true);
      assert('range-key-8', () => h.equalArray(h.rangeKey('e','e', mp), ['e']), true);
      assert('range-key-9', () => h.equalArray(h.rangeKey('e',null, mp), ['e']), true);
      assert('range-key-10', () => h.equalArray(h.rangeKey(null,'a', mp), ['a']), true);
      assert.throw('throw-range-key-3', () => h.rangeKey('b', null, mp));
      assert.throw('throw-range-key-4', () => h.rangeKey(null, 'b', mp));
      assert.throw('throw-range-key-5', () => h.rangeKey('b', 'b', mp));
      assert.throw('throw-range-key-6', () => h.rangeKey('e','a', mp));
      assert.throw('throw-range-key-7', () => h.rangeKey(55,obj, mp));

      const s = new Map([ ['a',0] ]);
      assert('range-key-11', () => h.equalArray(h.rangeKey('a','a',s), ['a']), true);
      assert('range-key-12', () => h.equalArray(h.rangeKey(null,'a',s), ['a']), true);
      assert('range-key-13', () => h.equalArray(h.rangeKey('a',null,s), ['a']), true);
      assert('range-key-14', () => h.equalArray(h.rangeKey(null,null,s), ['a']), true);
      assert.throw('throw-range-key-8', () => h.rangeKey('b',null,s));
      assert.throw('throw-range-key-9', () => h.rangeKey(null,'b',s));
      assert.throw('throw-range-key-10', () => h.rangeKey('b','b',s));
    }

    //firstKey
    {
      const e = new Map();    
      assert('first-key-0', () => h.equalArray(h.firstKey(0, e), []), true);
      assert('first-key-1', () => h.equalArray(h.firstKey(1, e), []), true);
      assert('first-key-2', () => h.equalArray(h.firstKey(3, e), []), true);

      const s = new Map([ ['a',0] ]);   
      assert('first-key-3', () => h.equalArray(h.firstKey(0, s), []), true);
      assert('first-key-4', () => h.equalArray(h.firstKey(1, s), ['a']), true);
      assert('first-key-5', () => h.equalArray(h.firstKey(3, s), ['a']), true);

      const obj = {};    
      const mp = new Map([ ['a',0], [obj,1], [55,2], ['d',3], ['e',4] ]);
      const allKeys = ['a', obj, 55, 'd', 'e'];
      assert('first-key-6', () => h.equalArray(h.firstKey(0, mp), []), true);
      assert('first-key-7', () => h.equalArray(h.firstKey(1, mp), ['a']), true);
      assert('first-key-8', () => h.equalArray(h.firstKey(3, mp), ['a', obj, 55]), true);
      assert('first-key-9', () => h.equalArray(h.firstKey(5, mp), allKeys), true);
      assert('first-key-10', () => h.equalArray(h.firstKey(7, mp), allKeys), true);
    }

    //rangeInd
    {
      assert('range-ind-0', () => h.equalArray(h.rangeInd(0,0), [0]), true);
      assert('range-ind-1', () => h.equalArray(h.rangeInd(3,3), [3]), true);
      assert('range-ind-2', () => h.equalArray(h.rangeInd(0,1), [0,1]), true);
      assert('range-ind-3', () => h.equalArray(h.rangeInd(3,4), [3,4]), true);
      assert('range-ind-4', () => h.equalArray(h.rangeInd(0,2), [0,1,2]), true);
      assert('range-ind-5', () => h.equalArray(h.rangeInd(3,5), [3,4,5]), true);

      assert.throw('throw-range-ind-0', () => h.rangeInd(0,-1));
      assert.throw('throw-range-ind-1', () => h.rangeInd(3,2));
    }

    //indInd
    {
      assert('ind-ind-0', () => h.equalArray(h.indInd([0],1), [0]), true);
      assert('ind-ind-1', () => h.equalArray(h.indInd([0,1,2],3), [0,1,2]), true);
      assert('ind-ind-2', () => h.equalArray(h.indInd([-3,1,0,2],3), [0,1,0,2]), true);
      assert('ind-ind-3', () => h.equalArray(h.indInd([],0), []), true);
      assert('ind-ind-4', () => h.equalArray(h.indInd([],1), []), true);
      assert('ind-ind-5', () => h.equalArray(h.indInd([],3), []), true);

      assert.throw('throw-ind-ind-0', () => h.indInd([0],0));
      assert.throw('throw-ind-ind-1', () => h.indInd([1],0));
      assert.throw('throw-ind-ind-2', () => h.indInd([-1],0));
      assert.throw('throw-ind-ind-3', () => h.indInd([3],3));
    }

    //keyInd
    {
      const obj = {};    
      const mp = new Map([ ['a',0], [obj,1], [55,2], ['d',3], ['e',4] ]);
      const allKeys = ['a', obj, 55, 'd', 'e'];
      assert('key-ind-0', () => h.equalArray(h.keyInd(allKeys,mp), [0,1,2,3,4]), true);
      assert('key-ind-1', () => h.equalArray(h.keyInd(allKeys.slice(0).reverse(),mp), [4,3,2,1,0]), true);
      assert('key-ind-2', () => h.equalArray(h.keyInd([],mp), []), true);
      assert('key-ind-3', () => h.equalArray(h.keyInd([55,obj,obj,55],mp), [2,1,1,2]), true);
      assert.throw('throw-key-ind-0', () => h.keyInd(['b'],mp));

      const e = new Map(); 
      assert('key-ind-4', () => h.equalArray(h.keyInd([],e), []), true);
      assert.throw('throw-key-ind-1', () => h.keyInd(['b'], e));
    }

  });
  
  runTests('native mutators', () => {
   
    const a = [5,6,7];
    a.copyWithin(0,1);
    assert('native-copyWithin-0', () => h.equalArray(a, [6,7,7]), true);
    a.fill(8);
    assert('native-fill-0', () => h.equalArray(a, [8,8,8]), true);
    a.pop();
    assert('native-pop-0', () => h.equalArray(a, [8,8]), true);
    a.push(9);
    assert('native-push-0', () => h.equalArray(a, [8,8,9]), true);
    a.reverse();
    assert('native-reverse-0', () => h.equalArray(a, [9,8,8]), true);
    a.shift();
    assert('native-shift-0', () => h.equalArray(a, [8,8]), true);
    a[0] = 9;
    a.sort();
    assert('native-sort-0', () => h.equalArray(a, [8,9]), true);
    a.splice(0,1);
    assert('native-splice-0', () => h.equalArray(a, [9]), true);
    a.unshift(10);
    assert('native-unshift-0', () => h.equalArray(a, [10,9]), true);
    
    const c = [5,6,7].toCube();
    c.copyWithin(0,1);
    assert('native-copyWithin-1', () => h.equalArray(c, [6,7,7]), true);
    assert('native-copyWithin-2', () => c._data_cube, undefined);
    c.toCube();
    c.fill(8);
    assert('native-fill-1', () => h.equalArray(c, [8,8,8]), true);
    assert('native-fill-2', () => c._data_cube, undefined);
    c.toCube();
    c.pop();
    assert('native-pop-1', () => h.equalArray(c, [8,8]), true);
    assert('native-pop-2', () => c._data_cube, undefined);
    c.toCube();
    c.push(9);
    assert('native-push-1', () => h.equalArray(c, [8,8,9]), true);
    assert('native-push-2', () => c._data_cube, undefined);
    c.toCube();
    c.reverse();
    assert('native-reverse-1', () => h.equalArray(c, [9,8,8]), true);
    assert('native-reverse-2', () => c._data_cube, undefined);
    c.toCube();
    c.shift();
    assert('native-shift-1', () => h.equalArray(c, [8,8]), true);
    assert('native-shift-2', () => c._data_cube, undefined);
    c.toCube();
    c[0] = 9;
    c.sort();
    assert('native-sort-1', () => h.equalArray(c, [8,9]), true);
    assert('native-sort-2', () => c._data_cube, undefined);
    c.toCube();
    c.splice(0,1);
    assert('native-splice-1', () => h.equalArray(c, [9]), true);
    assert('native-splice-2', () => c._data_cube, undefined);
    c.toCube();
    c.unshift(10);
    assert('native-unshift-1', () => h.equalArray(c, [10,9]), true);
    assert('native-unshift-2', () => c._data_cube, undefined);
      
  });
  
  runTests('compare', () => {
  
    //these tests use cubes made 'from scratch' (i.e. no cube
    //methods) since compare is used to test all other cube methods
    const baseArray = [5, 'abc', false, {}, [6]];
    const a0 = [];
    const a1 = [5];
    const a = baseArray.slice();
    const aCopy = baseArray.slice();
    const v0 = [];
    v0._data_cube = true;
    v0._s = [0,1,1];
    const v1 = [5];
    v1._data_cube = true;
    v1._s = [1,1,1];
    const v = baseArray.slice();
    v._data_cube = true;
    v._s = [5,1,1];
    const vCopy = baseArray.slice();
    vCopy._data_cube = true;
    vCopy._s = [5,1,1];
    const ve = baseArray.slice();
    ve._data_cube = true;
    ve._s = [5,1,1];
    ve._k = [ h.toMap('a',0,'b',1,'c',2,'d',3,'e',4), undefined, undefined ];
    ve._l = ['rows', undefined, undefined];
    const m = [10,11,12,13,14,15];
    m._data_cube = true;
    m._s = [2,3,1];
    const me = [10,11,12,13,14,15];
    me._data_cube = true;
    me._s = [2,3,1];
    me._k = [ undefined, h.toMap('a',0,'b',1,'c',2), undefined ];
    me._l = ['rows', 'columns', undefined];
    const b = [10,11,12,13,14,15];
    b._data_cube = true;
    b._s = [1,2,3];
    const be = [10,11,12,13,14,15];
    be._data_cube = true;
    be._s = [1,2,3];
    be._k = [ undefined, undefined, h.toMap('a',0,'b',1,'c',2) ];
    be._l = ['rows', undefined, 'pages'];
    
    assert.cube('compare-check-1', v0);
    assert.cube('compare-check-2', v1);
    assert.cube('compare-check-3', v);
    assert.cube('compare-check-4', vCopy);
    assert.cube('compare-check-5', ve);
    assert.cube('compare-check-6', m);
    assert.cube('compare-check-7', me);
    assert.cube('compare-check-8', b);
    assert.cube('compare-check-9', be);
        
    test.throw('throw-compare-array-scaler', a, 5);
    test.throw('throw-compare-vector-scaler', v, 5);
    test.throw('throw-compare-vector-dict', v, ve);
    test.throw('throw-compare-matrix-extras', m, me);
    test.throw('throw-compare-book-extras', b, be);
    test.throw('throw-compare-shape-1', a1, [5,5]);
    test.throw('throw-compare-shape-2', [5,5], a1);
    test.throw('throw-compare-shape-3', v1, [5,5]);
    test.throw('throw-compare-shape-4', [5,5], v1);
    test.throw('throw-compare-shape-5', m, b);
    test.throw('throw-compare-entry-1', a1, [6]);
    test.throw('throw-compare-entry-2', v1, [6]);
        
    test('compare-empty-arrays', a0, []);
    test('compare-1-entry-arrays', a1, [5]);
    test('compare-same-arrays', a, aCopy);
    test('compare-same-reference', be, be);
    test('compare-empty-array-vector', a0, v0);
    test('compare-empty-vector-array', v0, a0);
    test('compare-1-entry-vector-array', v1, a1);
    test('compare-1-entry-array-vector', a1, v1);
    test('compare-array-vector', a, v);
    test('compare-vector-array', v, a);
    
    assert('compare-test-1', () => v.compare(a,false), v);
    assert('compare-test-2', () => v.compare(a,[false]), v);
    assert('compare-test-3', () => v.compare(ve,[false]), false);
    assert.throw('throw-compare-test', () => v.compare(a,[false,false]));
    
    aCopy[3] = {}; //same as before, but now not referencing same object as a[3]
    vCopy[3] = {};
    test.throw('throw-compare-array-array', a, aCopy);
    test.throw('throw-compare-vector-vector', v, vCopy);
    
    v._l = ['rows', undefined, undefined];  //still missing row keys
    test.throw('throw-compare-dict-dict-1', v, ve);
    test.throw('throw-compare-dict-dict-2', ve, v);
    v._k = [ h.toMap('a',0,'b',1,'c',2,'dd',3,'e',4), undefined, undefined ];  //key dd is wrong
    test.throw('throw-compare-dict-dict-3', v, ve);
    test.throw('throw-compare-dict-dict-4', ve, v);
    v._k[0] = h.toMap('a',0,'b',1,'c',2,'d',3,'e',4);
    test('compare-dict-dict-1', v, ve);
    test('compare-dict-dict-2', ve, v);
    
    m._k = [ undefined, h.toMap('a',0,'b',1,'c',2), undefined ];
    m._l = ['rows', undefined, undefined];  //still missing column label
    test.throw('throw-compare-matrix-matrix-1', m, me);
    test.throw('throw-compare-matrix-matrix-2', me, m);
    m._l[1] = 'columns';
    test('compare-matrix-matrix-1', m, me);
    test('compare-matrix-matrix-2', me, m);

    b._k = [ undefined, undefined, h.toMap('a',0,'b',1,'c',2) ];
    b._l = ['rows', undefined, 'paGes'];  //'G' should not be uppercase
    test.throw('throw-compare-book-book-1', b, be);
    test.throw('throw-compare-book-book-2', be, b);
    b._l[2] = 'pages';
    test('compare-book-book-1', b, be);
    test('compare-book-book-2', be, b);   
  });
  
  runTests('dc', () => {
  
    const e = [];
    test('dc-1', dc(e), []);
    assert.cube('dc-2', e);
    
    const s = dc(5);
    test('dc-3', s, [5]);
    assert.cube('dc-4', s);
    
    const t = [5];
    test('dc-5', dc(t), [5]);
    assert.cube('dc-6', t);
    
    const obj = {};
    const a = [5,obj,6];
    test('dc-7', dc(a), [5,obj,6]);
    assert.cube('dc-8', a);
    
    test('dc-9', dc(), [undefined]);
    assert.cube('dc-10', dc());
  
    const c = dc([2,3,4,5,6,7].$shape([2,3]).$key(0, ['a','b']));
    test('dc-11', c, [2,3,4,5,6,7].$shape([2,3]).$key(0, ['a','b']));
    assert.cube('dc-12', c);

  });
  
  runTests('cube', () => {
  
    assert.throw('throw-cube-too-many-entries', () => [6,7,8,9].cube());
    assert.throw('throw-cube-neg', () => (-1).cube());
    assert.throw('throw-cube-non-int-1', () => [0,2.3].cube());
    assert.throw('throw-cube-non-int-2', () => ['a',4].cube());
    assert.throw('throw-cube-non-int-3', () => [1,{}].cube());
    assert.throw('throw-cube-non-int-4', () => [4,NaN,2].cube());
    assert.throw('throw-cube-non-int-5', () => [4,Infinity,2].cube());
    assert.throw('throw-cube-non-int-6', () => [4,'3',2].cube());
    assert.throw('throw-cube-non-int-7', () => [4,[3],2].cube());
    assert.throw('throw-cube-shape-mismatch-1', () => [4].cube([5,6,7]));
    assert.throw('throw-cube-shape-mismatch-2', () => [4,2].cube([5,6,7]));
    
    assert.throw('throw-cube-dc-too-many-entries', () => dc.cube([6,7,8,9]));
    assert.throw('throw-cube-dc-non-int', () => dc.cube([1,{}]));
    assert.throw('throw-cube-dc-shape-mismatch', () => dc.cube([4,2], [5,6,7]));
    
    const obj = {a:5};
    const a = [5,obj];
    const a_1 = [undefined];

    const s = [].cube(); 
    assert.each('cube-1-entry-0', [
      [() => assert.cube(s), undefined],
      [() => h.equalArray(s, [undefined]), true],
      [() => h.equalArray(s._s, [1,1,1]), true]
    ]);
    const s_1 = [1].cube(5);  
    assert.each('cube-1-entry-1', [
      [() => assert.cube(s_1), undefined],
      [() => h.equalArray(s_1, [5]), true],
      [() => h.equalArray(s_1._s, [1,1,1]), true]
    ]);
    const e = [0].cube();
    assert.each('cube-empty-vector', [
      [() => assert.cube(e), undefined],
      [() => h.equalArray(e, []), true],
      [() => h.equalArray(e._s, [0,1,1]), true]
    ]);
    const v = [2].cube();
    assert.each('cube-vector-0', [
      [() => assert.cube(v), undefined],
      [() => h.equalArray(v, [undefined,undefined]), true],
      [() => h.equalArray(v._s, [2,1,1]), true]
    ]);
    const v_1 = [2].cube(5);
    assert.each('cube-vector-1', [
      [() => assert.cube(v_1), undefined],
      [() => h.equalArray(v_1, [5,5]), true],
      [() => h.equalArray(v_1._s, [2,1,1]), true]
    ]);
    const v_2 = [2].cube(a);
    assert.each('cube-vector-2', [
      [() => assert.cube(v_2), undefined],
      [() => h.equalArray(v_2, [5,obj]), true],
      [() => h.equalArray(v_2._s, [2,1,1]), true]
    ]);
    const v_3 = [2].cube([a]);
    assert.each('cube-vector-3', [
      [() => assert.cube(v_3), undefined],
      [() => h.equalArray(v_3, [a,a]), true],
      [() => h.equalArray(v_3._s, [2,1,1]), true]
    ]);
    const v_4 = [2].cube([a_1]);
    assert.each('cube-vector-4', [
      [() => assert.cube(v_4), undefined],
      [() => h.equalArray(v_4, [a_1,a_1]), true],
      [() => h.equalArray(v_4._s, [2,1,1]), true]
    ]);
    const v_5 = [2].cube(a_1);
    assert.each('cube-vector-5', [
      [() => assert.cube(v_5), undefined],
      [() => h.equalArray(v_5, [undefined,undefined]), true],
      [() => h.equalArray(v_5._s, [2,1,1]), true]
    ]);
    const m = [0,3].cube();
    assert.each('cube-matrix-0', [
      [() => assert.cube(m), undefined],
      [() => h.equalArray(m, []), true],
      [() => h.equalArray(m._s, [0,3,1]), true]
    ]);
    const m_1 = [2,3].cube([4,5,6,7,8,9]);
    assert.each('cube-matrix-1', [
      [() => assert.cube(m_1), undefined],
      [() => h.equalArray(m_1, [4,5,6,7,8,9]), true],
      [() => h.equalArray(m_1._s, [2,3,1]), true]
    ]);
    const b = [,undefined,3].cube([4,5,6]);
    assert.each('cube-book-0', [
      [() => assert.cube(b), undefined],
      [() => h.equalArray(b, [4,5,6]), true],
      [() => h.equalArray(b._s, [1,1,3]), true]
    ]);
    const b_1 = [2,3,2].cube(true);
    assert.each('cube-book-1', [
      [() => assert.cube(b_1), undefined],
      [() => h.equalArray(b_1, (new Array(12)).fill(true)), true],
      [() => h.equalArray(b_1._s, [2,3,2]), true]
    ]);
    
    const noArg_dc = dc.cube(); 
    assert.each('cube-dc-no-arg', [
      [() => assert.cube(noArg_dc), undefined],
      [() => h.equalArray(noArg_dc, [undefined]), true],
      [() => h.equalArray(noArg_dc._s, [1,1,1]), true]
    ]);
    const s_dc = dc.cube([]);
    assert.each('cube-dc-empty-shape', [
      [() => assert.cube(s_dc), undefined],
      [() => h.equalArray(s_dc, [undefined]), true],
      [() => h.equalArray(s_dc._s, [1,1,1]), true]
    ]);
    const a_dc = dc.cube(3,[4,5,6]); 
    assert.each('cube-dc-non-array', [
      [() => assert.cube(a_dc), undefined],
      [() => h.equalArray(a_dc, [4,5,6]), true],
      [() => h.equalArray(a_dc._s, [3,1,1]), true]
    ]);
    const b_1_dc = dc.cube([2,3,2], true);
    assert.each('cube-dc-book', [
      [() => assert.cube(b_1_dc), undefined],
      [() => h.equalArray(b_1_dc, (new Array(12)).fill(true)), true],
      [() => h.equalArray(b_1_dc._s, [2,3,2]), true]
    ]);
  });
  
  runTests('rand', () => {

    //basic tests; most work handled by cube()
    const a = [10].rand();
    assert('rand-1', () => Math.min(...a) >= 0, true);
    assert('rand-2', () => Math.max(...a) < 1, true);
    assert('rand-3', () => [10].rand(1).every(v => v === 0 || v === 1), true);
    assert('rand-4', () => [10].rand(true).every(v => v === 0 || v === 1), true);
    assert('rand-5', () => [20].rand([3])
      .every(v => v === 0 || v === 1 || v === 2 || v === 3), true);
    assert('rand-6', () => [20].rand(['3'])
      .every(v => v === 0 || v === 1 || v === 2 || v === 3), true);
    
    assert.throw('throw-rand-invalid-max-1', () => [2].rand(0));
    assert.throw('throw-rand-invalid-max-2', () => [2].rand(-1));
  
    const a_dc = dc.rand(10);
    assert('rand-dc-1', () => Math.min(...a_dc) >= 0, true);
    assert('rand-dc-2', () => Math.max(...a_dc) < 1, true);
    assert('rand-dc-3', () => h.equalArray(a_dc._s, [10,1,1]), true);
  });
  
  runTests('normal', () => {
  
    //basic tests; most work handled by cube()
    const a = [20].normal();
    const b = [20].normal(500,'10');
    assert('normal-1', () => Math.min(...a) > -10, true);
    assert('normal-2', () => Math.max(...a) < 10, true);
    assert('normal-3', () => Math.min(...b) > 400, true);
    assert('normal-4', () => Math.max(...b) < 600, true);
    
    assert.throw('throw-normal-invalid-std-dev', () => [20].normal(5,-2));
    
    const b_dc = dc.normal([4,5],500,10);
    assert('normal-dc-1', () => Math.min(...b_dc) > 400, true);
    assert('normal-dc-2', () => Math.max(...b_dc) < 600, true);
    assert('normal-dc-3', () => h.equalArray(b_dc._s, [4,5,1]), true);
  });
  
  runTests('copy', () => {
  
    const e = [];
    assert('copy-empty-0', () => e.copy('array')._data_cube, undefined);
    test('copy-empty-1', e.copy('array'), []);
    assert.cube('copy-empty-2', e.copy());
    test('copy-empty-3', e.copy(), []);
    assert.cube('copy-empty-4', e.copy('core'));
    test('copy-empty-5', e.copy('core'), []);
    assert.cube('copy-empty-6', e.copy('shell'));
    test('copy-empty-7', e.copy('shell'), []);
    
    assert.cube('copy-dc-empty-0', dc.copy(e));
    test('copy-dc-empty-1', dc.copy(e), []);
    
    const dt = new Date();
    const a = [5,6]
      .$key(0,['a',dt])
      .$label(0,'row')
      .$label(2,'page');
    assert('copy-array-0', () => a.copy('array')._data_cube, undefined);
    test('copy-array-1', a.copy('array'), [5,6]);
    assert.cube('copy-array-2', a.copy('full'));
    test('copy-array-3', a.copy('full'),
      [5,6].$key(0,['a',dt]).$label(0,'row').$label(2,'page'));
    assert.cube('copy-array-4', a.copy('core'));
    test('copy-array-5', a.copy('core'),
      [5,6]);
    assert.cube('copy-array-6', a.copy('shell'));
    test('copy-array-7', a.copy('shell'),
      [,,].$key(0,['a',dt]).$label(0,'row').$label(2,'page'));
    test.throw('throw-copy-array', a.copy('shell'),
      [,,].$key(0,['a', new Date(+dt)]).$label(0,'row').$label(2,'page'));
    
    assert('copy-dc-array-0', () => dc.copy(a,'array')._data_cube, undefined);
    test('copy-dc-array-1', dc.copy(a,'array'), [5,6]);
    assert.cube('copy-dc-array-2', dc.copy(a,'full'));
    test('copy-dc-array-3', dc.copy(a,'full'),
      [5,6].$key(0,['a',dt]).$label(0,'row').$label(2,'page'));
    
    const obj = {};
    const b = [4,5,6,obj,7,8]
      .$shape([1,2,3])
      .$key(1,['a','b'])
      .$key(2,['A','B','C']);
    assert('copy-book-0', () => b.copy('array')._data_cube, undefined);
    test('copy-book-1', b.copy('array'), [4,5,6,obj,7,8]);
    assert.cube('copy-book-2', b.copy('full'));
    test('copy-book-3', b.copy('full'),
      [4,5,6,obj,7,8].$shape([1,2,3]).$key(1,['a','b']).$key(2,['A','B','C']));
    assert.cube('copy-book-4', b.copy('core'));
    test('copy-book-5', b.copy('core'),
      [4,5,6,obj,7,8].$shape([1,2,3]));
    test.throw('throw-copy-book', b.copy('core'),
      [4,5,6,{},7,8].$shape([1,2,3]));
    assert.cube('copy-book-6', b.copy('shell'));
    test('copy-book-7', b.copy('shell'),
      (new Array(6)).$shape([1,2,3]).$key(1,['a','b']).$key(2,['A','B','C']));
    
    test('copy-dc-book-0', dc.copy(b,'full'),
      [4,5,6,obj,7,8].$shape([1,2,3]).$key(1,['a','b']).$key(2,['A','B','C']));
    assert.cube('copy-dc-book-1', dc.copy(b,'full'));
    test('copy-dc-book-2', dc.copy(b,'core'), [4,5,6,obj,7,8].$shape([1,2,3]));
    assert.cube('copy-dc-book-3', dc.copy(b,'core'));
    
    test('copy-dc-no-args-0', dc.copy(), [undefined]);
    assert.cube('copy-dc-no-args-1', dc.copy());
    
    test('copy-dc-non-array-0', dc.copy(5), [5]),
    assert.cube('copy-dc-non-array-1', dc.copy(5));
    test('copy-dc-non-array-2', dc.copy(5,'array'), [5]),
    assert('copy-dc-non-array-3', () => dc.copy(5,'array')._data_cube, undefined);
        
    assert.throw('throw-copy-non-singleton', () => [4,5].copy(['full','core']));
    assert.throw('throw-copy-invalid-ret-0', () => [4,5].copy([['full']]));
    assert.throw('throw-copy-invalid-ret-1', () => [4,5].copy('ful'));
    assert.throw('throw-dc-copy-invalid-ret', () => dc.copy([4,5],'ful'));
  });
  
  runTests('shape', () => {

    assert('shape-array-1', () => h.equalArray([].shape(), [0,1,1]), true);
    assert('shape-array-2', () => h.equalArray([5].shape(), [1,1,1]), true);
    assert('shape-array-3', () => h.equalArray([5,6].shape(), [2,1,1]), true);
    assert('shape-empty-1', () => h.equalArray([0].cube().shape(), [0,1,1]), true);
    assert('shape-empty-2', () => h.equalArray([1,0,5].cube().shape(), [1,0,5]), true);
    assert('shape-empty-3', () => h.equalArray([,,0].cube().shape(), [1,1,0]), true);
    assert('shape-vector', () => h.equalArray([3].cube().shape(), [3,1,1]), true);
    assert('shape-matrix', () => h.equalArray([2,4].cube().shape(), [2,4,1]), true);
    assert('shape-book', () => h.equalArray([4,3,2].cube().shape(), [4,3,2]), true);
  
  });
  
  runTests('$shape', () => {
  
    const x = [12].cube();
    const y = [0].cube();

    assert.throw('throw-$shape-invalid-new-shape-1', () => x.$shape([6,2,1,1]));
    assert.throw('throw-$shape-invalid-new-shape-2', () => x.$shape(-12));
    assert.throw('throw-$shape-invalid-new-shape-3', () => x.$shape([6,3.4,2])); 
    assert.throw('throw-$shape-invalid-new-shape-4', () => x.$shape([6,'1',2]));
    assert.throw('throw-$shape-invalid-new-shape-5', () => x.$shape([[12]]));
    assert.throw('throw-$shape-invalid-new-shape-6', () => y.$shape([false])); 
    assert.throw('throw-$shape-invalid-new-shape-7', () => y.$shape(false));
    assert.throw('throw-$shape-diff-number-entries-1', () => x.$shape(0));
    assert.throw('throw-$shape-diff-number-entries-2', () => x.$shape([1,5]));
    assert.throw('throw-$shape-diff-number-entries-3', () => x.$shape(5));
    assert.throw('throw-$shape-diff-number-entries-4', () => x.$shape([2,6,3]));
    assert.throw('throw-$shape-diff-number-entries-5', () => y.$shape([1,1,1]));
    assert.throw('throw-$shape-diff-number-entries-6', () => y.$shape([2,3,1]));
    
    test('$shape-1', x.$shape([2,3,2]), [2,3,2].cube());
    test('$shape-2', x.$shape(), [12].cube());
    test('$shape-3', x.$shape([1,1]), [1,1,12].cube());
    test('$shape-4', x.$shape([1]), [1,12].cube());
    test('$shape-5', x.$shape([3,2]), [3,2,2].cube());
    test('$shape-6', x.$shape(6), [6,2,1].cube());
    test('$shape-7', x.$shape([6]), [6,2,1].cube());
    test('$shape-8', x.$shape(), [12].cube());
    test('$shape-9', y.$shape(50), [50,0,1].cube());
    test('$shape-10', y.$shape([2]), [2,0,1].cube());
    test('$shape-11', y.$shape([4,5]), [4,5,0].cube());
    test('$shape-12', y.$shape([undefined]), [0,1,1].cube());
    test('$shape-13', y.$shape(undefined), [0,1,1].cube());
    test('$shape-14', y.$shape(), [0,1,1].cube());
    test('$shape-15', y.$shape(0), [0,1,1].cube());
    test('$shape-16', y.$shape(), [0,1,1].cube());
    test('$shape-17', y.$shape([2,0,3]), [2,0,3].cube());
    assert('$shape-same-length-1', () => x.length, 12);
    assert('$shape-same-length-2', () => y.length, 0);
  });

  runTests('$$shape', () => {
  
    test('$$shape-0',
      [3,4,5,6,7,8].$key(1,'a').$$shape(s => s[0]/2),
      [3,4,5,6,7,8].$shape(3)
    );
    test('$$shape-1',
      [3,4,5,6,7,8].$$shape(s => 1),
      [3,4,5,6,7,8].tp()
    );

    let x = [5,6,7];
    x.$$shape( (shp, y) => {
      test('$$shape-calling-array', y, x);
      return;
    });

    assert.throw('throw-$$shape-not-function',
      () => [3,4,5,6].$$shape(2)
    );

    x = [3,4,5,6,7,8];
    assert.throw('throw-$$shape-not-singleton',
      () => x.$$shape([2,3])
    );
    assert('$$shape-converts-to-cube-on-fail',
      () => x._data_cube,
      true
    );
  });
  
  runTests('label, $label', () => {

    const obj = {a:5};
    const e = [].$label(1,'columns');
    const m = [5,6].cube()
      .$label(0,1)  //label on dim 0 will be '1'
      .$label(1,'columns')
      .$label([2],obj);
    
    assert.throwEach('throw-label', [
      () => e.label(3),
      () => e.label([1,2]),
      () => e.$label('1','a'),
      () => e.$label(1,['a','b']),
      () => e.$label(''),
      () => e.$label(1,''),
      () => e.$label(1,[null,null]),
    ]);
  
    assert.each('label-1', [
      [() => assert.cube(e), undefined],
      [() => h.equalArray(e._l, [,'columns',,]), true],
      [() => e.label(), null],
      [() => e.label(1), 'columns'],
      [() => e.label(1,10,20), 'columns'],
      [() => e.label(2), null]      
    ]);
  
    assert.each('label-2', [
      [() => assert.cube(m), undefined],
      [() => h.equalArray(m._l, ['1','columns','' + obj]), true],
      [() => m.label(), '1'],
      [() => m.label(1), 'columns'],
      [() => m.label(2), '' + obj]
    ]);
    
    e.$label(1,null);
    m.$label(1,undefined)
     .$label([2], [null]);
    m.$label(2,'pages');
    assert.each('label-3', [
      [() => e.label(0), null],
      [() => e.label(1), null],
      [() => e.label(2), null],
      [() => m.label(), '1'],      
      [() => m.label(1), null],      
      [() => m.label(2), 'pages'],  
    ]);
    m.$label();
    assert.each('label-4', [
      [() => h.equalArray(m._l, [,,'pages']), true],      
      [() => m.label(), null],      
      [() => m.label(1), null],      
      [() => m.label(2), 'pages'],  
    ]);
    m.$label(2);
    assert.each('label-5', [
      [() => m._l, undefined],
      [() => m.label(0), null],      
      [() => m.label(1), null],      
      [() => m.label(2), null],  
    ]); 
    
  });

  runTests('$$label', () => {
  
    const x = [3,4].$label(0, 'r');
    test('$$label-0',
      x.$$label(0, lab => lab + 'ows'),
      [3,4].$label(0, 'rows')
    );

    const y = [3,4].$$label([1], lab => lab + '!');
    assert('$$label-1',
      () => y.label(1),
      'null!'
    );

    const z = [5,6];
    z.$$label(0, (lab, zz) => {
      test('$$label-calling-array', zz, z);
      return;
    });

    assert.throw('throw-$$label-invalid-dim',
      () => [3,4].$$label(3, () => 'the label')
    );
  });
   
  runTests('key, $key', () => {

    const obj = {a:5};
    const e = []
      .$key(0,[])
      .$key(1,'a')
      .$key(2,'b')
    const v = [5,6]
      .$key(0,['a',obj]);
    const b = [2,3,4].cube()
      .$key(0,[obj,'' + obj])
      .$key(2,['a','b',true,false])
      .$key(1,[10,20,30]);
    
    assert.throwEach('throw-key', [
      () => e.key(3),
      () => e.key([1,2]),
      () => e.$key('1','a'),
      () => e.$key('a'),
      () => e.$key(0,'a'),
      () => b.$key(1,['a']),
      () => b.$key(1,[5,6,7,8]),
      () => b.$key(1,[undefined,6,7]),
      () => b.$key(1,[6,undefined,7]),
      () => b.$key(1,[null,6,7]),
      () => b.$key(1,[6,null,7]),
      () => b.$key(1,[5,6,null]),  
      () => b.$key(1,[6,6,7]),
      () => b.$key(1,[5,6,7,6]),
      () => b.$key(0,[null,null]),
    ]);

    assert.each('key-1', [
      [() => assert.cube(e), undefined],
      [() => h.equalArray(e.key(), []), true],
      [() => h.equalArray(e.key(1), ['a']), true],
      [() => h.equalArray(e.key(2), ['b']), true]
    ]);
    
    assert.each('key-2', [
      [() => assert.cube(v), undefined],
      [() => h.equalArray(v.key([undefined]), ['a',obj]), true],
      [() => v.key(1), null],
      [() => v.key(2), null]
    ]);
    
    assert.each('key-3', [
      [() => assert.cube(b), undefined],
      [() => h.equalArray(b.key(0), [obj,'' + obj]), true],
      [() => h.equalArray(b.key(1), [10,20,30]), true],
      [() => h.equalArray(b.key(2), ['a','b',true,false]), true]
    ]);
    
    assert.each('key-4', [
      [() => [].key(), null],
      [() => [].key(1), null],
      [() => [].key(2), null]
    ]);
    
    e.$key()
     .$key(1,[null])
     .$key([2],null)
    v.$key(0,undefined)
     .$key(1,'col-0');
    b.$key(1)
    assert.each('key-5', [
      [() => e.key(), null],
      [() => e.key(1), null],
      [() => e.key(2), null],
      [() => v.key(0), null],
      [() => h.equalArray(v.key(1), ['col-0']), true],
      [() => v.key(2), null],
      [() => h.equalArray(b.key(0), [obj,'' + obj]), true],
      [() => b.key(1), null],
      [() => h.equalArray(b.key(2), ['a','b',true,false]), true]
    ]);

  });

  runTests('$$key', () => {

    let x = [3,4].$key(0, ['a','b']);
    test('$$key-0',
      x.$$key(undefined, K => K.add('!')),
      [3,4].$key(0, ['a!','b!'])
    );

    x = [3,4,5,6,7,8]
      .$shape([2,1,3])
      .$key(2, ['a','b','c'])
      .$$key(2, K => K.flip());
    test('$$key-1',
      x.key(2),
      ['c','b','a']
    );

    x = [3,4];
    test('$$key-2',
      x.$$key(0, K => K),  //K is null
      [3,4]
    );

    x = [3,4];
    x.$$key(0, (k, xx) => {
      test('$$key-calling-array', xx, x);
      return;
    });

    x = [3,4].tp();
    assert.throw('throw-$$key-function-error',
      () => x.$$key(1, K => K.add('!'))  //add is not a property of null
    );
    test('$$key-unchanged-0',
      x,
      [3,4].tp()
    );

    x = [3,4].$key(0, ['u','v']);
    assert.throw('throw-$$key-shape-mismatch',
      () => x.$$key(0, () => ['a','b','c'])
    );
    test('$$key-unchanged-1',
      x,
      [3,4].$key(0, ['u','v'])
    );
  });

  runTests('n', () => {
    const b = [4,3,5].cube();
    assert('n-1', () => [].n(),  0);
    assert('n-2', () => [].n(0), 0);
    assert('n-3', () => [].n(1), 1);
    assert('n-4', () => [].n(2), 1);
    assert('n-5', () => b.n(),  4);
    assert('n-6', () => b.n(0), 4);
    assert('n-7', () => b.n(1), 3);
    assert('n-8', () => b.n(2), 5);
  });
  
  runTests('hasKey', () => {
 
    assert.each('has-key-1', [
      [() => [].hasKey(), false],
      [() => [].hasKey(1), false],
      [() => [].hasKey(2), false],
      [() => [].hasKey(0,'a'), false],
      [() => [].hasKey(1,'a'), false],
      [() => [].hasKey(2,'a'), false],
    ]);
    assert.throw('throw-has-key-1', () => [].hasKey('a'));
    
    const obj = {a:5};
    const b = [2,3,4].cube()
      .$key(0,[obj,'' + obj])
      .$key(2,['a','b',true,false]);
    assert.each('has-key-2', [
      [() => b.hasKey(), true],
      [() => b.hasKey(0,obj), true],
      [() => b.hasKey(undefined,obj), true],
      [() => b.hasKey(0,''+obj), true],
      [() => b.hasKey(0,{a:5}), false],
      [() => b.hasKey(0,'a'), false],
      [() => b.hasKey(1), false],
      [() => b.hasKey(1,'a'), false],
      [() => b.hasKey(2), true],
      [() => b.hasKey(2,'a'), true],
      [() => b.hasKey(2,false), true],
      [() => b.hasKey(2,true), true],      
      [() => b.hasKey(2,'A'), false]
    ]);
    assert.throw('throw-has-key-2', () => b.hasKey(2,['a','b']));

    const e = [].$key(0,[]);
    assert.each('has-key-3', [
      [() => e.hasKey(), true],
      [() => e.hasKey(0,undefined), true],
      [() => e.hasKey(0,'a'), false],
    ]);
  });
  
  runTests('subcubes', () => {

    //empty array
    const e = [];
    test('subcube-empty-array-0', e.subcube(), []);
    test('subcube-empty-array-1', e.subcube(null, 0, 0) , []);
    test('$subcube-empty-array-0', e.$subcube([], null, null, 5) , []);
    test('$subcube-empty-array-1', e.$subcube([], 0, 0, 5) , []);
    test('$subcube-empty-array-2', e.$subcube(null, null, null, 5) , []);
    test('$subcube-empty-array-3', e.$subcube(), []);
    
    test('row-empty-array-0', e.row(), []);
    test('row-empty-array-1', e.row(null), []);
    test('$row-empty-array-0', e.$row(null, 5), []);
    test('$row-empty-array-1', e.$row([],[]), []);
    test('$row-empty-array-2', e.$row(), []);
    
    test('col-empty-array-0', e.col(), []);
    test('col-empty-array-1', e.col(0), []);
    test('$col-empty-array-0', e.$col(null, 5), []);
    test('$col-empty-array-1', e.$col(0, []), []);
    test('$col-empty-array-2', e.$col(), []);
    
    test('page-empty-array-0', e.page(null), []);
    test('page-empty-array-1', e.page(0), []);
    test('page-empty-array-2', e.page(-1), []);
    test('page-empty-array-3', e.page(undefined), []);
    test('page-empty-array-4', e.page([undefined]), []);
    test('page-empty-array-5', e.page([null]), []);
    test('$page-empty-array-0', e.$page(null, 5), []);
    test('$page-empty-array-1', e.$page(null, [5]), []);
    test('$page-empty-array-2', e.$page(0, []), []);
    test('$page-empty-array-3', e.$page(), []);
    
    test('rowSlice-empty-array-0', e.rowSlice(), []);
    test('rowSlice-empty-array-1', e.rowSlice(null, null), []);
    test('$rowSlice-empty-array-0', e.$rowSlice(null, null, 5), []);
    test('$rowSlice-empty-array-1', e.$rowSlice(null, null, []), []);
    test('$rowSlice-empty-array-2', e.$rowSlice(), []);
    
    test('colSlice-empty-array-0', e.colSlice(), []);
    test('colSlice-empty-array-1', e.colSlice(0, 0), []);
    test('colSlice-empty-array-2', e.colSlice(0), []);
    test('colSlice-empty-array-3', e.colSlice(null, 0), []);
    test('colSlice-empty-array-4', e.colSlice(null), []);
    test('colSlice-empty-array-5', e.colSlice(null, null), []);
    test('colSlice-empty-array-6', e.colSlice(-1, -1), []);
    test('$colSlice-empty-array-0', e.$colSlice(null, null, []), []);
    test('$colSlice-empty-array-1', e.$colSlice(0, 0, []), []);
    test('$colSlice-empty-array-2', e.$colSlice(), []);
    
    test('pageSlice-empty-array-0', e.pageSlice(), []);
    test('pageSlice-empty-array-1', e.pageSlice(0, 0), []);
    test('$pageSlice-empty-array-1', e.$pageSlice(null, null, []), []);
    test('$pageSlice-empty-array-2', e.$pageSlice(0, 0, []), []);
    test('$pageSlice-empty-array-3', e.$pageSlice(), []);
    
    test('head-empty-array-0', e.head(), []);
    test('head-empty-array-1', e.head(0), []);
    test('head-empty-array-2', e.head(null, null, null), []);
    test('head-empty-array-3', e.head(0, 1, 1), []);
    test('head-empty-array-4', e.head(5,5,5), []);
    
    assert.throwEach('throw-subcube-empty-array', [
      () => e.subcube(0),
      () => e.subcube(-1),
      () => e.subcube('a'),
      () => e.subcube(null,1),
      () => e.subcube(null,null,1),
      () => e.row(0),
      () => e.col(1),
      () => e.page(1),
      () => e.rowSlice(0),
      () => e.colSlice(0,1),
      () => e.page(0,1),
      () => e.$subcube(0,null,null,5),
      () => e.$subcube(-1,null,null,5),
      () => e.$subcube('a',null,null,5),
      () => e.$subcube(null,1,null,5),
      () => e.$subcube(null,null,1,5),
      () => e.$row(0,5),
      () => e.$col(1,5),
      () => e.$page(1,5),
      () => e.$rowSlice(0,null,5),
      () => e.$colSlice(0,1,5),
      () => e.$pageSlice(0,1,5)
    ]);  
    
    //get vector
    let v = [5,6,7,8,9];
    test('subcube-vector-0', v.subcube(), [5,6,7,8,9]);
    test('subcube-vector-1', v.subcube(3), [8]);
    test('subcube-vector-2', v.subcube(-2), [8]);
    test('subcube-vector-3', v.subcube([2,4]), [7,9]);
    test('subcube-vector-4', v.subcube([2,4], 0, 0), [7,9]);
    test('subcube-vector-5', v.subcube([2,4], null, null), [7,9]);
    test('subcube-vector-6', v.subcube([-3,-1], null, null), [7,9]);
    test('subcube-vector-7', v.subcube([], null, null), []);
    
    test('row-vector-0', v.row(), [5,6,7,8,9]);
    test('row-vector-1', v.row(3), [8]);
    test('row-vector-2', v.row(-2), [8]);
    test('row-vector-3', v.row([2,4]), [7,9]);
    test('row-vector-4', v.row([-3,-1]), [7,9]);
    test('row-vector-5', v.row([]), []);
    
    test('rowSlice-vector-0', v.rowSlice(), [5,6,7,8,9]);
    test('rowSlice-vector-1', v.rowSlice(0), [5,6,7,8,9]);
    test('rowSlice-vector-2', v.rowSlice(null), [5,6,7,8,9]);
    test('rowSlice-vector-3', v.rowSlice(null,null), [5,6,7,8,9]);
    test('rowSlice-vector-4', v.rowSlice(1,3), [6,7,8]);
    test('rowSlice-vector-5', v.rowSlice(1,-2), [6,7,8]);
    test('rowSlice-vector-6', v.rowSlice(-4,-2), [6,7,8]);
    test('rowSlice-vector-7', v.rowSlice(1), [6,7,8,9]);
    test('rowSlice-vector-8', v.rowSlice(null,3), [5,6,7,8]);
    test('rowSlice-vector-9', v.rowSlice(1), [6,7,8,9]);
    
    test('head-vector-0', v.head(), [5,6,7,8,9]);
    test('head-vector-1', v.head(3), [5,6,7]);
    test('head-vector-2', v.head(0), []);
    test('head-vector-3', v.head(9,9,9), [5,6,7,8,9]);
    
    //set vector
    const obj = {};
    const wrapObj = [obj];
    v = [5,6,7,8,9];
    test('$subcube-vector-0', v.$subcube(null, null, null, 11),   [11,11,11,11,11]);
    test('$subcube-vector-1', v.$subcube(3, null, null, 12),      [11,11,11,12,11]);
    test('$subcube-vector-2', v.$subcube([2,4], null, null, 13),  [11,11,13,12,13]);
    test('$subcube-vector-3', v.$subcube(0, null, null, 14),      [14,11,13,12,13]);
    test('$subcube-vector-4', v.$subcube([], undefined, undefined, 15),      [14,11,13,12,13]);
    test('$subcube-vector-5', v.$subcube(-4, null, null, 16),                [14,16,13,12,13]);
    test('$subcube-vector-6', v.$subcube([2,-1,0], null, null, [17,18,19]),  [19,16,17,12,18]);
    test('$subcube-vector-7', v.$subcube([2,4], null, null, [20]),           [19,16,20,12,20]);
    test('$subcube-vector-8', v.$subcube([2,4], null, null, [obj, wrapObj]), [19,16,obj,12,wrapObj]);
    test('$subcube-vector-9', v.$subcube(0, null, null, obj),                [obj,16,obj,12,wrapObj]);
    test('$subcube-vector-10', v.$subcube(0, null, null, wrapObj),           [obj,16,obj,12,wrapObj]);
    test('$subcube-vector-11', v.$subcube(0, null, null, [wrapObj]),         [wrapObj,16,obj,12,wrapObj]);
    test('$subcube-vector-12', v.$subcube(),  new Array(5));
    test('$subcube-vector-13', v.$subcube(null),  new Array(5));
    test('$subcube-vector-14', v.$subcube(null, null),  new Array(5));
    test('$subcube-vector-15', v.$subcube(null, null, null),  new Array(5));

    v = [5,6,7,8,9];
    test('$row-vector-0', v.$row(null, 11),    [11,11,11,11,11]); 
    test('$row-vector-1', v.$row(3, 12),       [11,11,11,12,11]); 
    test('$row-vector-2', v.$row([2,4], 13),   [11,11,13,12,13]); 
    test('$row-vector-3', v.$row(0, 14),       [14,11,13,12,13]); 
    test('$row-vector-4', v.$row([], 15),      [14,11,13,12,13]); 
    test('$row-vector-5', v.$row(-4, 16),      [14,16,13,12,13]); 
    test('$row-vector-6', v.$row([2,-1,0], [17,18,19]),     [19,16,17,12,18]);
    test('$row-vector-7', v.$row([2,4], [20]),              [19,16,20,12,20]);
    test('$row-vector-8', v.$row([2,4], [obj, wrapObj]),    [19,16,obj,12,wrapObj]);
    test('$row-vector-9', v.$row(0, obj),        [obj,16,obj,12,wrapObj]);
    test('$row-vector-10', v.$row(0, wrapObj),   [obj,16,obj,12,wrapObj]);
    test('$row-vector-11', v.$row(0, [wrapObj]), [wrapObj,16,obj,12,wrapObj]);
    test('$row-vector-12', v.$row(), new Array(5));
    
    v = [5,6,7,8,9];
    test('$rowSlice-vector-0', v.$rowSlice(null, null, 11),  [11,11,11,11,11]); 
    test('$rowSlice-vector-1', v.$rowSlice(1, null,12),      [11,12,12,12,12]);
    test('$rowSlice-vector-2', v.$rowSlice(undefined,2,13),  [13,13,13,12,12]); 
    test('$rowSlice-vector-3', v.$rowSlice(1,3,[14,15,16]),  [13,14,15,16,12]); 
    test('$rowSlice-vector-4', v.$rowSlice(-2,-1,[17,18]),   [13,14,15,17,18]);
    v.$key(0, ['a','b','c','d','e']);
    test('$rowSlice-vector-5', v.$rowSlice(null, 'c', 19), 
         [19,19,19,17,18].$key(0, ['a','b','c','d','e']));
    test('$rowSlice-vector-6', v.$rowSlice('b', undefined, 20),
         [19,20,20,20,20].$key(0, ['a','b','c','d','e']));    
    test('$rowSlice-vector-7', v.$rowSlice(null, null, [21,22,23,24,25]), 
         [21,22,23,24,25].$key(0, ['a','b','c','d','e']));
    test('$rowSlice-vector-8', v.$rowSlice(),  
         (new Array(5)).$key(0, ['a','b','c','d','e']));
  
    //book
    const marks = () => {
      return [11,12,13,14,15,16,17,18,19,20,
              21,22,23,24,25,26,27,28,29,30,
              31,32,33,34];
    };
    const addKeys = x => {
      return x.$key(0,['Alice','Bob','Cath'])
       .$key(1,['math','biol','chem','phys'])
       .$key(2,['Autumn','Spring']);
    };
    const addLabels = x => {
      return x.$label(0,'Student')
        .$label(1,'Subject')
        .$label(2,'Term');
    };
    const book = () => addLabels(addKeys(marks().$shape([3,4,2])));
    const bob = addLabels(
      [12,15,18,21,24,27,30,33]
        .$shape([1,4,2])
        .$key(0,'Bob')
        .$key(1,['math','biol','chem','phys'])
        .$key(2,['Autumn','Spring'])
    );
    const biolChem = addLabels(
      [14,15,16,17,18,19,26,27,28,29,30,31]
        .$shape([3,2,2])
        .$key(0,['Alice','Bob','Cath'])
        .$key(1,['biol','chem'])
        .$key(2,['Autumn','Spring'])
    );
    const aliceBiolChemSpring = addLabels(
      [26,29]
        .$shape([1,2,1])
        .$key(0,'Alice')
        .$key(1,['biol','chem'])
        .$key(2,'Spring')
    );
    const spring = addLabels(
      [23,24,25,26,27,28,29,30,31,32,33,34]
        .$shape([3,4,1])
        .$key(0,['Alice','Bob','Cath'])
        .$key(1,['math','biol','chem','phys'])
        .$key(2,'Spring')
    );
    const emptyCol = addLabels(
      []
        .$shape([3,0,2])
        .$key(0,['Alice','Bob','Cath'])
        .$key(1,[])
        .$key(2,['Autumn','Spring'])
    );

    let b, bTmp, valTmp;
    
    b = book();
    test('subcube-book-0', b.subcube(), book());
    test('subcube-book-1', b.subcube(null, null, null, 'full'), book());
    test('subcube-book-2', b.subcube(null, null, null, 'core'), marks().$shape([3,4,2]));
    test('subcube-book-3', b.subcube('Bob'), bob);
    test('subcube-book-4', b.subcube(null, ['biol','chem']), biolChem);
    test('subcube-book-5', b.subcube('Alice', ['biol','chem'], 'Spring'), aliceBiolChemSpring);
    test('subcube-book-6', b.subcube(null, null, 'Spring'), spring);
    test('subcube-book-7', b.subcube(null, [], null), emptyCol);
    test('subcube-book-8', b.subcube(null, ['biol','chem'], null, 'full'), biolChem);
    test('subcube-book-9', b.subcube(null, ['biol','chem'], null, 'core'), 
      [14,15,16,17,18,19,26,27,28,29,30,31].$shape([3,2,2]))
    test('subcube-book-10', b.subcube(null, ['biol','chem'], null, 'array'), 
      [14,15,16,17,18,19,26,27,28,29,30,31])
    
    test('row-book-0', b.row(), book());
    test('row-book-1', b.row('Bob'), bob);
    test('col-book-0', b.col(['biol','chem']), biolChem);
    test('col-book-1', b.col([]), emptyCol);    
    test('col-book-2', b.col(['biol','chem'], 'full'), biolChem);
    test('col-book-3', b.col(['biol','chem'], 'core'), 
      [14,15,16,17,18,19,26,27,28,29,30,31].$shape([3,2,2]))
    test('col-book-4', b.col(['biol','chem'], 'array'), 
      [14,15,16,17,18,19,26,27,28,29,30,31])
    test('page-book-0', b.page('Spring'), spring);
    test('row-col-page-book-0',
      b.row('Alice').col(['biol','chem']).page('Spring'), aliceBiolChemSpring);
    
    test('rowSlice-book-0', b.rowSlice(), book());
    test('rowSlice-book-1', b.rowSlice('Bob','Bob'), bob);
    test('colSlice-book-0', b.colSlice('biol','chem'), biolChem); 
    test('colSlice-book-1', emptyCol.colSlice(), emptyCol); 
    test('colSlice-book-2', b.colSlice('biol','chem', 'full'), biolChem);
    test('colSlice-book-3', b.colSlice('biol','chem', 'core'), 
      [14,15,16,17,18,19,26,27,28,29,30,31].$shape([3,2,2]))
    test('colSlice-book-4', b.colSlice('biol','chem', 'array'), 
      [14,15,16,17,18,19,26,27,28,29,30,31])
    test('pageSlice-book-0', b.pageSlice('Spring','Spring'), spring);
    test('rowSlice-colSlice-pageSlice-0',
      b.rowSlice('Alice','Alice').colSlice('biol','chem').pageSlice('Spring','Spring'),
        aliceBiolChemSpring);
    
    test('head-book-0', b.head(5,5,5), book());
    test('head-book-1', b.head(2,3,1), addLabels(
      [11,12,14,15,17,18]
        .$shape([2,3,1])
        .$key(0,['Alice','Bob'])
        .$key(1,['math','biol','chem'])
        .$key(2,'Autumn')));    
    
    b = book();
    test('$subcube-book-0', b.$subcube(null, null, null, 50), addLabels(addKeys([3,4,2].cube(50))));
    b = book();
    test('$subcube-book-1', b.$subcube(null, null, null, [24].cube(51)), addLabels(addKeys([3,4,2].cube(51))));
    b = book();
    test('$subcube-book-2', b.$subcube(), addLabels(addKeys([3,4,2].cube())));
    
    bTmp = book();
    bTmp[1] = 52;    bTmp[4] = 52;    bTmp[7] = 52;    bTmp[10] = 52; 
    bTmp[13] = 52;   bTmp[16] = 52;   bTmp[19] = 52;   bTmp[22] = 52; 
    b = book();
    test('$subcube-book-3', b.$subcube('Bob', null, null, 52), bTmp);
    b = book();
    test('$row-book-0', b.$row('Bob',52), bTmp);
    b = book();
    test('$rowSlice-book-0', b.$rowSlice('Bob','Bob',52), bTmp);
    
    bTmp = book();
    valTmp = [53,54,55,56,57,58,59,60,61,62,63,64];
    bTmp[3] = 53;    bTmp[4] = 54;    bTmp[5] = 55;
    bTmp[6] = 56;    bTmp[7] = 57;    bTmp[8] = 58;
    bTmp[15] = 59;   bTmp[16] = 60;   bTmp[17] = 61;
    bTmp[18] = 62;   bTmp[19] = 63;   bTmp[20] = 64;
    b = book();
    test('$subcube-book-4', b.$subcube(null, ['biol','chem'], null, valTmp), bTmp);
    b = book();
    test('$col-book-0', b.$col(['biol','chem'],valTmp), bTmp);
    b = book();
    test('$colSlice-book-0', b.$colSlice('biol','chem',valTmp), bTmp);
    
    bTmp = book();
    bTmp[15] = 65;    bTmp[18] = 66; 
    b = book();
    test('$subcube-book-5', b.$subcube('Alice', ['biol','chem'], 'Spring', [65,66]), bTmp);
    
    b = book();
    test('$subcube-book-6', b.$subcube(null, null, [], 67),  book());
    test('$page-book-0', b.$page([], 67),  book());
    b = book();
    test('$page-book-1', b.$page(),  addLabels(addKeys([3,4,2].cube())));
    b = book();
    test('$pageSlice-book-0', b.$pageSlice('Autumn', null, 67), addLabels(addKeys([3,4,2].cube(67))));
    b = book();
    test('$pageSlice-book-1', b.$pageSlice(), addLabels(addKeys([3,4,2].cube())));

    b = book();
    assert.throwEach('throw-subcube', [
      () => b.subcube('x'),
      () => b.subcube('Bob', 'x'),
      () => b.subcube('Bob', 'biol', 'x'),
      () => b.$subcube('x', null, null, 10),
      () => b.$subcube('Bob', 'x', null, 10),
      () => b.$subcube('Bob', 'biol', 'x', 10),
      () => b.subcube([['Alice']]),
      () => b.subcube(null, null, null, 'x'),
      () => b.row('x'),
      () => b.col('x'),
      () => b.page('x'),
      () => b.rowSlice('x'),
      () => b.colSlice('x'),
      () => b.pageSlice('x'),
      () => b.colSlice('chem','biol'),
      () => b.$colSlice('chem','biol',10),
      () => b.colSlice('biol',[['chem']]),
      () => b.$colSlice('biol',[['chem']],10),
      () => b.$subcube(null, null, null, [10,11]),
      () => b.$row('Alice',[10,11]),
      () => b.$rowSlice('Alice','Bob',[10,11])
    ]);
    
  });
   
  runTests('$$ subcubes', () => {

    //$$subcube
    let x = [3,4,5];
    test('$$subcube-0',
      x.$$subcube([0,2], null, undefined, V => V.add(10)),
      [13,4,15]
    );

    x = [3,14].seq()
      .$shape([2,3,2])
      .$key(1, ['a','b','c'])
      .$$subcube(-1, null, [0], V => V.add(10));
    test('$$subcube-1',
      x,
      [3,14].seq()
        .$vec([1,3,5], [14,16,18])
        .$shape([2,3,2])
        .$key(1, ['a','b','c'])
    );
    x.$$subcube(null, null, null, () => 55);
    test('$$subcube-2',
      x,
      [2,3,2].cube(55).$key(1, ['a','b','c'])
    );

    x = [3,5,4,7,9,10]
      .$shape([2,3])
      .$key(0, ['a','b'])
      .$$subcube('a', [0,2], null, V => V.mean(-1));
    test('$$subcube-3',
      x,
      [6,5,4,7,6,10].$shape([2,3]).$key(0, ['a','b'])
    );

    x = [0,19].seq()
      .$shape(4)
      .$key(1, ['a','e'].seq())
    x.$$subcube([2,0], ['e','b'], null, V => V.add(10));
    test('$$subcube-4',
      x,
      [0,19].seq()
        .$vec([4,6,16,18], [14,16,26,28])
        .$shape(4)
        .$key(1, ['a','e'].seq())
    );

    x = [3,4];
    x.$$subcube(0, 0, 0, (v, xx) => {
      test('$$subcube-calling-array', xx, x);
      return;
    });

    assert.throw('throw-$$subcube-invalid-index',
      () => [3,4].$$subcube(2, 0, 0, () => 10)
    );

    //$$row, $$col, $$page
    x = [3,4,5];
    test('$$row-0',
      x.$$row([0,-1], V => V.add(10)),
      [13,4,15]
    );
    test('$$row-1',
      x.$$row([2,1], V => V.add(100)),
      [13,104,115]
    );

    x = [4,5,6,7,8,11]
      .$shape([2,3])
      .$key(1, ['a','b', 'c'])
      .$$col(['b','c'], V => V.mean(-1));
    test('$$col-0',
      x,
      [4,5,8,8,8,8].$shape([2,3]).$key(1, ['a','b','c'])
    );
    x.$$row(null, V => V.add(10));
    test('$$row-2',
      x,
      [14,15,18,18,18,18].$shape([2,3]).$key(1, ['a','b','c'])
    );

    x = [3,14].seq()
      .$shape([2,3,2])
      .$key(1, ['a','b','c'])
      .$$page(1, V => V.add(10));
    test('$$page-0',
      x,
      [3,4,5,6,7,8, 19,20,21,22,23,24]
        .$shape([2,3,2])
        .$key(1, ['a','b','c'])
    );

    x = [3,4];
    x.$$col(0, (v, xx) => {
      test('$$col-calling-array', xx, x);
      return;
    });

    assert.throw('throw-$$col-invalid-index',
      () => [3,4].tp().$$col(2, () => 10)
    );

    //$$rowSlice, $$colSlice, $$pageSlice
    x = [3,4,5];
    test('$$rowSlice-0',
      x.$$rowSlice(1, -1, V => V.add(10)),
      [3,14,15]
    );
    test('$$rowSlice-1',
      x.$$rowSlice(null, undefined, V => V.add(100)),
      [103,114,115]
    );

    x = [4,5,6,7,8,11]
      .$shape([2,3])
      .$key(1, ['a','b', 'c'])
      .$$colSlice('b', 'c', V => V.mean(-1));
    test('$$colSlice-0',
      x,
      [4,5,8,8,8,8].$shape([2,3]).$key(1, ['a','b','c'])
    );

    x = [3,14].seq()
      .$shape([2,3,2])
      .$key(1, ['a','b','c'])
      .$$pageSlice(1, [1], V => V.add(10));
    test('$$pageSlice-0',
      x,
      [3,4,5,6,7,8, 19,20,21,22,23,24]
        .$shape([2,3,2])
        .$key(1, ['a','b','c'])
    );

    x = [3,4];
    x.$$rowSlice(0, 0, (v, xx) => {
      test('$$rowSlice-calling-array', xx, x);
      return;
    });

    assert.throw('throw-$$colSlice-invalid-index',
      () => [3,4].tp().$$colSlice(1, 2, () => 10)
   );

  });

  runTests('vble', () => {
    
    const e = [0,1,2].cube();
    assert('vble-empty-dim-0', () => _isEqual(e.vble(0),
      [ { col: 0, page: 0 }, { col: 0, page: 1 } ]), true);
    assert('vble-empty-dim-1', () => _isEqual(e.vble(1), []), true);
    assert('vble-empty-dim-2', () => _isEqual(e.vble(2), []), true);
    assert('vble-empty-dim-neg-1', () => _isEqual(e.vble(-1), []), true);
    
    const b = [11,12,13,14,15,16,17,18,19,20,
         21,22,23,24,25,26,27,28,29,30,
         31,32,33,34]
      .$shape([3,4,2])
      .$key(0,['Alice','Bob','Cath'])
      .$key(1,['math','biol','chem','phys'])
      .$key(2,['Autumn','Spring'])
      .$label(0,'Student')
      .$label(1,'Subject')
      .$label(2,'Term');
    
    assert('vble-book-dim-0', () => _isEqual( b.vble(),
      [ { Subject: 'math', Term: 'Autumn', Alice: 11, Bob: 12, Cath: 13 },
        { Subject: 'biol', Term: 'Autumn', Alice: 14, Bob: 15, Cath: 16 },
        { Subject: 'chem', Term: 'Autumn', Alice: 17, Bob: 18, Cath: 19 },
        { Subject: 'phys', Term: 'Autumn', Alice: 20, Bob: 21, Cath: 22 },
        { Subject: 'math', Term: 'Spring', Alice: 23, Bob: 24, Cath: 25 },
        { Subject: 'biol', Term: 'Spring', Alice: 26, Bob: 27, Cath: 28 },
        { Subject: 'chem', Term: 'Spring', Alice: 29, Bob: 30, Cath: 31 },
        { Subject: 'phys', Term: 'Spring', Alice: 32, Bob: 33, Cath: 34 }
      ]), true);
  
    assert('vble-book-dim-1', () => _isEqual( b.vble(1),
      [ { Student: 'Alice',
          Term: 'Autumn',
          math: 11,
          biol: 14,
          chem: 17,
          phys: 20 },
        { Student: 'Bob',
          Term: 'Autumn',
          math: 12,
          biol: 15,
          chem: 18,
          phys: 21 },
        { Student: 'Cath',
          Term: 'Autumn',
          math: 13,
          biol: 16,
          chem: 19,
          phys: 22 },
        { Student: 'Alice',
          Term: 'Spring',
          math: 23,
          biol: 26,
          chem: 29,
          phys: 32 },
        { Student: 'Bob',
          Term: 'Spring',
          math: 24,
          biol: 27,
          chem: 30,
          phys: 33 },
        { Student: 'Cath',
          Term: 'Spring',
          math: 25,
          biol: 28,
          chem: 31,
          phys: 34 }
      ]), true);
  

    assert('vble-book-dim-2', () => _isEqual( b.vble(2),
      [ { Student: 'Alice', Subject: 'math', Autumn: 11, Spring: 23 },
        { Student: 'Bob', Subject: 'math', Autumn: 12, Spring: 24 },
        { Student: 'Cath', Subject: 'math', Autumn: 13, Spring: 25 },
        { Student: 'Alice', Subject: 'biol', Autumn: 14, Spring: 26 },
        { Student: 'Bob', Subject: 'biol', Autumn: 15, Spring: 27 },
        { Student: 'Cath', Subject: 'biol', Autumn: 16, Spring: 28 },
        { Student: 'Alice', Subject: 'chem', Autumn: 17, Spring: 29 },
        { Student: 'Bob', Subject: 'chem', Autumn: 18, Spring: 30 },
        { Student: 'Cath', Subject: 'chem', Autumn: 19, Spring: 31 },
        { Student: 'Alice', Subject: 'phys', Autumn: 20, Spring: 32 },
        { Student: 'Bob', Subject: 'phys', Autumn: 21, Spring: 33 },
        { Student: 'Cath', Subject: 'phys', Autumn: 22, Spring: 34 }
      ]), true);
    
    assert('vble-book-dim-neg-1', () => _isEqual( b.vble(-1),
      [ { Student: 'Alice', Subject: 'math', Term: 'Autumn', entry: 11 },
        { Student: 'Bob', Subject: 'math', Term: 'Autumn', entry: 12 },
        { Student: 'Cath', Subject: 'math', Term: 'Autumn', entry: 13 },
        { Student: 'Alice', Subject: 'biol', Term: 'Autumn', entry: 14 },
        { Student: 'Bob', Subject: 'biol', Term: 'Autumn', entry: 15 },
        { Student: 'Cath', Subject: 'biol', Term: 'Autumn', entry: 16 },
        { Student: 'Alice', Subject: 'chem', Term: 'Autumn', entry: 17 },
        { Student: 'Bob', Subject: 'chem', Term: 'Autumn', entry: 18 },
        { Student: 'Cath', Subject: 'chem', Term: 'Autumn', entry: 19 },
        { Student: 'Alice', Subject: 'phys', Term: 'Autumn', entry: 20 },
        { Student: 'Bob', Subject: 'phys', Term: 'Autumn', entry: 21 },
        { Student: 'Cath', Subject: 'phys', Term: 'Autumn', entry: 22 },
        { Student: 'Alice', Subject: 'math', Term: 'Spring', entry: 23 },
        { Student: 'Bob', Subject: 'math', Term: 'Spring', entry: 24 },
        { Student: 'Cath', Subject: 'math', Term: 'Spring', entry: 25 },
        { Student: 'Alice', Subject: 'biol', Term: 'Spring', entry: 26 },
        { Student: 'Bob', Subject: 'biol', Term: 'Spring', entry: 27 },
        { Student: 'Cath', Subject: 'biol', Term: 'Spring', entry: 28 },
        { Student: 'Alice', Subject: 'chem', Term: 'Spring', entry: 29 },
        { Student: 'Bob', Subject: 'chem', Term: 'Spring', entry: 30 },
        { Student: 'Cath', Subject: 'chem', Term: 'Spring', entry: 31 },
        { Student: 'Alice', Subject: 'phys', Term: 'Spring', entry: 32 },
        { Student: 'Bob', Subject: 'phys', Term: 'Spring', entry: 33 },
        { Student: 'Cath', Subject: 'phys', Term: 'Spring', entry: 34 }
      ]), true);
  
    const m = ['a','b','c','d','e','f']
      .$shape([2,3])
      .$key(1,['55',true,55])  //two keys convert to same string
      .$label(1,'COLS');
    
    assert('vble-matrix-dim-0', () => _isEqual( m.vble(0),
      [ { COLS: '55', page: 0, 0: 'a', 1: 'b' },
        { COLS: true, page: 0, 0: 'c', 1: 'd' },
        { COLS: 55, page: 0, 0: 'e', 1: 'f' }
      ]), true);
  
    assert('vble-matrix-dim-1', () => _isEqual( m.vble(1),
      [ { '55': 'e', row: 0, page: 0, true: 'c' },
        { '55': 'f', row: 1, page: 0, true: 'd' }
      ]), true);
        
    assert('vble-matrix-dim-2', () => _isEqual( m.vble(2),
      [ { row: 0, COLS: '55', 0: 'a' },
        { row: 1, COLS: '55', 0: 'b' },
        { row: 0, COLS: true, 0: 'c' },
        { row: 1, COLS: true, 0: 'd' },
        { row: 0, COLS: 55, 0: 'e' },
        { row: 1, COLS: 55, 0: 'f' } 
      ]), true);
    
    assert('vble-matrix-dim-neg-1', () => _isEqual( m.vble([-1]),
      [ { row: 0, COLS: '55', page: 0, entry: 'a' },
        { row: 1, COLS: '55', page: 0, entry: 'b' },
        { row: 0, COLS: true, page: 0, entry: 'c' },
        { row: 1, COLS: true, page: 0, entry: 'd' },
        { row: 0, COLS: 55, page: 0, entry: 'e' },
        { row: 1, COLS: 55, page: 0, entry: 'f' }
      ]), true);
  
    assert.throwEach('throw-vble', [
      () => b.vble(3),
      () => b.vble('1'),
      () => b.vble([[1]]),
      () => b.vble([1,2])
    ]);
    
  });

  runTests('ent, $ent', () => {
    
    const e = [];
    assert.throwEach('throw-ent-empty', [
      () => e.ent(),
      () => e.ent(0),
      () => e.ent(-1),
      () => e.ent(null),
    ]);
    assert.throwEach('throw-$ent-empty', [
      () => e.$ent(55),
      () => e.$ent(0,55),
      () => e.$ent(-1,55),
      () => e.$ent(null,55),
    ]);
    
    const s = [5];
    assert.each('ent-singleton', [
      [() => s.ent(0), 5],
      [() => s.ent(-1), 5],
    ]);
    assert.throwEach('throw-ent-singleton', [
      () => s.ent(3),
      () => s.ent(1),
      () => s.ent(-2),
      () => s.ent(),
      () => s.ent(null),
    ]);
    s.$ent(0,6);
    test('$ent-singleton', s, [6]);
    assert.throwEach('throw-$ent-singleton', [
      () => s.$ent(3,55),
      () => s.$ent(1,55),
      () => s.$ent(-2,55),
      () => s.$ent(55),
      () => s.$ent(null,55),
    ]);
    
   const m = [6,7,8,9,10,11]
    .$shape([2,3])
    .$key(0, ['a','b']);
    assert.each('ent-matrix', [
      [() => m.ent(0), 6],
      [() => m.ent(5), 11],
      [() => m.ent(3), 9],
      [() => m.ent(-1), 11],
      [() => m.ent(-6), 6],
    ]);
    assert.throwEach('throw-ent-matrix', [
      () => m.ent(6),
      () => m.ent(-7),
      () => m.ent(),
      () => m.ent(null),
      () => m.ent([0,1]),
    ]);
    m.$ent(0,20);
    m.$ent(1,21);
    m.$ent(5,22);
    m.$ent(-2,23);
    test('$ent-matrix', m, [20,21,8,9,23,22].$shape([2,3]).$key(0, ['a','b']));
    assert.throwEach('throw-$ent-matrix', [
      () => m.$ent(6,55),
      () => m.$ent(-7,55),
      () => m.$ent(55),
      () => m.$ent(null,55),
      () => m.$ent(0, [24,25]),
    ]);

  });

  runTests('$$ent', () => {

    const x = [3,4];
    test('$$ent-0',
      x.$$ent(1, e => e + 10),
      [3,14]
    );

    const y = [3,4,5,6,7,8]
      .$shape(2)
      .$key(1, ['a','b','c'])
      .$$ent(-2, e => e + 10);
    test('$$ent-1',
      y,
      [3,4,5,6,17,8].$shape(2).$key(1, ['a','b','c'])
    );

    const z = [3,4];
    z.$$ent(0, (v, zz) => {
      test('$$ent-calling-array', zz, z);
      return;
    });

    assert.throw('throw-$$ent-invalid-index',
      () => [3,4].$$ent(2, () => 10)
    );
  });
  
  runTests('at, $at', () => {
    
    const s = [5];
    assert.each('at-singleton-0', [
      [() => s.at(), 5],   
      [() => s.at(0), 5],
      [() => s.at(0,0), 5],
      [() => s.at(0,0,0), 5],
      [() => s.at(0,null,0), 5],
      [() => s.at(-1), 5],
      [() => s.at(-1,-1,-1), 5]
    ]);
    assert.each('$at-singleton-0', [
      [() => {s.$at(0,0,0,6); return s[0]}, 6],
      [() => {s.$at(null, null, null, 7); return s[0]}, 7],
      [() => {s.$at(-1, undefined, 0, 8); return s[0]}, 8],
    ]);
    s.$key(0,'a');
    assert.each('at-singleton-1', [
      [() => s.at(), 8],
      [() => s.at(null), 8],
      [() => s.at('a'), 8],
      [() => s.at('a',0), 8]
    ]);
    assert.each('$at-singleton-1', [
      [() => {s.$at('a', 0, 0, 9); return s[0]}, 9],
      [() => {s.$at(null, null, null, 10); return s[0]}, 10],
      [() => {s.$at('a',-1,-0,11); return s[0]}, 11],
    ]);
    test('$at-singleton-2', s, [11].$key(0,'a'));
    
    const v = [6,7,8];
    assert.each('at-vector-0', [
      [() => v.at(1), 7],
      [() => v.at(1,0), 7],
      [() => v.at(-2), 7]
    ]);
    assert.each('$at-vector-0', [
      [() => {v.$at(0,0,0,[9]); return v[0]}, 9],
      [() => {v.$at(1,0,0,10); return v[1]}, 10],
      [() => {v.$at(-1,null,undefined,11); return v[2]}, 11],
      [() => h.equalArray(v,[9,10,11]), true],
    ]);
    const obj = {};
    v.$key(0,['a',obj,'c']).$key(1,'q').$key(2,'w');
    assert.each('at-vector-1', [
      [() => v.at(obj), 10],
      [() => v.at(obj,'q','w'), 10],
      [() => v.at(obj,null,'w'), 10]
    ]);
    assert.each('$at-vector-1', [
      [() => {v.$at('a', null, null, 13); return v[0]}, 13],
      [() => {v.$at(obj, 'q', 'w', 14); return v[1]}, 14],
      [() => {v.$at('c', undefined, undefined, 15); return v[2]}, 15],
    ]);
    test('$at-vector-2', v, [13,14,15]
         .$key(0,['a',obj,'c']).$key(1,'q').$key(2,'w'));
    
    const m = [6,7,8,9,10,11].$shape([2,3]);
    assert.each('at-matrix', [
      [() => m.at(), 6],
      [() => m.at(0,2), 10],
      [() => m.at(-1,-1), 11],
      [() => m.at(null,1), 8]
    ]);
    assert.each('$at-matrix-0', [
      [() => {m.$at(0,0,0,13); return m[0]}, 13],
      [() => {m.$at(1,0,null,14); return m[1]}, 14],
      [() => {m.$at(0,2,0,15); return m[4]}, 15],
      [() => {m.$at(1,1,null,16); return m[3]}, 16],
      [() => {m.$at(-1,-1,-1,17); return m[5]}, 17],
    ]);
    test('$at-matrix-1', m, [13,14,8,16,15,17].$shape([2,3]));
    
    const b = [11,12,13,14,15,16,17,18,19,20,
               21,22,23,24,25,26,27,28,29,30,
               31,32,33,34]
      .$shape([3,4,2])
      .$key(0, ['Alice','Bob','Cath'])
      .$key(2,['Autumn','Spring'])
      .$label(0,'Student')
      .$label(1,'Subject')
      .$label(2,'Term');
    assert.each('at-book', [
      [() => b.at(), 11],
      [() => b.at('Bob'), 12],
      [() => b.at('Bob',-1), 21],
      [() => b.at('Alice',2,'Spring'), 29],
      [() => b.at(null,2,'Spring'), 29],
      [() => b.at(null,null,'Spring'), 23],
      [() => b.at(undefined,undefined,'Spring'), 23]
    ]);
    assert.each('$at-book-0', [
      [() => {b.$at(null, null, null, 50); return b[0]}, 50],
      [() => {b.$at('Bob', -1, 'Autumn', 51); return b[10]}, 51],
      [() => {b.$at('Alice',2,'Spring',52); return b[18]}, 52],
      [() => {b.$at(null,1,'Spring',53); return b[15]}, 53],
    ]);
    test('$at-book-1', b, 
      [50,12,13,14,15,16,17,18,19,20,
       51,22,23,24,25,53,27,28,52,30,
       31,32,33,34]
        .$shape([3,4,2])
        .$key(0, ['Alice','Bob','Cath'])
        .$key(2,['Autumn','Spring'])
        .$label(0,'Student')
        .$label(1,'Subject')
        .$label(2,'Term'));
    
    assert('$at-omit-new-val-0', 
      () => h.equalArray([5,6,7].$at(0), [undefined,6,7]), true);
    m.$at(0,2);
    test('$at-omit-new-val-1', m, [13,14,8,16,undefined,17].$shape([2,3]));
    
    assert.throwEach('throw-at', [
      () => [].at(),
      () => [].at(0),
      () => [].at(null),
      () => [].at(undefined),
      () => v.at(1),
      () => v.at(-1),
      () => v.at('d'),
      () => m.at(1,3),
      () => m.at(1,-4),
    ]);
    
    assert.throwEach('throw-$at', [
      () => [].$at(5),
      () => [].$at(0,5),
      () => [].$at(null,5),
      () => [].$at(undefined,5),
      () => v.$at(1,5),
      () => v.$at(-1,5),
      () => v.$at('c',[5,6]),
      () => m.$at(1,3,0,5),
      () => m.$at(1,-4,0,5),
    ]);
    
  });

  runTests('$$at', () => {

    const x = [3,4];
    test('$$at-0',
      x.$$at(1, null, undefined, e => e + 10),
      [3,14]
    );

    const y = [3,4,5,6,7,8]
      .$shape([2,1,3])
      .$key(2, ['a','b','c'])
      .$$at(-1, 0, 'b', e => e + 10);
    test('$$at-1',
      y,
      [3,4,5,16,7,8].$shape([2,1,3]).$key(2, ['a','b','c'])
    );
    y.$$at(null, null, null, e => e + 10);
    test('$$at-2',
      y,
      [13,4,5,16,7,8].$shape([2,1,3]).$key(2, ['a','b','c'])
    );

    const z = [3,4];
    z.$$at(0, 0, 0, (v, zz) => {
      test('$$at-calling-array', zz, z);
      return;
    });

    assert.throw('throw-$$at-invalid-index',
      () => [3,4].$$at(2, 0, 0, () => 10)
    );
  });
  
  runTests('vec, $vec', () => {

    test('vec-empty-0', [].vec(), []);
    test('vec-empty-1', [].vec([]), []);
    test('vec-empty-2', [1,0].cube().vec([]), []);
    test('vec-empty-3', [].vec([1,0].cube()), []);
    
    test('$vec-empty-0', [].$vec(null, 5), []);
    test('$vec-empty-1', [].$vec([] ,5), []);
    test('$vec-empty-2', [1,0].cube().$vec([],5), [1,0].cube());
    test('$vec-empty-3', [].$vec([1,0].cube(),5), []);
    test('$vec-empty-4', [].$vec([], []), []);
    
    const s = [4];
    test('vec-singleton-0', s.vec(), [4]);
    test('vec-singleton-1', s.vec(null), [4]);
    test('vec-singleton-2', s.vec(undefined), [4]);
    test('vec-singleton-3', s.vec(0), [4]);
    test('vec-singleton-4', s.vec(-1), [4]);
    
    test('$vec-singleton-0', s.$vec([], 5), [4]);
    test('$vec-singleton-1', s.$vec(0, 5), [5]);
    test('$vec-singleton-2', s.$vec(null, 6), [6]);
    test('$vec-singleton-3', s.$vec(undefined, 7), [7]);
    test('$vec-singleton-4', s.$vec(0, [8]), [8]);
    test('$vec-singleton-5', s.$vec(-1, 9), [9]);
    
    const v = [5,6,7];
    test('vec-vector-0', v.vec(), [5,6,7]);
    test('vec-vector-1', v.vec(null), [5,6,7]);
    test('vec-vector-2', v.vec(0), [5]);
    test('vec-vector-3', v.vec([0]), [5]);
    test('vec-vector-4', v.vec([0,-1]), [5,7]);
    test('vec-vector-5', v.vec([]), []);
    
    test('$vec-vector-0', v.$vec(null, 8), [8,8,8]);
    test('$vec-vector-1', v.$vec(0,9), [9,8,8]);
    test('$vec-vector-2', v.$vec([1],[10]), [9,10,8]);
    test('$vec-vector-3', v.$vec([0,-1],[11,12]), [11,10,12]);
    test('$vec-vector-4', v.$vec([],13), [11,10,12]);
    test('$vec-vector-5', v.$vec(undefined, [14,15,16]), [14,15,16]);

    const b = [11,12,13,14,15,16,17,18,19,20,
               21,22,23,24,25,26,27,28,29,30,
               31,32,33,34]
      .$shape([3,4,2])
      .$key(0,['Alice','Bob','Cath'])
      .$key(2,['Autumn','Spring'])
      .$label(0,'Student')
      .$label(1,'Subject')
      .$label(2,'Term');
    
    test('vec-book-0', b.vec(),
         [11,12,13,14,15,16,17,18,19,20,
          21,22,23,24,25,26,27,28,29,30,
          31,32,33,34]);
    test('vec-book-1', b.vec(0), [11]);
    test('vec-book-2', b.vec(-1), [34]);
    test('vec-book-3', b.vec([4]), [15]);
    test('vec-book-4', b.vec([4,10]), [15,21]);
    test('vec-book-5', b.vec([4,-1,-2,-1,4]), [15,34,33,34,15]);
    test('vec-book-6', b.vec([]), []);
    
    const b1 = b.copy();
    b1.$vec(null,50);
    b1.$vec(0,51);
    b1.$vec(-1,52);
    b1.$vec([2,10,-2],53);
    b1.$vec([5,3,5,6].$shape([1,4]), [54,55,56,57].$shape([2,2]));
    test('$vec-book-0', b1, 
       [51,50,53,55,50,56,57,50,50,50,
        53,50,50,50,50,50,50,50,50,50,
        50,50,53,52]
      .$shape([3,4,2])
      .$key(0,['Alice','Bob','Cath'])
      .$key(2,['Autumn','Spring'])
      .$label(0,'Student')
      .$label(1,'Subject')
      .$label(2,'Term'));
    
    test('$vec-omit-new-val-0',
         [5,6,7].$vec(), [undefined, undefined, undefined]);
    const m = [6,7,8,9,10,11].$shape([2,3]);
    test('$vec-omit-new-val-1',
         m.$vec([-3,1]), [6,undefined,8,undefined,10,11].$shape([2,3]));
    test('$vec-omit-new-val-2',
         m.$vec(2), [6,undefined,undefined,undefined,10,11].$shape([2,3]));
        
    assert.throwEach('throw-vec-0', [
      () => [].vec(0),
      () => [].vec([0]),
      () => [].vec([0,1]),
      () => v.vec(3),
      () => v.vec([2,3]),
      () => v.vec(-4),
      () => v.vec('0'),
    ]);
    
    assert.throwEach('throw-$vec-0', [
      () => [].$vec(0,5),
      () => [].$vec([0],5),
      () => [].$vec([0,1],5),
      () => [].$vec([],[5,6]),
      () => v.$vec('0',5),
      () => v.$vec(null,[5,6]),
      () => v.$vec(2,[5,6]),
      () => v.$vec([0,1],[5,6,7]),
      () => v.$vec(3,5),
      () => v.$vec([2,3],5),
      () => v.$vec(-4,5),
    ]);
    
    v.$key(0,['a','b','c']);
    assert.throwEach('throw-vec-1', [
      () => v.vec('a'),
      () => v.vec(['b','c']),
    ]);

    assert.throwEach('throw-$vec-1', [
      () => v.$vec('a',50),
      () => v.$vec(['b','c'],[51,52]),
    ]);
    
  });

  runTests('$$vec', () => {

    const x = [3,4,5,6];
    test('$$vec-0',
      x.$$vec([-2,0], V => V.add(10)),
      [13,4,15,6]
    );

    const y = [3,4,5,6,7,8]
      .$shape(2)
      .$key(1, ['a','b','c'])
      .$$vec(null, V => V.add(10));
    test('$$vec-1',
      y,
      [13,14,15,16,17,18].$shape(2).$key(1, ['a','b','c'])
    );
    y.$$vec(3, V => V.add(100));
    test('$$vec-2',
      y,
      [13,14,15,116,17,18].$shape(2).$key(1, ['a','b','c'])
    );

    const z = [3,5,6,7,9].$$vec([0,1,3], V => V.mean());
    test('$$vec-3',
      z,
      [5,5,6,5,9]
    );

    const a = [3,4];
    a.$$vec(null, (v, aa) => {
      test('$$vec-calling-array', aa, a);
      return;
    });

    assert.throw('throw-$$vec-invalid-index',
      () => [3,4].$$vec([0,2], () => [10,20])
    );
    assert.throw('throw-$$vec-not-function',
      () => [3,4].$$vec(null, 10)
    );
  });

  runTests('$$rcp', () => {

    const x = [3,4];
    test('$$rcp-0',
      x.$$rcp(1, null, undefined, V => V.add(10)),
      [3,14]
    );

    const y = [3,4,5,6,7,8]
      .$shape([2,1,3])
      .$key(2, ['a','b','c'])
      .$$rcp(-1, 0, ['a','c'], V => V.add(10));
    test('$$rcp-1',
      y,
      [3,14,5,6,7,18].$shape([2,1,3]).$key(2, ['a','b','c'])
    );
    y.$$rcp(null, null, null, V => V.add(10));
    test('$$rcp-2',
      y,
      [13,14,5,6,7,18].$shape([2,1,3]).$key(2, ['a','b','c'])
    );

    const z = [3,5,4,7,9,10]
      .$shape([2,3])
      .$key(0, ['a','b'])
      .$$rcp(['b','a','a'], [0,2,1], null, V => V.mean());
    test('$$rcp-3',
      z,
      [3,6,6,7,6,10].$shape([2,3]).$key(0, ['a','b'])
    );

    const a = [3,4];
    a.$$rcp(0, 0, 0, (v, aa) => {
      test('$$rcp-calling-array', aa, a);
      return;
    });

    assert.throw('throw-$$rcp-invalid-index',
      () => [3,4].$$rcp(2, 0, 0, () => 10)
    );
  });

  runTests('$autoType', () => {

    const obj = {a:5},
          x = ['5', 'uv', 'false', 'true', 'undefined',
               'null', 'Infinity', obj, '', ' true']
            .$shape(2)
            .$key(0, ['a','b']);
    test('$autoType-0', x.$autoType(), 
      [5, 'uv', false, true, undefined, null, Infinity, obj, undefined, ' true']
        .$shape(2)
        .$key(0, ['a', 'b']));
    test('$autoType-1', ['', ' '].$autoType(), [undefined, 0]);
    test('$autoType-2', ['', 3, true, null, undefined].$autoType(''), 
      ['', 3, true, null, undefined]);
    test('$autoType-3', [''].$autoType(5), [5]);
  });
  
  runTests('which', () => {
  
    test('which-empty-0', [].which(), []);
    test('which-empty-1', [].which(a => true), []);
    test('which-empty-2', [1,0].cube().which(), []);
    test('which-empty-3', [1,0].cube().which(a => true), []);
  
    test('which-singleton-0', [5].which(), [0]);
    test('which-singleton-1', [0].which(), []);
    test('which-singleton-2', [5].which(a => a > 2), [0]);
    test('which-singleton-3', [0].which(a => a > 2), []);

    const v = ['', 5, false, true, null, undefined];
    test('which-vector-0', v.which(), [1,3]);
    test('which-vector-1', v.which(undefined), [1,3]);
    test('which-vector-2', v.which(a => !a), [0,2,4,5]);
    test('which-vector-3', v.which([a => !a]), [0,2,4,5]);
    test('which-vector-4', v.which((a,i) => i % 2 === 0), [0,2,4]);
    test('which-vector-5', v.which((a,i,u) => typeof u[i] === 'boolean'), [2,3]);
    test('which-vector-6', [4].cube().which(), []);
    test('which-vector-7', [4].cube().which(a => !a), [0,1,2,3]);
    test('which-vector-8', [4].cube(1).which(), [0,1,2,3]);
  
    const b = [11,12,13,14,15,16,17,18,19,20,
               21,22,23,24,25,26,27,28,29,30,
               31,32,33,34]
      .$shape([3,4,2])
      .$key(0,['Alice','Bob','Cath'])
      .$key(2,['Autumn','Spring'])
      .$label(0,'Student')
      .$label(1,'Subject')
      .$label(2,'Term');
    const allInd = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
    test('which-book-0', b.which(), allInd);
    test('which-book-1', b.which(a => a > 20 && a % 4 === 0), [13,17,21]);
    test('which-book-2', b.which(a => a > 100), []);
    test('which-book-3', b.which(a => a > 10), allInd);
    
    assert.throwEach('throw-which', [
      () => [1,0,2].which(null),
      () => [1,0,2].which([[a => a]]),
    ]);
  
  });
  
  runTests('entrywise: 0 args', () => {
    
    test('ew-neg',    [-2,3].neg(), [2,-3]);
    test('ew-sqrt',   [4,9].sqrt(), [2,3]);
    test('ew-cbrt',   [8,27].cbrt(), [2,3]);
    test('ew-abs',    [-2,3].abs(), [2,3]);
    test('ew-round',  [-1.2,3.7].round(), [-1,4]);    
    test('ew-floor',  [-1.2,3.7].floor(), [-2,3]);
    test('ew-ceil',   [-1.2,3.7].ceil(), [-1,4]);
    test('ew-trunc',  [-1.2,3.7].trunc(), [-1,3]);
    test('ew-sign',   [-1.2,3.7].sign(), [-1,1]);
    test('ew-exp',    [1,2].exp().toFixed(2), ['2.72','7.39']);
    test('ew-expm1',  [1,2].expm1().toFixed(2), ['1.72','6.39']);
    test('ew-log',    [1,2].log().toFixed(2), ['0.00','0.69']);
    test('ew-log10',  [1,10].log10(), [0,1]);
    test('ew-log2',   [1,2].log2(), [0,1]);
    test('ew-log1p',  [0,1].log1p().toFixed(2), ['0.00','0.69']);
    test('ew-sin',    [-2,3].sin().toFixed(2), ["-0.91", "0.14"]);
    test('ew-cos',    [-2,3].cos().toFixed(2), ["-0.42", "-0.99"]);
    test('ew-tan',    [-2,3].tan().toFixed(2), ["2.19", "-0.14"]);
    test('ew-asin',   [-1,0.5].asin().toFixed(2), ["-1.57", "0.52"]);
    test('ew-acos',   [-1,0.5].acos().toFixed(2), ["3.14", "1.05"]);
    test('ew-atan',   [-1,0.5].atan().toFixed(2), ["-0.79", "0.46"]);
    test('ew-sinh',   [-2,3].sinh().toFixed(2), ["-3.63", "10.02"]);
    test('ew-cosh',   [-2,3].cosh().toFixed(2), ["3.76", "10.07"]);
    test('ew-tanh',   [-2,3].tanh().toFixed(2), ["-0.96", "1.00"]);
    test('ew-asinh',  [-1,0.5].asinh().toFixed(2), ["-0.88", "0.48"]);
    test('ew-acosh',  [1,1.5].acosh().toFixed(2), ["0.00", "0.96"]);
    test('ew-atanh',  [-0.5,0].atanh().toFixed(2), ["-0.55", "0.00"]);
    test('ew-number-0', ['-2',false].number(), [-2,0]);
    test('ew-string', [-2,true].string(), ['-2','true']);
    test('ew-boolean',[null,5].boolean(), [false,true]);
    test('ew-isInteger',   [-2,3.4].isInteger(), [true,false]);
    test('ew-isFinite',    [-2,'3'].isFinite(), [true,false]);
    test('ew-isNaN',       [-2,NaN].isNaN(), [false,true]);
    test('ew-toLowerCase', ['a','B'].toLowerCase(), ['a','b']);
    test('ew-toUpperCase', ['a','B'].toUpperCase(), ['A','B']);
    test('ew-trim',        [' a ','b '].trim(), ['a','b']);
    test('ew-not',         [true,null].not(), [false,true]);
    test('ew-typeof',      [-2,'a'].typeof(), ['number','string']);
    assert('ew-box',       () => _isEqual([-2,['a']].box(), [[-2],['a']]), true);
    assert('ew-unbox',     () => _isEqual([-2,['a','b'],[]].unbox(), [-2,'a',undefined]), true);
    
    const dt = ['Dec 2020', 'July 15 2030'].date();
    assert('ew-date-0', () => dt[0].getMonth(), 11);
    assert('ew-date-1', () => dt[1].getDate(),  15);
    
    test('ew-number-1', [].number(), []);
    test('ew-number-2', 
         [2,0,3].cube().$key(0, ['a','b']).number(),
         [2,0,3].cube().$key(0, ['a','b']));
    
    const b = [1,'2',false,'Infinity']
      .$shape([2,1,2])
      .$key(1, 'a')
      .$key(2, ['U','V'])
      .$label(0, 'rows')
      .$label(2, 'pages');
    test('ew-number-3',
         b.number(), 
         b.copy('shell').$vec(null, [1,2,0,Infinity]));
    
    assert.throwEach('throw-ew-no-arg', [
      () => [5].toUpperCase(),
      () => [5].toLowerCase(),
      () => ['a',false].trim()
    ]);
  
  });
  
  runTests('entrywise: cond', () => {

    const s = [2].$key(1, 'a'),
          v = [1, 0, undefined, 's'],
          m = [10,20,30,40].$shape([2,2]).$key(0,['u','v']).$label(2,'p'),
          b = [0, 1, null, true].$shape([1,2,2]),
          e = [].$shape([0,100]).$key(2,'b');
    
    test('cond-0', [true].cond(s, 3), [2]);
    test('cond-1', [false].cond(s, 3), [3]);
    test('cond-2', s.cond(4,5), [4].$key(1, 'a'));
    test('cond-3', v.cond(b, 55), [0, 55, 55, true]);
    test('cond-4',
         b.cond(m, v),
         [1, 20, undefined, 40].$shape([1,2,2]));
    test('cond-5',
         m.cond(null, 66),
         [4].cube(null).$shape([2,2]).$key(0,['u','v']).$label(2,'p'));
    
    test('cond-empties-0', [].cond([], []), []);
    test('cond-empties-1', e.cond(5, [].$shape([0,0,0])), e);
    
    let i = 0;
    test('cond-no-short-circuit-0', [true].cond(5, ++i), [5]);
    assert('cond-no-short-circuit-1', () => i, 1);
    test('cond-no-short-circuit-2', v.cond(5, ++i), [5,2,2,5]);
    assert('cond-no-short-circuit-3', () => i, 2);
    
    assert.throwEach('throw-cond', [
      () => v.cond([2,3], 4),
      () => v.cond([2], [3,4]),
      () => s.cond(v, m),
    ]);
    
  });
  
  runTests('entrywise: call', () => {
    
    const s = [2].$key(1, 'a'),
          v = [1, 0, undefined, 's'],
          m = [10,20,30,40].$shape([2,2]).$key(0,['u','v']).$label(2,'p'),
          b = [0, 1, null, true].$shape([1,2,2]),
          e = [].$shape([0,100]).$key(2,'b'),
          f1  = a            => a + 10,
          f2  = (a, b)       => a + b,
          f2s = (a, b)       => '' + a + b,
          f3  = (a, b, c)    => (a + b) * c,
          f4  = (a, b, c, d) => (a + b) * c - d,
          f4s = (a, b, c, d) => '' + a + b + c + d;
    
    test('call-0', s.call(f1), [12].$key(1, 'a'));
    test('call-1', [3,4,5,6].call(f2,[7,8,9,10]), [10,12,14,16]);
    test('call-2', m.call(f2, s), m.copy('shell').$vec(null, [12,22,32,42]));
    test('call-3',
         m.call(f2s),
         m.copy('shell').$vec(null, ['10undefined','20undefined','30undefined','40undefined']));
    test('call-4', m.call(f2s, b), m.copy('shell').$vec(null, ['100','201','30null','40true']));
    test('call-5',
         m.call(f3, 3, [4,5,6,7]),
         m.copy('shell').$vec(null, [52,115,198,301]));
    test('call-6',
         m.call([f4], 3, [4,5,6,7], [1,2,3,4]),
         m.copy('shell').$vec(null, [51,113,195,297]));
    test('call-7',
         m.call(f4s, 2, [3]),
         m.copy('shell').$vec(null, ['1023undefined','2023undefined','3023undefined','4023undefined'])); 
    
    test('call-empty-0', [].call(f1), []);
    test('call-empty-1', e.call(f1), e.copy());
    test('call-empty-2', e.call(f2,5), e.copy());
    test('call-empty-3', e.call(f3,[],5), e.copy());
    test('call-empty-4', e.call(f4,[],5,6), e.copy());
    
    assert.throwEach('throw-call', [
      () => m.call(f1, [5,5]),
      () => m.call(f1, []),
      () => m.call(f1, 5, [6,6]),
      () => m.call(f1, 5, []),
      () => m.call(f1, 5, 6, [7,7]),
      () => m.call(f1, 5, 6, []),
      () => m.call([f1,5]),
      () => m.call(5),
      () => [].call(5),
      () => m.call([5]),
      () => m.call()
    ]);
    
  });

  runTests('$$call', () => {

    let x = [3,4];
    test('$$call-0',
      x.$$call(v => v + 10),
      [13, 14]
    );

    x = [2,3].cube()  //array of holes
      .$key(1, ['a','b','c'])
      .$$call((v,s) => v + s, ['!', '.',',','&','?','|']);
    test('$$call-1',
      x,
      ['undefined!','undefined.','undefined,','undefined&','undefined?','undefined|']
        .$shape(2)
        .$key(1, ['a','b','c']),
    );

    let y,
        z = 0;
    x = [3,4]
      .$before((ar, setterName, args) => {
        y = `${ar.join()}, ${setterName}, ${args.join()}`;
      })
      .$after([() => z += 2, () => z *= 5]);
    x.$$call((v, a, b) => v + a + b, 20, [500,600]);
    test('$$call-update-0',
      x,
      [523, 624]
    )
    assert('$$call-update-1', () => y === '3,4, $call, 523,624', true);
    assert('$$call-update-2', () => z === 10, true);

    assert.throw('throw-$$call-not-a-function',
      () => [3,4].$$call(5)
    );

  });
  
  runTests('entrywise: method', () => {
    
    const s = ['z'].$key(1, 'a'),
          v = ['abc','defg','hijkl','mnopqrstu'],
          m = ['a','bc','def','ghij'].$shape([2,2]).$key(0,['u','v']).$label(2,'p'),
          b = [1,0,3,2].$shape([1,2,2]),
          e = [].$shape([0,100]).$key(2,'b');

    test('method-0', s.method('toUpperCase'), ['Z'].$key(1, 'a'));
    test('method-1', 
         m.method('toUpperCase'),
         m.copy('shell').$vec(null, ['A','BC','DEF','GHIJ']));
    test('method-2',
         v.method('charAt',[1,2,3,4]),
         ['b','f','k','q']);
    test('method-3',
         m.method('charAt', [1]),
         m.copy('shell').$vec(null, ['','c','e','h']));
    test('method-4',
         m.method('charAt'),
         m.copy('shell').$vec(null, ['a','b','d','g']));
    test('method-5',
         v.method('slice', 0, b),
         ['a','','hij','mn']);
    test('method-6',
         v.method('slice', b, 6),
         ['bc','defg','kl','opqr']);
    test('method-7',
         m.method(['concat'], v, s, b),
         m.copy('shell').$vec(null, ['aabcz1','bcdefgz0','defhijklz3','ghijmnopqrstuz2']));
    test('method-8',
         m.method(['concat'], 'q', undefined, [5]),
         m.copy('shell').$vec(null, ['aqundefined5','bcqundefined5','defqundefined5','ghijqundefined5']));
  
    test('method-empty-0', [].method('toUpperCase'), []);
    test('method-empty-1', e.method('toUpperCase'), e.copy());
    test('method-empty-2', e.method('charAt',5), e.copy());
    test('method-empty-3', e.method('slice',[],5), e.copy());
    test('method-empty-4', e.method('slice',[],[5]), e.copy());
    test('method-empty-5', e.method('concat',[],'q','w'), e.copy());
    
    assert.throwEach('throw-method', [
      () => m.method('toUpperCase', [5,5]),
      () => m.method('toUpperCase', []),
      () => m.method('toUpperCase', 5, [6,6]),
      () => m.method('toUpperCase', 5, []),
      () => m.method('toUpperCase', 5, 6, [7,7]),
      () => m.method('toUpperCase', 5, 6, []),
      () => m.method(['toUpperCase',5])
    ]);

  });

  runTests('entrywise: apply', () => {

    const fs_0 = () => 5,
          f_0 = [
            () => 6,
            () => 7
          ],
          f_1 = [
            a => 2 * a,
            a => 3 * a,
            a => 4 * a
          ],
          f_2 = [
            (a, b) => a + b,
            (a, b) => a - b,
          ],
          f_3 = [
            (a, b, c) => a + b + c,
            (a, b)    => a + b,
            (a, b, c) => a - b - c,
            ()        => 'xyz'
          ].$shape(2)
           .$key(1, ['u', 'v'])
           .$label(0, 'rows');
    
    test('apply-empty-0', [].apply(), []);
    test('apply-empty-1', [].apply([]), []);
    test('apply-empty-2', [].apply(5, []), []);
    test('apply-empty-3', [].$key(0, []).apply(5, [], [6]), [].$key(0, []));
    
    test('apply-single-function', [fs_0].apply(), [5]);

    test('apply-no-args-0', f_0.apply(), [6,7]);
    test('apply-no-args-1', f_0.apply(1, [2, 3]), [6,7]);

    test('apply-1-arg-0', f_1.apply(10), [20, 30, 40]);
    test('apply-1-arg-1', f_1.apply([3,4,5]), [6, 12, 20]);
    test('apply-1-arg-2', f_1.apply([3,4,5], 100, 200), [6, 12, 20]);
        
    test('apply-2-arg-0', f_2.apply(15, 8), [23, 7]);
    test('apply-2-arg-1', f_2.apply([15, 20], 8), [23, 12]);
    test('apply-2-arg-2', f_2.apply(15, [8,4]), [23, 11]);
    test('apply-2-arg-3', f_2.apply([15, 20], [8,4]), [23, 16]);

    test('apply-3-arg-0', f_3.apply(5, 6, 7), 
      [18, 11, -8, 'xyz'].$shape(2).$key(1, ['u', 'v']).$label(0, 'rows'));
    test('apply-3-arg-1', f_3.apply(5, [6, 7, 8, 9].tp(), 10),
      [21, 12, -13, 'xyz'].$shape(2).$key(1, ['u', 'v']).$label(0, 'rows'));
    test('apply-3-arg-2', f_3.apply([5, 6, 7, 8], 9, [10, 11, 12, 13]),
      [24, 15, -14, 'xyz'].$shape(2).$key(1, ['u', 'v']).$label(0, 'rows'));
    test('apply-3-arg-3', f_3.apply([5, 6, 7, 8], [8, 9, 10, 11], [12, 13, 14, 15]),
      [25, 15, -17, 'xyz'].$shape(2).$key(1, ['u', 'v']).$label(0, 'rows'));

    assert.throw('throw-apply-empty-shape-mismatch-0',
      () => [].apply([2,3]));
    assert.throw('throw-apply-empty-shape-mismatch-1',
      () => [].apply(null, [2, 3]));
    assert.throw('throw-apply-empty-shape-mismatch-2',
      () => [].apply(null, null, [2, 3]));
    assert.throw('throw-apply-shape-mismatch-0',
      () => f_1.apply([2, 3]));
    assert.throw('throw-apply-shape-mismatch-1',
      () => f_1.apply([]));
    assert.throw('throw-apply-shape-mismatch-2',
      () => f_3.apply(1,2,[3,4,5]));
    assert.throw('throw-apply-not-a-function-0',
      () => [5].apply());
    assert.throw('throw-apply-not-a-function-1',
      () => [()=>5, 6].apply());

  });

  runTests('entrywise: loop', () => {

    let x, u, v, w;
    const init = (n = 2) => {
      const obj = () => {
        const o = {};
        o.prop1 = '';
        o.prop2 = '';
        o.meth1 = () => u++;
        o.meth2 = (a) => v += a;
        o.meth3 = (a, b) => w += a + b;
        return o;
      };
      x = [];
      for (let i=0; i<n; i++) x.push(obj());
      u = v = w = 0;
    };

    init();
    x.loop(
      ['$prop1', 5]
    );
    test('loop-1-property-0', x.map(e => e.prop1), [5, 5]);
    
    init();
    x.loop(
      ['$prop1', [5,6]]
    );
    test('loop-1-property-1', x.map(e => e.prop1), [5, 6]);
    
    init();
    x.loop(
      ['$prop1', [5, 6]],
      ['$prop2', [7, 8]]
    );
    test('loop-2-property-a', x.map(e => e.prop1), [5, 6]);
    test('loop-2-property-b', x.map(e => e.prop2), [7, 8]);

    init();
    x.loop(
      ['meth1']
    );
    assert('loop-1-method-no-arg-0', () => u, 2);

    init();
    x.loop(
      'meth1'
    );
    assert('loop-1-method-no-arg-1', () => u, 2);

    init();
    x.loop(
      ['meth2', [5,6]]
    );
    assert('loop-1-method-1-arg', () => v, 11);

    init();
    x.loop(
      ['meth3', [5, 6], 7]
    );
    assert('loop-1-method-2-arg', () => w, 25);

    init();
    x.loop(
      ['meth3', [5, 6], 7],
      ['meth1']
    );
    assert('loop-2-method-a', () => u, 2);
    assert('loop-2-method-b', () => w, 25);

    init();
    x.loop(
      ['meth1'],
      ['meth2', [5, 6]],
      ['meth3', [7], [9, 10]]
    );
    assert('loop-3-method-a', () => u, 2);
    assert('loop-3-method-b', () => v, 11);
    assert('loop-3-method-c', () => w, 33);

    init();
    x.loop(
      ['meth1'],
      [['$prop2'], [5, 6]],
      ['meth3', [7], [9, 10]]
    );
    assert('loop-mix-a', () => u, 2);
    test('loop-mix-b', x.map(e => e.prop2), [5, 6]);
    assert('loop-mix-c', () => w, 33);
    
    init();
    x.loop();
    assert('loop-no-args', 
      () => {
        return u === 0 && v === 0 && w === 0 &&
        x[0].prop1 === '' && x[0].prop2 === '' &&
        x[1].prop1 === '' && x[1].prop2 === ''
      }, true);

    init(0);
    x.loop(
      ['meth1'],
      ['$prop1', 'a'],
      ['$prop2', []],
      ['meth3', 7, []]
    );
    assert('loop-empty-calling-a', () => u, 0);
    test('loop-empty-calling-b', x.map(e => e.prop1), []);
    test('loop-empty-calling-c', x.map(e => e.prop2), []);
    assert('loop-empty-calling-d', () => w, 0);

    init(1);
    x.loop(
      ['meth1'],
      ['$prop1', 5],
      ['$prop2', [10, 15, 20]],
      ['meth2', ['a', 'b', 'c']],
      ['meth3', 70, [80, 90, 100]]
    );
    assert('loop-singleton-calling-a', () => u, 3);
    test('loop-singleton-calling-b', x.map(e => e.prop1), [5]);
    test('loop-singleton-calling-c', x.map(e => e.prop2), [20]);
    assert('loop-singleton-calling-d', () => v, '0abc');
    assert('loop-singleton-calling-e', () => w, 480);

    init();
    assert.throw('throw-loop-shape-mismatch-0',
      () => x.loop(['$prop1', [5, 6, 7]])
    );

    init(0);
    assert.throw('throw-loop-shape-mismatch-1',
      () => x.loop(['$prop1', [5, 6, 7]])
    );

    init();
    assert.throw('throw-loop-shape-mismatch-2',
      () => x.loop(['meth2', [5, 6, 7]])
    );

    init(0);
    assert.throw('throw-loop-shape-mismatch-3',
      () => x.loop(['meth2', [5, 6, 7]])
    );

    init();
    assert.throw('throw-loop-shape-mismatch-4',
      () => x.loop(['meth2', []])
    );

    init();
    assert.throw('throw-loop-shape-mismatch-5',
      () => x.loop([()=>5, []])
    );

    init();
    assert.throw('throw-loop-shape-mismatch-6',
      () => x.loop([()=>5, [6,7], [8,9,10]])
    );

    init();
    assert.throw('throw-loop-empty-arg',
      () => x.loop([])
    );

    init();
    assert.throw('throw-loop-property-arguments-0',
      () => x.loop(['$prop1'])
    );

    init();
    assert.throw('throw-loop-property-arguments-1',
      () => x.loop(['$prop1', 5, 6])
    );

    init();
    assert.throw('throw-loop-non-singleton-name',
      () => x.loop([['meth1', 'meth2']])
    );

    init();
    assert.throw('throw-loop-non-string-or-function',
      () => x.loop([5])
    );

    let f0 = () => u++,
        f1 = a => v += a.prop1,
        f2 = (a, b) => w = w += a.prop1 + b, 
        f3 = (a, b, c) => w += b + c,
        f4 = (a0, a1, a2, a3) => u += a3,
        f5 = (a0, a1, a2, a3, a4) => v += a4,
        f6 = (a0, a1, a2, a3, a4, a5) => w += a0.prop2 + a1 + a2 + a3 + a4 + a5;

    init();
    x[0].prop1 = 100;
    x[1].prop1 = 200;
    x.loop(
      [f0],
      [f1],
      [f2, 5],
      [f3, [10,20], 30]
    );
    assert('loop-function-0-a', () => u, 2);
    assert('loop-function-0-b', () => v, 300);
    assert('loop-function-0-c', () => w, 400);

    init();
    x.loop(
      ['$prop1', [100, 200]],
      ['$prop2', 500],
      [f1],
      [f6, 7, 8, [9,10], 11, [12,13]],
      f0
    );
    assert('loop-function-1-a', () => u, 2);
    assert('loop-function-1-b', () => v, 300);
    assert('loop-function-1-c', () => w, 1096);

    init(1);
    x.loop(
      [f4, 5, 6, 7],
      [f5, 8, 9, 10, 11]
    );
    assert('loop-function-2-a', () => u, 7);
    assert('loop-function-2-b', () => v, 11);
    
    init(1);
    x.loop(
      ['$prop1', [100, 200, 300]],
      [f2, [10, 20, 30]],
      [f4, 5, 6, [7, 8, 9]],
    );
    assert('loop-function-3-a', () => w, 660);
    assert('loop-function-3-b', () => u, 24);
  });

  runTests('$$prop', () => {

    let x, obj0, obj1, obj2, obj3;
    
    obj0 = {a:5, b:6};
    obj1 = {a:7};
    x = [obj0, obj1];
    x.$$prop('b', xi => xi.b + '!');
    assert('$$prop-0', () => _isEqual(
      x,
      [{a:5, b:'6!'}, {a:7, b:'undefined!'}]
    ), true);

    obj0 = {a:5, b:6};
    obj1 = {a:7};
    obj2 = {a:8, b:9};
    obj3 = {a:10, b:11};
    x = [obj0, obj1, obj2, obj3]
      .$shape(2)
      .$key(1, ['u','v'])
      .$$prop('a', xi => xi.a + 10);
    test('$$prop-1',
      x,
      [obj0, obj1, obj2, obj3]
        .$shape(2)
        .$key(1, ['u','v'])
    );
    assert('$$prop-2', () => _isEqual(
      x,
      [{a:15, b:6}, {a:17}, {a:18, b:9}, {a:20, b:11}]
    ), true);
    x.$$prop('a', (ui, v) => v.prop('a').sum(-1)[0])
    test('$$prop-calling-array-0',
      x,
      [obj0, obj1, obj2, obj3]
        .$shape(2)
        .$key(1, ['u','v'])
    );
    assert('$$prop-calling-array-1', () => _isEqual(
      x,
      [{a:70, b:6}, {a:70}, {a:70, b:9}, {a:70, b:11}]
    ), true);

    test('$$prop-empty', [].$$prop('a', xi => xi.a + 10), []);

    x = [{a:5}, undefined];
    assert.throw('throw-$$prop-undefined',
      () => x.$$prop('a', xi => xi.a + 10)
    );
    assert('$$prop-unchanged', () => _isEqual(
      x,
      [{a:5}, undefined]
    ),true);
  });

  runTests('unpack', () => {

    test('unpack-empty-0', [].unpack(), [0,1,1].cube());
    test('unpack-empty-1', [1,0,1].cube().unpack(), [1,0,1].cube());
    test('unpack-empty-2', [1,1,0].cube().unpack(), [1,1,0].cube());

    test('unpack-1-entry-0', [[5]].unpack(), [5]);
    test('unpack-1-entry-1', [[5,6]].unpack(), [5,6]);
    test('unpack-1-entry-2', [[5,6].tp()].unpack(), [5,6].tp());
    test('unpack-1-entry-3', [[5,6].tp([1,2,0])].unpack(), [5,6].tp([1,2,0]));
    test('unpack-1-entry-4', [[]].unpack(), []);
    test('unpack-1-entry-5', [[5,6].$key(0, ['a','b'])].unpack(), [5,6].$key(0, ['a','b']));

    let x;
    
    x = [[5,6], [7,8,9]];
    test('unpack-2-entry-0', x.unpack(), [5,6,7,8,9]);

    x = [[5,6,7].tp(), [11,12,13,14,15,16].$shape(2)]
    test('unpack-2-entry-1', x.unpack(), [5,11,12,6,13,14,7,15,16].$shape(3));
    
    x = [[2, 1, 0].cube(), [5, 6]].$shape([1, 1, 2]);
    x = test('unpack-2-entry-2', x.unpack(), [5,6]);

    x = [[], [0,3,1].cube()].tp();
    x = test('unpack-2-entry-3', x.unpack(), [0,4,1].cube());

    x = [[5],[6],[7]];
    x = test('unpack-3-entry', x.unpack(), [5,6,7]);

    x = [
      [5,6].$key(0, ['a','b']).$key(1, 'i').$key(2, 'I')
        .$label(0, 'rows').$label(1, 'cols').$label(2, 'pages'), 
      [7,8,9,10].$shape(2).$key(1, ['ii','iii']),
      [2,0,1].cube().$key(1, []),
      [11,12,13,14,15,16].$shape(2).$key(1, ['iv','v','vi'])
    ].tp();
    test('unpack-4-entry', x.unpack(), [5,6,7,8,9,10,11,12,13,14,15,16].$shape(2)
      .$key(0, ['a','b']).$key(1, ['i','ii','iii','iv','v','vi']).$key(2, 'I')
      .$label(0, 'rows').$label(1, 'cols').$label(2, 'pages'));

    assert.throw('throw-unpack-max-entries',
      () => (new Array(65537)).fill([5]).unpack()
    );
    assert.throw('throw-unpack-shape-mismatch-0',
      () => [[5,6], [7,8,9]].tp().unpack()
    );
    assert.throw('throw-unpack-shape-mismatch-1',
      () => [[5, 6].tp(), [7, 8, 9].tp()].unpack()
    );
    assert.throw('throw-unpack-non-array-entry-0',
      () => [5, [6,7]].unpack()
    );
    assert.throw('throw-unpack-non-array-entry-1',
      () => [[6, 7], 5].unpack()
    );
    assert.throw('throw-unpack-non-vector',
      () => [[5], [6], [7], [8]].$shape(2).unpack()
    );
    assert.throw('throw-unpack-missing-keys',
      () => [[5,6].$key(0, ['a','b']), [7,8]].unpack()
    );
    
  });

  runTests('pack', () => {

    let x, y;

    x = [4, 5, 6];
    assert('pack-array-rows',
      () => _isEqual(x.pack(), [[4], [5], [6]]), true);
    assert('pack-array-cols',
      () => _isEqual(x.pack(1), [[4, 5, 6]]), true);
    assert('pack-array-pages',
      () => _isEqual(x.pack(2), [[4, 5, 6]]), true);

    x = [4, 5, 6, 7, 8, 9]
      .$shape([3 ,2])
      .$key(0, ['a', 'b', 'c'])
      .$key(1, ['u', 'v'])
      .$label(1, 'cols');
    
    y = x.pack();
    test('pack-matrix-rows-shell', y.copy('shell'), 
      [3].cube().$key(0, ['a','b','c']));
    test('pack-matrix-rows-0', y[0],
      [4,7].tp().$key(0, 'a').$key(1, ['u', 'v']).$label(1, 'cols'));
    test('pack-matrix-rows-1', y[1],
      [5,8].tp().$key(0, 'b').$key(1, ['u', 'v']).$label(1, 'cols'));
    test('pack-matrix-rows-2', y[2],
      [6,9].tp().$key(0, 'c').$key(1, ['u', 'v']).$label(1, 'cols'));
    
    y = x.pack(1);
    test('pack-matrix-cols-shell', y.copy('shell'), 
      [1,2].cube().$key(1, ['u','v']).$label(1, 'cols'));
    test('pack-matrix-cols-0', y[0],
      [4,5,6].$key(0, ['a','b','c']).$key(1, 'u').$label(1, 'cols'));
    test('pack-matrix-cols-1', y[1],
      [7,8,9].$key(0, ['a','b','c']).$key(1, 'v').$label(1, 'cols'));

    y = x.pack(2);
    test('pack-matrix-pages-shell', y.copy('shell'), [undefined]);
    test('pack-matrix-pages-0', y[0], x);

    x = [4,5,6,7,8,9,10,11,12,13,14,15].$shape([2,3,2]);     
    y = x.pack(2);
    test('pack-cube-pages-shell', y.copy('shell'), [1,1,2].cube());
    test('pack-cube-pages-0', y[0], [4,5,6,7,8,9].$shape([2,3]));
    test('pack-cube-pages-1', y[1], [10,11,12,13,14,15].$shape([2,3]));

    x = [0].cube();
    y = x.pack(0);
    test('pack-empty-array-rows-shell', y.copy('shell'), [0,1,1].cube());
    y = x.pack(1);
    test('pack-empty-array-cols-shell', y.copy('shell'), [1,1,1].cube()); 
    test('pack-empty-array-cols-0', y[0], [0,1,1].cube());
    y = x.pack(2);
    test('pack-empty-array-pages-shell', y.copy('shell'), [1,1,1].cube()); 
    test('pack-empty-array-pages-0', y[0], [0,1,1].cube());

    x = [2,0,1].cube()
      .$key(0, ['a','b'])
      .$key(1, []);
    y = x.pack(undefined);
    test('pack-empty-matrix-rows-shell', y.copy('shell'),
      [2,1,1].cube().$key(0, ['a','b']));
    test('pack-empty-matrix-rows-0', y[0], [1,0,1].cube().$key(0, 'a').$key(1, [])); 
    test('pack-empty-matrix-rows-1', y[1], [1,0,1].cube().$key(0, 'b').$key(1, [])); 
    y = x.pack(1);
    test('pack-empty-matrix-cols-shell', y.copy('shell'), [1,0,1].cube().$key(1, []));
    y = x.pack(2);
    test('pack-empty-matrix-pages-shell', y.copy('shell'), [1,1,1].cube());
    test('pack-empty-matrix-pages-0', y[0], x); 
  
    x = [5,6,7,8].$shape([2,2]).$key(0, ['a','b']);
    y = x.pack(0, 'array');
    test('pack-subcube-type-shell', y.copy('shell'), [2,1,1].cube().$key(0, ['a','b']));
    test('pack-subcube-type-rows-0', y[0], [5,7]);
    test('pack-subcube-type-rows-1', y[1], [6,8]);

    assert.throw('throw-pack-dim-0', () => [3,4].pack(3));
    assert.throw('throw-pack-dim-1', () => [3,4].pack([0,1]));
    assert.throw('throw-pack-subcube-0', () => [3,4].pack(0, 'a'));
    assert.throw('throw-pack-subcube-1', () => [3,4].pack(0, ['array', 'core']));
  });

  runTests('matrix', () => {
    
    //from dsv
    {
      
      //corner cases
      test( 'matrix-from-dsv-corner-case-0',
            ['\n'].matrix(',', false),
            [''] );
      test( 'matrix-from-dsv-corner-case-1',
            ['\n\n'].matrix(',', false),
            ['',''] );
      test( 'matrix-from-dsv-corner-case-2',
            [','].matrix(',', false),
            [1,2].cube('') );
      test( 'matrix-from-dsv-corner-case-3',
            [',,'].matrix(',', false),
            [1,3].cube('') );
      test( 'matrix-from-dsv-corner-case-4',
            [',\n,'].matrix(',', false),
            [2,2].cube('') );
      test( 'matrix-from-dsv-corner-case-5',
            ['\n\n'].matrix(','),
            [''].$key(1,'') );

      //different length rows
      const d = '3,4\n,5\n6,7,8,9\n10';
      test( 'matrix-from-dsv-diff-length-rows-0',
            dc.matrix(d, ',', false),
            ['3','','6','10','4','5','7',,].$shape(4) );
      test( 'matrix-from-dsv-diff-length-rows-1',
            dc.matrix(d, ',', true),
            ['','6','10','5','7',,].$shape(3).$key(1,['3','4']) );
      
      //single entry
      test( 'matrix-from-dsv-single-entry-0',
            ['3.4'].matrix(',', false),
            ['3.4'] );
      test( 'matrix-from-dsv-single-entry-1',
            ['3.4\n'].matrix(',', false),
            ['3.4'] );
      
      //vector
      const v = '3.4\n5\n a b ';
      test( 'matrix-from-dsv-vector-0',
            [v].matrix(',', false),
            ['3.4','5',' a b '] );
      test( 'matrix-from-dsv-vector-1',
            [v].matrix(','),
            ['5',' a b '].$key(1, '3.4') );          
            
      //single row
      test( 'matrix-from-dsv-single-row-0',
            ['5|6|7'].matrix('|', false),
            ['5','6','7'].tp() );
      
      //single row with keys
      test( 'matrix-from-dsv-single-row-1',
            ['"a\nb"|c"d|e\'f\n"g\nh"|i"j|k\'l'].matrix('|'),
            ['g\nh','i"j','k\'l'].tp().$key(1, ['a\nb','c"d','e\'f']) );
      
      //standard - multiple rows and columns
      const m = '5,a,false,{a:6}\n()=>7,Dec 2020,null,NaN\nundefined,[],{}, b c ';
      test( 'matrix-from-dsv-standard-0',
            [m].matrix(',', false),
            ['5','()=>7','undefined','a','Dec 2020','[]',
             'false','null','{}','{a:6}','NaN',' b c ']
              .$shape(3) );
      test( 'matrix-from-dsv-standard-1',
            [m].matrix(',', [1]),
            ['()=>7','undefined','Dec 2020','[]','null','{}','NaN',' b c ']
              .$shape(2)
              .$key(1, ['5','a','false','{a:6}']) );
      
      //strip BOM
      const b = '\uFEFF5,6\n7,8';
      test( 'matrix-from-dsv-strip-BOM-0',
            [b].matrix(',', false),
            ['5','7','6','8'].$shape(2) );
      test( 'matrix-from-dsv-strip-BOM-1',
            [b].matrix(','),
            ['7','8'].tp().$key(1, ['5','6']) );
      
      assert.throw( 'throw-matrix-from-dsv-empty-0',
                    () => [''].matrix(',',false) );
      assert.throw( 'throw-matrix-from-dsv-empty-1',
                    () => [''].matrix(',') );
      assert.throw( 'throw-matrix-from-dsv-empty-2',
                    () => ['\n'].matrix(',') );  //first line used as key so array empty
      assert.throw( 'throw-matrix-from-dsv-empty-3',
                    () => [','].matrix(',') );  //first line used as keys so array empty
      assert.throw( 'throw-matrix-from-dsv-duplicate-column-keys-0',
                    () => [',,\n,,'].matrix(',') );
      assert.throw( 'throw-matrix-from-dsv-duplicate-column-keys-1',
                    () => ['3,4,3\n5,6,7'].matrix(',') );
      assert.throw( 'throw-matrix-from-dsv-not-string',
                    () => [3.4].matrix(',', false) );  //strip-bom throws
      assert.throw( 'throw-matrix-from-dsv-not-1-entry',
                    () => ['3,4\n5,6',null].matrix(',', false) );
      
    }

    //from array of arrays
    {
      
      const stem = 'matrix-from-array-of-arrays';
      
      //corner cases
      test( stem + '-corner-case-0',
            [[]].matrix(),
            [1,0].cube() );
      test( stem + '-corner-case-1',
            [[], []].matrix(),
            [2,0].cube() );
      test( stem + '-corner-case-2',
            [ (new Array(3)) ].matrix(),
            [1,3].cube() );
      test( stem + '-corner-case-3',  //shape, keys and labels of inner arrays ignored
            [
              [2,3,4,5].$shape(2)
                .$label(0, 'rows')
                .$label(1, 'cols')
                .$key(0, ['a','b'])
                .$key(1, ['A', 'B']),
              [6,7,8,9].$shape([1,1,4])    
            ].matrix(),
            [2,6,3,7,4,8,5,9].$shape(2) );
      test( stem + '-corner-case-4',  //shape, keys and labels of outer array ignored
            [ [2,3],
              [4,5],
              [6,7],
              [8,9]
            ].$shape(2)
             .$label(0, 'rows')
             .$label(1, 'cols')
             .$key(0, ['a','b'])
             .$key(1, ['A','B'])
             .matrix(),
            [2,4,6,8,3,5,7,9].$shape(4) );

      //single row
      const obj = {a:5};
      test( stem + '-single-row',
            [ ['a',false,null,obj] ].matrix(),
            ['a',false,null,obj].tp() );
      
      //vector
      test( stem + '-vector',
            [ ['a'],[false],[null],[obj] ].matrix(),
            ['a',false,null,obj] );
      
      //standard - multiple rows and columns
      const arr = [6,7];
      test( stem + '-standard',
            [ 
              ['a'  , true     , 5],
              [null , obj      , Infinity],
              [arr  , obj      , 8],
              ['b c', undefined, 9 ]
            ].matrix(),
            ['a',null, arr,'b c',true,obj,obj,undefined,5,Infinity,8,9].$shape(4) );
      
      //different length rows
      test( stem + '-different-length-rows',
            dc.matrix([ 
              [5,  6,  7],
              [ ,  8,  9],
              [10, 11],
              [12, 13,,],
              [14, 15, 16, 17]
            ]),
            [5, undefined, 10, 12, 14, 6, 8, 11, 13, 15, 7, 9, undefined, undefined, 16].$shape(5) );
      
    }
    
    //from array of objects
    {

      const stem = 'matrix-from-array-of-objects';
      
      //corner cases
      test( stem + '-corner-case-0',
            [{}].matrix(),
            [1,0].cube().$key(1,[]) );
      test( stem + '-corner-case-1',
            [{}, {}].matrix(),
            [2,0].cube().$key(1,[]) );
      test( stem + '-corner-case-2',  //shape, keys and labels of outer array ignored
            [ {u:2, v:3},
              {u:4, v:5},
              {u:6, v:7},
              {v:9, u:8}
            ].$shape(2)
             .$label(0, 'rows')
             .$label(1, 'cols')
             .$key(0, ['a','b'])
             .$key(1, ['A','B'])
             .matrix().orderKey(1),
            [2,4,6,8,3,5,7,9].$shape(4).$key(1, ['u','v']) );

      //single row
      const obj = {a:5};
      test( stem + '-single-row',
            [ {u:'a', v:false, w:null, x:obj} ].matrix().orderKey(1),
            ['a',false,null,obj].tp().$key(1, ['u','v','w','x']) );
      
      //vector
      test( stem + '-vector',
            [ {u:'a'}, {u:false}, {u:null}, {u:obj} ].matrix(),
            ['a',false,null,obj].$key(1, 'u') );
      
      //standard - multiple rows and columns
      const arr = [6,7];
      test( stem + '-standard',
            dc.matrix([ 
              {u:'a'  , vv:true     , www:5},
              {u:null , vv:obj      , www:Infinity},
              {u:arr  , vv:obj      , www:8},
              {u:'b c', vv:undefined, www:9 }
            ]).orderKey(1),
            ['a',null, arr,'b c',true,obj,obj,undefined,5,Infinity,8,9] 
              .$shape(4).$key(1, ['u','vv','www']) );
      
      //missing-and-extra-properties
      test( stem + '-missing-and-extra-properties',
            [ 
              {v:5,  w:6,  u:7},
              {a:undefined , w:8,  u:9},
              {v:10, w:11},
              {u:12, b:13},
              {u:14, v:15, w:16, x:17}
            ].matrix().col(['v', 'w', 'u']),
            [5, undefined, 10, undefined, 15,
             6, 8, 11, undefined, 16,
             7, 9, undefined, 12, 14
            ].$shape(5).$key(1, ['v', 'w', 'u']) );
      
    }
    
    //invalid array
    {
      assert.throw( 'throw-matrix-invalid array-0',
                    () => [].matrix() );
      assert.throw( 'throw-matrix-invalid array-1',
                    () => [5].matrix() );
      assert.throw( 'throw-matrix-invalid array-2',
                    () => ['5'].matrix() );
      assert.throw( 'throw-matrix-invalid array-3',
                    () => ['5','6','7'].matrix() );
      assert.throw( 'throw-matrix-invalid array-4',
                    () => ['3,4,5\n6,7,8'].matrix() );
      assert.throw( 'throw-matrix-invalid array-5',
                    () => [[3,4], undefined].matrix() );
    }

  });
  
  runTests('arAr', () => {
    
    assert('arAr-empty-0', 
           () => _isEqual([].arAr(), []), true); 
    assert('arAr-empty-1',
           () => _isEqual([0,1].cube().arAr(), []), true); 
    assert('arAr-empty-2',
           () => _isEqual([0,2].cube().arAr(), []), true); 
    assert( 'arAr-empty-3',
           () => _isEqual([1,0].cube().arAr(), [[]]), true); 
    assert( 'arAr-empty-4',
           () => _isEqual([2,0].cube().arAr(), [[], []]), true);
    
    const obj = {a:5},
          arr = [6,7],
          v = [5, undefined, 'a', false, obj, null, arr],
          m = [3,4,5,6,7,8,9,10,11,12,13,14]
                .$shape(3)
                .$label(0, 'rows')
                .$label(1, 'cols')
                .$label(2, 'pages')
                .$key(0, ['a','b','c'])
                .$key(1, ['A','B','C','D'])
                .$key(2, 'P');
    
    assert( 'arAr-single-entry-0',
           () => _isEqual([5].arAr(), [[5]]), true);
    assert( 'arAr-single-entry-1',
           () => _isEqual([arr].arAr(), [[arr]]), true);
    assert( 'arAr-vector',
           () => _isEqual(v.arAr(), [[5],[undefined],['a'],[false],[obj],[null],[arr]]), true);
    assert( 'arAr-single-row',
           () => _isEqual(dc.arAr(v.tp()), [[5,undefined,'a',false,obj,null,arr]]), true);
    assert( 'arAr-multiple-rows-and columns-0',
           () => _isEqual(m.arAr(),
                          [ [3,6,9,12], [4,7,10,13], [5,8,11,14] ]), true );
    assert( 'arAr-multiple-rows-and columns-1',
           () => m.arAr()._data_cube, undefined);
    
    assert.throw( 'throw-arAr-not-1-page',
                  () => [2,3,2].cube().arAr() );
  
  });
  
  runTests('arObj', () => {
        
    assert('arObj-empty-0', 
           () => _isEqual([].$key(1, 'A').arObj(), []), true); 
    assert('arObj-empty-1',
           () => _isEqual([0,1].cube().$key(1, 'A').arObj(), []), true); 
    assert('arObj-empty-2',
           () => _isEqual([0,2].cube().$key(1, ['A','B']).arObj(), []), true); 
    assert( 'arObj-empty-3',
           () => _isEqual([1,0].cube().$key(1, []).arObj(), [{}]), true); 
    assert( 'arObj-empty-4',
           () => _isEqual([2,0].cube().$key(1, []).arObj(), [{}, {}]), true);
    
    const obj = {a:5},
          arr = [6,7],
          v = [5, undefined, 'a', false, obj, null, arr]
                .$key(1, 'A'),
          rv = [5, undefined, 'a', false, obj, null, arr]
                .tp()
                .$key(1, ['A','B','C','D','E','F','G']),
          m = [3,4,5,6,7,8,9,10,11,12,13,14]
                .$shape(3)
                .$label(0, 'rows')
                .$label(1, 'cols')
                .$label(2, 'pages')
                .$key(0, ['a','b','c'])
                .$key(1, ['A','B','C','D'])
                .$key(2, 'P');
    
    assert( 'arObj-single-entry-0',
           () => _isEqual([5].$key(1, 'A').arObj(), [{A:5}]), true);
    assert( 'arObj-single-entry-1',
           () => _isEqual([arr].$key(1, 'A').arObj(), [{A:arr}]), true);
    assert( 'arObj-vector',
           () => _isEqual(v.arObj(), [ {A:5}, {A:undefined}, {A:'a'}, {A:false},
                                       {A:obj}, {A:null}, {A:arr} ] ), true);
    assert( 'arObj-single-row',
           () => _isEqual(dc.arObj(rv), [ {A:5, B:undefined, C:'a', D:false,
                                           E:obj, F:null, G:arr} ]), true);
    assert( 'arObj-multiple-rows-and columns-0',
           () => _isEqual(m.arObj(),
                          [ 
                            {A:3, B:6, C:9,  D:12},
                            {A:4, B:7, C:10, D:13},
                            {A:5, B:8, C:11, D:14}
                          ]), true );
    assert( 'arObj-multiple-rows-and columns-1',
           () => m.arObj()._data_cube, undefined);
    
    assert.throw( 'throw-arObj-not-1-page',
                  () => [2,3,2].cube().arObj() );
    assert.throw( 'throw-arObj-no-column-keys',
                  () => [2,3].cube().arObj() );
    assert.throw( 'throw-arObj-duplicate-column-keys',
                  () => [2,3].cube().$key(1, ['5','6',5]).arObj() );
    
  });
    
  runTests('dsv', () => {
    
    assert( 'dsv-empty-0', 
            () => _isEqual([].dsv(), ''), true); 
    assert( 'dsv-empty-1',
            () => _isEqual([0,1].cube().dsv(), ''), true); 
    assert( 'dsv-empty-2',
            () => _isEqual([0,2].cube().dsv(), ''), true); 
    assert( 'dsv-empty-3',
            () => _isEqual([1,0].cube().dsv(), ''), true); 
    assert( 'dsv-empty-4',
            () => _isEqual([2,0].cube().dsv(), '\n'), true);
    assert( 'dsv-empty-5', 
            () => _isEqual([].$key(1, 'A').dsv(), 'A'), true); 
    assert( 'dsv-empty-6',
            () => _isEqual([0,1].cube().$key(1, 'A').dsv(), 'A'), true); 
    assert( 'dsv-empty-7',
            () => _isEqual([0,2].cube().$key(1, ['A','B']).dsv(), 'A,B'), true); 
    assert( 'dsv-empty-8',
            () => _isEqual([1,0].cube().$key(1, []).dsv(), '\n'), true); 
    assert( 'dsv-empty-9',
            () => _isEqual([2,0].cube().$key(1, []).dsv(), '\n\n'), true);
    
    const v = [5, undefined, 'a', false, 'b c,d\ne', null, 'f"g'],
          m = [3,4,5,6,7,8,9,10,11,12,13,14]
                .$shape(3)
                .$label(0, 'rows')
                .$label(1, 'cols')  
                .$label(2, 'pages')
                .$key(0, ['a','b','c'])
                .$key(2, 'P');
    
    assert( 'dsv-single-entry',
           () => _isEqual([5].dsv(), '5'), true);
    assert( 'dsv-vector',
           () => _isEqual(v.dsv(), '5\n\na\nfalse\n"b c,d\ne"\n\n"f""g"'), true);
    assert( 'dsv-single-row',
           () => _isEqual(dc.dsv(v.tp()), '5,,a,false,"b c,d\ne",,"f""g"'), true);
    assert( 'dsv-multiple-rows-and columns',
           () => _isEqual(m.dsv('|'), '3|6|9|12\n4|7|10|13\n5|8|11|14'), true );

    v.$key(1, 'A');
    m.$key(1, ['A','B','C','D D'])
    const rv = [5, undefined, 'a', false, 'b c,d\ne', null, 'f"g']
                 .tp()
                 .$key(1, ['A','B','C','D','E','F','G']);
    
    assert( 'dsv-single-entry-column-key',
           () => _isEqual([5].$key(1, 'A').dsv(), 'A\n5'), true);
    assert( 'dsv-vector-column-key',
           () => _isEqual(dc.dsv(v), 'A\n5\n\na\nfalse\n"b c,d\ne"\n\n"f""g"'), true);
    assert( 'dsv-single-row-column-keys',
           () => _isEqual(rv.dsv(), 'A,B,C,D,E,F,G\n5,,a,false,"b c,d\ne",,"f""g"'), true);
    assert( 'dsv-multiple-rows-and-columns-column-keys',
           () => _isEqual(m.dsv(','), 'A,B,C,D D\n3,6,9,12\n4,7,10,13\n5,8,11,14'), true );
    
    assert.throw( 'throw-dsv-not-1-page',
                  () => [2,3,2].cube().dsv() );
    assert.throw( 'throw-dsv-duplicate-column-keys',
                  () => [2,3].cube().$key(1, ['5','6',5]).dsv() );
  });

  runTests('dict', () => {

    test( 'dict-empty',
      [].dict(),
      [].$key(0, [])
    );
    test('dict-1-entry',
      ['a', 5].dict(),
      [5].$key(0, 'a')
    );
    test('dict-2-entry',
      ['a', 5, 'b', 6].dict(),
      [5, 6].$key(0, ['a', 'b'])
    );
    test('dict-3-entry',
      ['a', 5, 'b', 6, 'c', 7].dict(),
      [5, 6, 7].$key(0, ['a', 'b' , 'c'])
    );
    test('dict-dim-0',
      ['a', 5, 'b', 6].dict(0),
      [5, 6].$key(0, ['a', 'b'])
    );
    test('dict-dim-1',
      ['a', 5, 'b', 6].dict(1),
      [5, 6].$shape([1, 2]).$key(1, ['a', 'b'])
    );
    test('dict-dim-2',
      ['a', 5, 'b', 6].dict([2]),
      [5, 6].$shape([1, 1, 2]).$key(2, ['a', 'b'])
    );
    const arr = [5, 6],
          obj = {q: 7};
    test('dict-complex-key-and-entry',
      [arr, 8, 'b', obj].dict(undefined),
      [8, obj].$key(0, [arr, 'b'])
    );
    test('dict-from-cube',
      ['a', 5, 'b', 6].$shape(2).dict(),
      [5, 6].$key(0, ['a', 'b'])
    );
    test('dict-dc-0',
      dc.dict(['a', 5, 'b', 6]),
      [5, 6].$key(0, ['a', 'b'])
    );
    test('dict-dc-1',
      dc.dict(['a', 5, 'b', 6], 1),
      [5, 6].$shape([1, 2]).$key(1, ['a', 'b'])
    );
    assert.throw('throw-dict-invalid-dim',
      () => ['a', 5, 'b', 6].dict('1')
    );
    assert.throw('throw-dict-odd-length-0',
      () => ['a'].dict()
    );
    assert.throw('throw-dict-odd-length-1',
      () => ['a', 5, 'b'].dict()
    );

  });
  
  runTests('stringify, parse', () => {
    
    const stem = 'stringify-parse-';

    //name: name of test
    //orig: array to stringify
    //resCube: should parsed result be a cube?
    //use_dc: call stringify and parse as methods of the dc object
    //trgt: expected result (according to compare), default: orig
    const stringifyParse = (name, orig, resCube, use_dc, trgt) => {
      const recon = use_dc
        ? dc.parse(dc.stringify(orig))
        : [orig.stringify()].parse();
      trgt = trgt || orig;        
      assert(stem + name + '-array-or-cube',
             () => recon._data_cube, resCube ? true : undefined);
      test(stem + name, recon, trgt);  //trgt (which may be orig) last arg so not converted to cube   
    }

    stringifyParse('empty-no-extras', [], false);
    stringifyParse('empty-extras',
               [1,0,2].cube().$label(0,'rows').$key(0,'a').$key(1,[]),
               true);
    stringifyParse('holes', new Array(3), false, false, [null, null, null]);
    stringifyParse('non-array', 5, false, true, [5]);
    stringifyParse('single-entry-no-extras', [5], false);
    stringifyParse('single-entry-extras', [5].$key(0,'a'), true);
    stringifyParse('vector-array', [6,7], false, true);
    stringifyParse('vector-cube-no-extras', [6,7].toCube(), true);
    stringifyParse('single-row-no-extras', [6,7].tp(), true, true);
    stringifyParse('matrix-no-extras', [3,4,5,6,7,8].$shape(3), true);
    stringifyParse('matrix-extras', 
               [3,4,5,6,7,8]
                  .$shape(3)
                  .$label(0, 'rows')
                  .$label(1, 'cols')
                  .$label(2, 'pages')
                  .$key(0, ['a','b','c'])
                  .$key(1, ['A','B'])
                  .$key(2, 'P'),
               true);
    stringifyParse('book-no-extras', [3,4,5].rand(100), true);
    stringifyParse('book-extras',
               [3,4,5].rand(100).$key(2, ['u','v','w','x','y']),
               true);

    //types
    const obj = {a:5},
          arr = [6,7],
          f = () => 8,
          dt = new Date(),
          types =       [ 5, ' a b', false, undefined,    f,               dt,  NaN, Infinity, -Infinity ],
          parsedTypes = [ 5, ' a b', false,      null, null, dt.toISOString(), null,     null,      null ];

    stringifyParse('types-no-extras', types, false, false, parsedTypes);
    stringifyParse('types-extras',
                types.$shape(3).$key(1,['A','B','C']).$label(0,'rows').$label(2, 'the pages!'),
                true,
                false,
                parsedTypes.$shape(3).$key(1,['A','B','C']).$label(0,'rows').$label(2, 'the pages!'));
    types[1] = obj;
    types[5] = arr;
    types.$key(0,[obj,'b',arr]);
    parsedTypes[1] = obj;
    parsedTypes[5] = arr;
    parsedTypes.$key(0,[obj,'b',arr]);
    {
      const res = [types.stringify()].parse(),
            trgt = parsedTypes;

      //use _isEqual since res will not reference obj and arr;
      //test cube properties explicitly since _isEqual will not see these properties
      assert(stem + 'complex-types-0', () => _isEqual(res, trgt), true);
      assert(stem + 'complex-types-1', () => _isEqual(res._data_cube, trgt._data_cube), true);
      assert(stem + 'complex-types-2', () => _isEqual(res._s, trgt._s), true);
      assert(stem + 'complex-types-3', () => _isEqual(res._k, trgt._k), true);
      assert(stem + 'complex-types-4', () => _isEqual(res._l, trgt._l), true);
    }

    //errors
    assert.throw( 'throw-parse-neither-array-nor-object',
                  () => dc.parse('5') );
    assert.throw( 'throw-parse-not-1-entry',
                  () => ['[5,6]', '[7,8]'].parse() );
    assert.throw( 'throw-parse-null-key',
                   () => [[5,6].$key(0, ['a', ()=>5]).stringify()].parse() );
    const date_1 = new Date('Jan 2025'),
          date_2 = new Date('Jan 2025');
    assert.throw( 'throw-parse-duplicate-key',
                  () => [[5,6].$key(0, [date_1, date_2]).stringify()].parse() );

  });

  runTests('updates', () => {

    //ad-hoc tests (not covered below):
    {
      //after and before return a cube
      assert('before-returns-cube-0', () => [].before()._data_cube, true);
      assert('before-returns-cube-1', () => [].$before(() => { }).before()._data_cube, true);
      assert('after-returns-cube-0', () => [].after()._data_cube, true);
      assert('after-returns-cube-1', () => [].$after([() => { }, () => { }]).after()._data_cube, true);
      {
        const x = []
          .$before([() => 5, () => 10].$key(0, ['a', 'b']))
          .$after([() => 15, () => 20].tp().$key(1, ['c', 'd']));
        assert('before-with-key', () => x.before().at('b')(), 10);
        assert('after-with-key', () => x.after().at(0, 'c')(), 15);
      }

      //check passed args array in detail
      {
        const x = [4, 5, 6, 7, 8, 9],
              s = [2, 3];      
        const f = (ar, setter, args) => {
          assert('update-callback-args-array-0', () => {
            return Array.isArray(args) && args.length === 1 && args[0] === s;
          }, true);
        };
        x.$before(f).$after(f);
        x.$shape(s);
      }
      {
        const x = [4, 5, 6, 7, 8, 9].$shape([2, 3]),
              r = 1,
              c = [0, 2],
              p = null,
              v = [10, 11]; 
        const f = (ar, setter, args) => {
          assert('update-callback-args-array-1', () => {
            return Array.isArray(args) && args.length === 4 &&
                   args[0] === r && args[1] === c && args[2] === p && args[3] === v;
          }, true);
        };
        x.$before(f).$after(f);
        x.$rcp(r, c, p, v);
      }
 
    }

    {
      //compare (via test)
      let x, y;

      x = [3, 4].$after(() => {});
      y = [3, 4];
      test('updates-compare-0', x, y);
      test('updates-compare-1', y, x);

      x = [3, 4, 5, 6]
        .$shape(2)
        .$key(0, ['a', 'b'])
        .$label(1, 'columns')
        .$after([()=>10, ()=>20]);
      y = [3, 4, 5, 6]
        .$shape(2)
        .$key(0, ['a', 'b'])
        .$label(1, 'columns')
        .$before(()=>30)
        .$after(()=>40);
      test('updates-compare-2', x, y);
      test('updates-compare-3', y, x);
    }

    //use same test function for all $-setters
    {
      const new_x = () => {
        return [4, 5, 6, 7, 8, 9]
          .$shape([3,2])
          .$key(0, ['a','b','c']);
      };

      const testUpdateFunctions = (methodName, f) => {
                
        let x;
        let bu_1, bu_2, au_1, au_2;  //variables updated by update functions
        
        //simple update functions
        const b = () => bu_1 = 1,
              a = () => au_1 = 2;
        
        //arrays of update functions
        const checkArgs = (arr, setter, args) => {
          assert(`${methodName}-update-passed-array`, () => arr === x, true);
          assert(`${methodName}-update-passed-name`, () => setter === methodName, true);
          assert(`${methodName}-update-passed-args-array`, () => Array.isArray(args), true);
        };
        const B = [ 
          (arr, setter, args) => { checkArgs(arr, setter, args); bu_1 = 3; },
          (arr, setter, args) => { checkArgs(arr, setter, args); bu_2 = 4; }
        ];
        const A = [
          (arr, setter, args) => { checkArgs(arr, setter, args); au_1 = 5; },
          (arr, setter, args) => { checkArgs(arr, setter, args); au_2 = 6; }
        ];

        //set 1 before and 1 after function, call f to apply the setter 
        x = new_x().$before(b).$after(a);
        test(`${methodName}-get-single-before-function-0`, x.before(), [b]);
        test(`${methodName}-get-single-after-function-0`, x.after(), [a]);
        f(x);
        test(`${methodName}-single-update-function-result`, x, f(new_x()));
        assert(`${methodName}-single-update-functions-applied`, () => bu_1 === 1 && au_1 === 2, true);
        test(`${methodName}-get-single-before-function-1`, x.before(), [b]);
        test(`${methodName}-get-single-after-function-1`, x.after(), [a]);

        //remove updates
        x.$before().$after(null);
        test(`${methodName}-no-before-functions-0`, x.before(), []);
        test(`${methodName}-no-after-functions-0`, x.after(), []);

        //set 2 before and 2 after functions
        x = new_x().$before(B).$after(A);
        test(`${methodName}-get-multiple-before-functions-0`, x.before(), B);
        test(`${methodName}-get-multiple-after-functions-0`, x.after(), A);
        f(x);
        test(`${methodName}-multiple-update-functions-result`, x, f(new_x()));
        assert(`${methodName}-multiple-update-functions-applied`, () => {
          return bu_1 === 3 && bu_2 === 4 && au_1 === 5 && au_2 === 6;
        }, true);

        //check variety of methods produce new cube with no updates
        {
          const checkNoUpdates = (nm, res) => {
            assert(`${methodName}-${nm}-has-no-updates`, () => {
              return !res.hasOwnProperty('_a') && !res.hasOwnProperty('_b');
            }, true);
          };
          checkNoUpdates('copy', x.copy());
          checkNoUpdates('add', x.add(5));
          checkNoUpdates('sum', x.sum());
          checkNoUpdates('horiz', x.horiz(x));
        }

        //x still has expected update functions
        test(`${methodName}-get-multiple-before-functions-1`, x.before(), B);
        test(`${methodName}-get-multiple-after-functions-1`, x.after(), A);

        //remove updates
        x.$before(undefined).$after([]);
        test(`${methodName}-no-before-functions-1`, x.before(), []);
        test(`${methodName}-no-after-functions-1`, x.after(), []);
      };

      //setters
      testUpdateFunctions('$shape', y => y.$shape(1));
      testUpdateFunctions('$squeeze', y => y.$squeeze());
      testUpdateFunctions('$label', y => y.$label(0, 'rows'));
      testUpdateFunctions('$key', y => y.$key(0, ['d','e','f']));
      testUpdateFunctions('$strip', y => y.$strip());
      testUpdateFunctions('$autoType', y => y.$autoType());
      testUpdateFunctions('$ent', y => y.$ent(3, 10));
      testUpdateFunctions('$at', y => y.$at('b', 1, 0, 10));
      testUpdateFunctions('$vec', y => y.$vec(null, 10));
      testUpdateFunctions('$rcp', y => y.$rcp(['a', 'c'], 1, null, [10, 11]));
      testUpdateFunctions('$subcube', y => y.$subcube(['a', 'c'], 1, null, [10, 11]));
      testUpdateFunctions('$row', y => y.$row(['a', 'c'], [10, 11, 12, 13]));
      testUpdateFunctions('$col', y => y.$col(1, [10, 11, 12]));
      testUpdateFunctions('$page', y => y.$page(0, 10));
      testUpdateFunctions('$rowSlice', y => y.$rowSlice('b', 'c', 10));
      testUpdateFunctions('$colSlice', y => y.$colSlice(0, 1, [10, 11, 12, 13, 14, 15]));
      testUpdateFunctions('$pageSlice', y => y.$pageSlice(0, 0, 10));
      testUpdateFunctions('$prop', y => {
        y.forEach((u, i) => y[i] = {a:5});
        y.$prop('a', 10);
        y.forEach((u, i) => y[i] = 20);
        return y;
      });

    }

  });

  console.log('--- Tests finished');
})();