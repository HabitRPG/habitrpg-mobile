'use strict';

/**
 * Services that persists and retrieves stats from localStorage.
 */
habitrpg.factory( 'statzStorage', function() {
  var STORAGE_ID = 'stats-habitrpg';

  return {
    get: function() {
      // fake data, if localstorage empty, set health and exp
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '{"health" : "90%", "exp" : "20%"}');
    },

    put: function( stats ) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(stats));
    }
  };
});
