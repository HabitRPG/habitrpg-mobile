var w = window;

angular.module('storeServices', [])
  .service('StoreService', [
    function(){
      this.getStore = function(){
        return w.store || {};
      };
    }
]);