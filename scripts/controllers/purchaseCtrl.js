'use strict';
console.log("beforeControllerAdd");
habitrpg.controller('PurchaseCtrl', 
  ['$scope', 'StoreService',
  function($scope, store){
    $scope.store = store.getStore();

    $scope.buy = function(id){
      try{
        $scope.store.order(id)
          .then(function(ex){
            // Callback Order started
          })
          .error(function(ex){
            console.log(JSON.stringify(ex));
          });
      } catch(ex) {
        console.log(JSON.stringify(ex));
      }
    };
  }
]);