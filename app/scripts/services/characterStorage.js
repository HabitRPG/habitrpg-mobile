'use strict';

/**
 * Services that persists and retrieves character from localStorage.
 */

habitrpg.factory( 'characterStorage', function() {
  var STORAGE_ID = 'character-habitrpg';





  return {
    get: function(character) {
      if (!character) {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
      }else{

        var JSON_DATA = JSON.parse(localStorage.getItem(STORAGE_ID));

        switch(stats) {

          case 'hp':
          return JSON_DATA.stats.hp;
          break;
          case 'exp':
          return JSON_DATA.stats.exp;
          break;

        }

      }
    },

    put: function( character ) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(character));
    }


  };
});
