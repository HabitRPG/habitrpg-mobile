'use strict';
console.log("beforeControllerAdd");
habitrpg.controller('PurchaseCtrl', 
  ['$scope', 'StoreService',
  function($scope, store){
    $scope.store = store.getStore();
    
    try{
      $scope.store.when("buy.20.gems")
        .error(function(err){
          alert(err);
          alert(JSON.stringify(err));
        }).approved(function(pr){
            var projectJson = JSON.stringify(pr);
            alert("approved");
            alert(projectJson);
            console.info(pr);
            console.info(projectJson);
            pr.verify();
        }).verified(function(pr){
          pr.finish();
        });
    }catch(ex){
      console.info(pr);
      alert(ex);
    }
    
    $scope.buyGems = function(){
      try{
        $scope.store.order("buy.20.gems")
        .then(function(ex){
          alert("Order started");
          alert(JSON.stringify(ex));
        })
        .error(function(ex){
          alert("Error on starting Order");
          alert(JSON.stringify(ex));
        });
      } catch(ex) {
      alert(JSON.stringify(ex));
      }
    };
  }
]);