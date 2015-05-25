var w = window;

angular.module('habitrpg').service('StoreService',
['ApiUrl', '$rootScope', 'User', '$ionicPlatform','$timeout', 
function(ApiUrl, $rootScope, User, $ionicPlatform, $timeout){
  var url = ApiUrl.get();

  var uuid = $rootScope.User.user._id;
  var token = $rootScope.User.user.apiToken;

  var authParams = '?_id='+uuid+'&apiToken='+token;

  if($rootScope.isIOS)
  {
    w.store.validator = url+'/iap/ios/verify'+authParams;
  }
  else
  {
    w.store.validator = url+'/iap/android/verify'+authParams;
  }

  function registerProductAndCallback(product){
    w.store.register(product);

    w.store.when(product.id)
      .error(function(err){
        console.log(JSON.stringify(err));
      })
      .approved(function(pr){
        var projectJson = JSON.stringify(pr);
        console.log(projectJson);
        // start verification call to the api
        pr.verify();
      })
      .verified(function(pr){
        // Purchased!
        pr.finish();
        User.sync();
      });
  }

  var storeInitialized = false;

  function initializeStore()
  {
    if(w.store){
      registerProductAndCallback({
        id: "buy.20.gems",
        alias: "20 Gems",
        type: w.store.CONSUMABLE
      });

      w.store.ready(function(){
        // store is ready :)
      });

      $timeout(function(){
        w.store.refresh();
      }, 250);

      storeInitialized = true;
    }
    else
    {
      console.log("No store available");
    }
  }

  $ionicPlatform.ready(function() {
    $timeout(initializeStore, 500);
  });

  this.getStore = function(){
    if(!storeInitialized)
    {
      initializeStore();
    }

    return w.store || {};
  };
}]);