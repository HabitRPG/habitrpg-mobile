'use strict';

habitrpg.controller('PurchaseCtrl', 
  ['$scope', 'StoreService', '$rootScope', 'ApiUrl',
  function($scope, store, $rootScope, ApiUrl){
    $scope.store = store.getStore();

    $scope.buy = function(id){
      if($rootScope.isIOS){
        alert("In-App-Purchases are currently not available on IOS.");
        return;
      }

      if(ApiUrl.get() !== 'https://habitrpg.com'){
        alert("You are using a custom server, please contact your server administrator.");
        return;
      }

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