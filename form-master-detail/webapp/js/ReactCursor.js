define([], function () {
  'use strict';


  function Cursor(state, pendingGetter, path, commit, clone) {
    this.value = clone(getRefAtPath(state, path)); // value to put in the DOM, use from render()
    this.pendingValue = function () {
      return clone(getRefAtPath(pendingGetter(), path)); // value now, use in event handlers
    }

    this.onChange = function (nextValue) {
      var nextState;
      nextValue = clone(nextValue);

      if (path.length > 0) {
        nextState = clone(pendingGetter());
        var scoped = getRefAtPath(nextState, initial(path));
        scoped[last(path)] = nextValue;
      }
      else if (path.length === 0) {
        nextState = nextValue;
      }
      commit(nextState);
      return new Cursor(state, pendingGetter, path, commit, clone);
    };

    this.refine = function (/* one or more paths through the tree */) {
      var nextPath = [].concat(path, flatten(arguments));
      return new Cursor(state, pendingGetter, nextPath, commit, clone);
    };
  }


  /**
   * Example usages:
   * Cursor.build(this.state, this.setState.bind(this), _.cloneDeep);
   * Cursor.build(this.notState, function (nextState) { merge(this.notReactState, nextState); }.bind(this), _.identity);
   */
  Cursor.build = function (state, pendingGetter, commit, clone) {
    return new Cursor(state, pendingGetter, [], commit, clone);
  };


  function getRefAtPath(tree, paths) {
    return reduce(paths, deref, tree);
  }

  function deref(obj, key) {
    return obj[key];
  }

  function initial(array) {
    return array.slice(0, array.length-1);
  }

  function last(array) {
    return array[array.length-1];
  }

  function reduce(array, f, mzero) {
    return array.reduce(f, mzero);
  }

  function flatten(listOfLists) {
    return [].concat.apply([], listOfLists);
  }


  return Cursor;
});