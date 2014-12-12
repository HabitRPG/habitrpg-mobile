var w = window;

angular.module('storeServices', [])
  .service('StoreService', ['ApiUrlService', '$rootScope', 'User',
    function(ApiUrlService, $rootScope, User){
      var url = ApiUrlService.get();

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

      registerProductAndCallback({
        id: "buy.20.gems", 
        alias: "20 Gems",
        type: w.store.CONSUMABLE
      });

      this.getStore = function(){
        return w.store || {};
      };
    }
]);