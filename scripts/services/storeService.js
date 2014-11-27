var w = window;

angular.module('storeServices', [])
  .service('StoreService', ['ApiUrlService', '$rootScope',
    function(ApiUrlService, $rootScope){
    
      var url = ApiUrlService.get();
 
      if($rootScope.isIOS){
        w.store.validator = url+'/iap/ios/verify';
      }
      else
      {
        w.store.validator = url+'/iap/android/verify';
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