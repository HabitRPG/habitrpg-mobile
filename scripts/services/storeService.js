var w = window;

angular.module('storeServices', [])
  .service('StoreService', ['ApiUrlService', '$rootScope',
    function(ApiUrlService, $rootScope){
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
/*
    w.store.register({
      id: "android.test.purchased", //"buy.20.gems", 
      alias: "20 Gems",
      type: w.store.CONSUMABLE
    });
    
    w.store.ready(function(){
      alert("store is ready");
    });
    
    w.store.refresh();*/
    
      this.getStore = function(){
        return w.store || {};
      };
    }
]);