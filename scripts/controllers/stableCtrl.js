'use strict';

habitrpg
  .controller('StableCtrl', ['$scope', '$rootScope', 'User', '$state', function($scope, $rootScope, User, $state) {

    $scope.hatchingPotions = env.Content.hatchingPotions;

    function toArray(eggs, type) {
      var array = [];
      if (type) array.push({type: type});
      if (type === 'rarePets'){
        Object.keys(eggs).forEach(function(key) {
          if(User.user.items.pets[key]) {
            var egg = key.split('-')[0];
            var potion = key.split('-')[1];
            array.push({name: eggs[key], egg: egg, potion: potion});
          }
        })
        return array;
      } else if(type === 'rareMounts') {
        Object.keys(eggs).forEach(function(key) {
          if(User.user.items.mounts[key]) {
            var egg = key.split('-')[0];
            var potion = key.split('-')[1];
            array.push({name: eggs[key], egg: egg, potion: potion});
          }
        })
        return array;
      } else {
        Object.keys(eggs).forEach(function(key) {
          Object.keys($scope.hatchingPotions).forEach(function(potion) {
            array.push({egg: eggs[key].key,
              potion: $scope.hatchingPotions[potion].key
            });
          })
        })
        return array;
      }
    }

    $scope.eggs = toArray(env.Content.dropEggs)
                  .concat(toArray(env.Content.questEggs, 'questPets'))
                  .concat(toArray(env.Content.specialPets, 'rarePets'));
    $scope.mounts = toArray(env.Content.dropEggs)
                  .concat(toArray(env.Content.questEggs, 'questMounts'))
                  .concat(toArray(env.Content.specialPets, 'rareMounts'));

    $scope.getPetsHeight = function(item) {
      var value = $rootScope.user.items.mounts[item.egg+'-'+item.potion]
                  || $rootScope.user.items.pets[item.egg+'-'+item.potion]

      if (value) {
        return 100;
      }

      return 80;
    };
    $scope.getMountsHeight = function(item) {
      if(!item.egg && !item.type) {
        return 0;
      }
      var value = $rootScope.user.items.mounts[item.egg+'-'+item.potion]
      if (value) {
        return 115;
      } else {
        return 80;
      }
    };

  }
]);
