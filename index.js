var Bus = (function () {
  'use strict';

  var headCount = 0;

  function add(topic, graph) {
    var cursor = graph;
    for (var i = 0; i < topic.length; i++) {
      var word = topic[i];
      var right = cursor.r;
      if (!right[word]) {
        right[word] = { w: word, r: {}, i: headCount++ };
      }
      cursor = right[word];
    }

    return cursor;
  }

  function getList(topic, graph) {
    var routes = [[graph, 0]];
    var finalNodes = {}; // track found nodes, no duplicates should be returned
    var finalRoutes = []; // remember found functions to call

    while (routes.length) {
      var route = routes.shift();
      var cursor = route[0];
      var index = route[1];
      var right = cursor.r;
      var word = topic[index];

      if (word === undefined && cursor.fn && !finalNodes[cursor.i]) {
        finalNodes[cursor.i] = 1; // remember that we've seen this node
        finalRoutes.push(cursor.fn); // remember functions
      } else if (right[word]) {
        routes.push([right[word], index + 1]);
      }

      if (right['#']) {
        if (index < topic.length) {
          routes.push([cursor, index + 1]);
        }

        routes.push([right['#'], index]);
        routes.push([right['#'], index + 1]);
      }

      if (right['*']) {
        routes.push([right['*'], index + 1]);
      }
    }

    return finalRoutes;
  }

  return function Bus() {
    var head = { w: '', r: {}, i: headCount++ };
    var emitCache = {}; // memoize graph lookups

    function on(topicStr, fn) {
      var lastNode = add(topicStr.split('.'), head);
      lastNode.fn = lastNode.fn || [];
      lastNode.fn.push(fn);
      emitCache = {}; // forget graph lookups because everything has changed
    }

    function emit(topicStr, message) {
      if (emitCache[topicStr]) { // use previous work if available
        return emitCache[topicStr];
      }

      var list = getList(topicStr.split('.'), head);

      emitCache[topicStr] = list; // remember previous work

      for (var i = 0; i < list.length; i++) {
        var fn = list[i];
        for (var j = 0; j < fn.length; j++) {
          fn[j](topicStr, message);
        }
      }
    }

    // public methods
    this.emit = emit;
    this.on = on;

    // alias
    this.publish = emit;
    this.subscribe = on;
  }
}());

if (typeof exports !== 'undefined') {
  module.exports = Bus;
}

