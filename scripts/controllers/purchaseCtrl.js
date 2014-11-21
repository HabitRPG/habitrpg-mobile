'use strict';
console.log("beforeControllerAdd");
habitrpg.controller('PurchaseCtrl', 
  ['$scope', 'StoreService',
  function($scope, store){
    $scope.store = store.getStore();
    
    try{
      $scope.store.when("BUY.20.GEMS")
        .error(function(err){
          alert(err);
        }).approved(function(pr){
            var projectJson = JSON.stringify(pr);
            
            alert(projectJson);
            console.info(pr);
            console.info(projectJson);
        });
    }catch(ex){
      alert(ex);
    }
    
    $scope.buyGems = function(){
      try{
        $scope.store.order("BUY.20.GEMS")
        .then(function(){
          alert("works?!");
        })
        .error(function(){
          alert("error");
        });
      } catch(ex) {
      alert(ex);
      }
    };
  }
]);