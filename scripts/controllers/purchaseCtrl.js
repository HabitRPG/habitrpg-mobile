'use strict';

habitrpg.controller('PurchaseCtrl', 
  ['$scope', 'store',
  function($scope, store){
    $scope.buyGems = function(){
      alert(store);
    };
  
  }
]);