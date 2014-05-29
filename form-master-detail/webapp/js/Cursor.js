define([], function () {
    'use strict';



    var exports = {};



    /**
     * Example usages:
     * Cursor.build(this.state, this.setState.bind(this), _.cloneDeep);
     * Cursor.build(this.notState, function (nextState) { merge(this.notReactState, nextState); }.bind(this), _.identity);
     */
    exports.build = function (state, commit, clone) {
        var bus = { state: clone(state) };

        function Cursor(path, commit, clone) {
            this.value = function () { return getRefAtPath(bus.state, path); };

            this.onChange = function (nextValue) {
                var nextState;
                nextValue = clone(nextValue); // because the call site might retain the reference and mutate

                if (path.length > 0) {
                    nextState = clone(bus.state);
                    var scoped = getRefAtPath(nextState, initial(path));
                    scoped[last(path)] = nextValue;
                }
                else if (path.length === 0) {
                    nextState = nextValue;
                }
                commit(nextState);
                bus.state = nextState;
            };

            this.refine = function (/* one or more paths through the tree */) {
                var nextPath = [].concat(path, flatten(arguments));
                return new Cursor(nextPath, commit, clone);
            };
        }

        return new Cursor([], commit, clone);
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


    return exports;
});
