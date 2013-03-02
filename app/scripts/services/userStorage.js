'use strict';

/**
 * Services that persists and retrieves character from localStorage.
 */

habitrpg.factory( 'userStorage', function() {
  var STORAGE_ID = 'user-habitrpg';





  return {
    get: function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '{ "username":"litenull", "password":"lala" }');
    },

    put: function(data) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(data));
    }


  };
});
