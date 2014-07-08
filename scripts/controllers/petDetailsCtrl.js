'use strict';

habitrpg.controller('PetDetailsCtrl',
  ['$scope','User','$state', '$rootScope', 
    function($scope, User, $state, $rootScope) {
      var user = User.user;

      $scope.pet = $state.params.pet;

      var pieces = $scope.pet.split('-');
      $scope.egg = pieces[0];
      $scope.potion = pieces[1];
      $scope.petDisplayName = env.t('petName', {
        potion: $rootScope.Content.hatchingPotions[$scope.potion] ? $rootScope.Content.hatchingPotions[$scope.potion].text() : $scope.potion,
        egg: $rootScope.Content.eggs[$scope.egg] ? $rootScope.Content.eggs[$scope.egg].text() : $scope.egg
      });

      $scope.isAvatarPet = user.items.currentPet == $scope.pet;

      $rootScope.$watch('user.items.currentPet', function(after, before){
        if(after === before) return;

        $scope.isAvatarPet = after == $scope.pet;
      });

      $scope.chooseAvatarPet = function(){
        User.user.ops.equip({params:{type: 'pet', key: $scope.pet}});
      };

      var countStacks = function(items) { return _.reduce(items,function(m,v){return m+v;},0);}

      $scope.$watch('user.items.food', function(food){ $scope.foodCount = countStacks(food); }, true);

      $scope.ownedItems = function(inventory){
        return _.pick(inventory, function(v,k){return v>0;});
      }

      $scope.chooseFood = function(food){
        var selectedFood = $rootScope.Content.food[food];
        if(selectedFood){
          if (selectedFood.key == 'Saddle') {
            if (!confirm(window.env.t('useSaddle', {pet: petDisplayName}))) return;
          } else if (!confirm(window.env.t('feedPet', {name: $scope.petDisplayName, article: selectedFood.article, text: selectedFood.text()}))) {
            return;
          }
          User.user.ops.feed({params:{pet: $scope.pet, food: selectedFood.key}});
        }
      }
    }
  ]);