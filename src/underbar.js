(function() {
  'use strict';

  window._ = {};
  // Returns whatever value is passed as the argument. 
  _.identity = function(val) {
    return val;
  };
  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };
  // Like first, but for the last elements. If n is undefined, return just the
  // last element.
  _.last = function(array, n) {
    return n === undefined ? array[array.length - 1] : array.slice((array.length - n) > 0 ? (array.length - n) : 0 , array.length);
  };
  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  //
  // Note: _.each does not have a return value, but rather simply runs the
  // iterator function over each item in the input collection.
  _.each = function(collection, iterator) {
    if (Array.isArray(collection)) {
      for (var i = 0; i < collection.length; i ++){
        iterator(collection[i], i, collection);
    }      
    } else {
      for (var key in collection){
        iterator(collection[key], key, collection);
      }
    }

  };
  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    var result = -1;
    _.each(array, function(item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };
  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    var result = [];
    for (var i = 0 ; i < collection.length; i ++){
      if (test(collection[i])) result.push(collection[i]);
    }
    return result;
  };
 // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    return _.filter(collection, function(variable){return !test(variable);})
  };
  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {
    var copyOfArray = array.slice();
    var result = [];
    while(copyOfArray.length > 0){
      var uniqElement = copyOfArray[0];
      copyOfArray = _.reject(copyOfArray,function(eachElement){ return eachElement === uniqElement;})
      result.push(uniqElement);
    }
    return result;
  };
  // Return the results of applying an iterator to each element.
  _.map = function(collection, iterator) {

    var result = [];
    for (var i = 0; i < collection.length; i ++){
      result.push(iterator(collection[i], i, collection));
    }
    return result;
  };
  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(collection, key) {

    return _.map(collection, function(item){
      return item[key];
    });
  };
  // Reduces an array or object to a single value by repetitively calling
  // iterator(accumulator, item, keyOrIndex) for each item. accumulator should be
  // the return value of the previous iterator call.
  _.reduce = function(collection, iterator, accumulator) {
    // console.log(collection);
    var runIterator = function(currentElement, iterator, accumulator, keyOrIndex){
      if (accumulator === undefined) return currentElement;
      else return iterator(accumulator, currentElement, keyOrIndex);
    }
    if (Array.isArray(collection)) {
      for (var i = 0; i < collection.length; i ++){
        var newAccumulator = runIterator(collection[i], iterator, accumulator, i);
        if (newAccumulator === undefined) continue;
        else accumulator = newAccumulator;  
      }      
    } else {
      for (var key in collection) {
        var newAccumulator = runIterator(collection[key], iterator, accumulator, key);
        if (newAccumulator === undefined) continue;
        else accumulator = newAccumulator;        
      }
    }

    return accumulator;
  };
  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    // TIP: Many iteration problems can be most easily expressed in
    // terms of reduce(). Here's a freebie to demonstrate!
    return _.reduce(collection, function(wasFound, item) {
      if (wasFound) {
        return true;
      }
      return item === target;
    }, false);
  };
  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    // TIP: Try re-using reduce() here.
    return _.reduce(collection, function(previousResult, currentElement){
      currentElement = (iterator === undefined)? currentElement: iterator(currentElement);
      // console.log(currentElement);
      if ( currentElement) return true && previousResult;
      else return false;
    }, true)
  };
  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    var allFail = _.every(collection, function(arg){
      return ! ((iterator === undefined)? _.identity(arg) : iterator(arg))
    });
    return ! allFail; 
    // TIP: There's a very clever way to re-use every() here.
  };
  // Extend a given object with all the properties of the passed in
  // object(s).
  _.extend = function(obj1, ...restObj) {
    return _.reduce(restObj, function(previousResult, eachObj){
      return _.reduce(eachObj, function(previousResult, eachProperty, key){
        obj1[key] = eachProperty;
        return obj1;
      }, obj1);
    },obj1);
  };
  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj1, ...restObj) {
     return _.reduce(restObj, function(previousResult, eachObj){
      return _.reduce(eachObj, function(previousResult, eachProperty, key){
        obj1[key] = (obj1[key] === undefined)? eachProperty: obj1[key];
        return obj1;
      }, obj1);
    },obj1);   
  };
  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;
    // console.log('outside result');

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // infromation from one function call to another.
        // console.log(arguments);
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      // console.log(result);
      return result;
    };
  };
  // _.memoize should return a function that, when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) {
    var previousArguments;
    var previousResult;
    var result;
    return function() {
      if (JSON.stringify(previousArguments) === JSON.stringify(arguments)) {
        return previousResult;
      } else {
        result = func.apply(this, arguments);
        previousArguments = arguments;
        previousResult = result;
        return result;        
      }
    };
  };
  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait, arg1, arg2) {
    var timeoutID;
    var result;
    window.setTimeout(func, wait, arg1, arg2);
  };
  // Randomizes the order of an array's contents.
  _.shuffle = function(array) {
    var copyOfArray = array.slice();
    var result = [];
    var generateRandomNumber = function(min, max){
      return Math.random() * (max - min) + min;
    };
    var takeNumberFromArray = function([moveFrom, moveTo]){
      var randomIndex = generateRandomNumber(0, moveFrom.length - 1);
      moveTo = moveTo.concat(moveFrom.splice(randomIndex, 1));
      return [moveFrom, moveTo];
    };
    var takeAllNumbers = function([numberArray, result]){
      if (numberArray.length === 0) return result;
      else {
        var status = takeNumberFromArray([numberArray, result]);
        return takeAllNumbers(status);
      }
    }
    return takeAllNumbers([copyOfArray, result]);
  };


  /**
   * ADVANCED
   * =================
   *
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */

  // Calls the method named by functionOrKey on each value in the list.
  // Note: You will need to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {
    var result = [];
    var currentResult;
    for (var i = 0; i < collection.length; i ++){
      var currentElement = collection[i];
      if (typeof functionOrKey === 'string'){
        var fn = String.prototype[functionOrKey]
        currentResult = fn.apply(currentElement, args);
      } 
      else currentResult = functionOrKey.apply(currentElement, args);
      result.push(currentResult);
    }
    return result;
  };

  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.  See the Underbar readme for extra details
  // on this function.
  //
  // Note: This is difficult! It may take a while to implement.
  _.throttle = function(func, wait) {
  };
}());
