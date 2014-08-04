'use strict';

habitrpg.controller('userAvatarCtrl',
  ['$scope', '$location', 'filterFilter', 'User',
  function($scope, $location, filterFilter, User) {

    $scope.unlock = function(path){
      var fullSet = ~path.indexOf(',');
      var cost =
        ~path.indexOf('background.') ?
          (fullSet ? 3.75 : 1.75) : // (Backgrounds) 15G per set, 7G per individual
          (fullSet ? 1.25 : 0.5); // (Hair, skin, etc) 5G per set, 2G per individual

      if (fullSet) {
        if (confirm(window.env.t('purchaseFor',{cost:cost*4})) !== true) return;
        if (User.user.balance < cost) return alert(env.t('notEnoughGems'));
      } else if (!User.user.fns.dotGet('purchased.' + path)) {
        if (confirm(window.env.t('purchaseFor',{cost:cost*4})) !== true) return;
        if (User.user.balance < cost) return alert(env.t('notEnoughGems'));
      }
      User.user.ops.unlock({query:{path:path}})
    }

    $scope.ownsSet = function(type,_set) {
      return !_.find(_set,function(v,k){
        return !User.user.purchased[type][k];
      });
    }
    $scope.setKeys = function(type,_set){
      return _.map(_set, function(v,k){
        return type+'.'+k;
      }).join(',');
    }

  }
]);
