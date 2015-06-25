/**
 * Created by huangxinghui on 2015/6/16.
 */

var _ = require('underscore');

// copy from https://github.com/angular/angular.js/blob/master/src/ng/cacheFactory.js
var caches = {};

module.exports = cacheFactory;

function cacheFactory(cacheId, capacity) {
    if (cacheId in caches)
        throw new Event('CacheId ' + cacheId +' is already taken!');

    var size = 0,
        stats = {id: cacheId, capacity: capacity},
        data = {},
        capacity = capacity || Number.MAX_VALUE,
        lruHash = {},
        freshEnd = null,
        staleEnd = null;

    function refresh(entry) {
        if (entry != freshEnd) {
            if (!staleEnd) {
                staleEnd = entry;
            } else if (staleEnd == entry) {
                staleEnd = entry.n;
            }

            link(entry.n, entry.p);
            link(entry, freshEnd);
            freshEnd = entry;
            freshEnd.n = null;
        }
    }

    function link(nextEntry, prevEntry) {
        if (nextEntry != prevEntry) {
            if (nextEntry) nextEntry.p = prevEntry;
            if (prevEntry) prevEntry.n = nextEntry;
        }
    }

    return caches[cacheId] = {
        put: function(key, value) {
            if (_.isUndefined(value)) return;

            if (capacity < Number.MAX_VALUE) {
                var lruEntry = lruHash[key] || (lruHash[key] = {key: key});

                refresh(lruEntry);
            }

            if (!(key in data)) size++;
            data[key] = value;

            if (size > capacity) {
                this.remove(staleEnd.key);
            }

            return value;
        },
        get: function(key) {
            if (capacity < Number.MAX_VALUE) {
                var lruEntry = lruHash[key];

                if (!lruEntry) return;

                refresh(lruEntry);
            }

            return data[key];
        },
        remove: function(key) {
            if (capacity < Number.MAX_VALUE) {
                var lruEntry = lruHash[key];

                if (!lruEntry) return;

                if (lruEntry == freshEnd) freshEnd = lruEntry.p;
                if (lruEntry == staleEnd) staleEnd = lruEntry.n;
                link(lruEntry.n,lruEntry.p);

                delete lruHash[key];
            }

            delete data[key];
            size--;
        },
        removeAll: function() {
            data = {};
            size = 0;
            lruHash = {};
            freshEnd = staleEnd = null;
        },
        destroy: function() {
            data = null;
            stats = null;
            lruHash = null;
            delete caches[cacheId];
        },
        info: function() {
            return _.extend({}, stats, {size: size});
        }
    }
}