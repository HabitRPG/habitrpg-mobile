'use strict';

/**
 * Services that persists and retrieves TODOs from localStorage.
 */
habitrpg.factory( 'todoStorage', function() {
  var STORAGE_ID = 'todos-habitrpg';

  return {
    get: function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    },

    put: function( todos ) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
    }
  };
});
