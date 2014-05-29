define([], function () {
    'use strict';

    var ReactRAFBatchingStrategy = {
        isBatchingUpdates: true,

        /**
         * Call the provided function in a context within which calls to `setState`
         * and friends are batched such that components aren't updated unnecessarily.
         */
        batchedUpdates: function(callback, param) {
            callback(param);
        }
    };

    return ReactRAFBatchingStrategy;
});
