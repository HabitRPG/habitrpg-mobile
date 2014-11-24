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

      alert(w.store.validator);
    
      this.getStore = function(){
        return w.store || {};
      };
    }
]);