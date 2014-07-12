'use strict'

habitrpg.controller("InventoryCtrl", ['$rootScope', '$scope', '$window', 'User', '$ionicActionSheet', '$ionicModal',
  function($rootScope, $scope, $window, User, $ionicActionSheet, $ionicModal) {

    var user = User.user;
    var Content = $rootScope.Content;

    $ionicModal.fromTemplateUrl('views/app.modals.hatch.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.hatchModal = modal;
    });

    $scope.showActions = function(item, type){
      if(type === "quests"){
        var completedPrevious = !item.previous || (user.achievements.quests && user.achievements.quests[item.previous]);
        if (!completedPrevious)
          return alert(window.env.t('mustComplete', {quest: Content.quests[item.previous].text()}));
        if (item.lvl && item.lvl > user.stats.lvl)
          return alert(window.env.t('mustLevel', {level: item.lvl}));
        $scope.selectedItem = item;
        // FIXME it looks like template directives are compiled when
        // modal is loaded not when shown, so quest rewards doesn't work
        $ionicModal.fromTemplateUrl('views/app.modals.showQuest.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.showQuestModal = modal;
          $scope.showQuestModal.show();
        });

      }else if(type === "food"){
        $ionicActionSheet.show({
          buttons: [
            { text: env.t('sellForGold', {item: item.text(), gold: item.value}) }
          ],
          titleText: 'Use this item',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            if(index === 0){ // Sell
              user.ops.sell({params:{type:type, key: item.key}});
              return true;
            }
          }
        });
      }else{
        $ionicActionSheet.show({
          buttons: [
            { text: env.t('sellForGold', {item: item.text(), gold: item.value}) },
            { text: 'Hatch' }
          ],
          titleText: 'Use this item',
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            if(index === 0){ // Sell
              user.ops.sell({params:{type:type, key: item.key}});
              return true;
            }

            if(index === 1){
              $scope.selectedItem = item;
              $scope.itemsToHatch = type === 'eggs' ? 'hatchingPotions' : 'eggs';
              $scope.hatchModal.show();
              return true;
            }
          }
        });
      }
    }

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.hatchModal.remove();
      if($scope.showQuestModal) $scope.showQuestModal.remove();
    });

    // count egg, food, hatchingPotion stack totals
    var countStacks = function(items) { return _.reduce(items,function(m,v){return m+v;},0);}

    $scope.$watch('user.items.eggs', function(eggs){ $scope.eggCount = countStacks(eggs); }, true);
    $scope.$watch('user.items.hatchingPotions', function(pots){ $scope.potCount = countStacks(pots); }, true);
    $scope.$watch('user.items.food', function(food){ $scope.foodCount = countStacks(food); }, true);
    $scope.$watch('user.items.quests', function(quest){ $scope.questCount = countStacks(quest); }, true);


    $scope.ownedItems = function(inventory){
      return _.pick(inventory, function(v,k){return v>0;});
    }

    $scope.hatch = function(egg, potion){
      var eggName = Content.eggs[egg.key].text();
      var potName = Content.hatchingPotions[potion.key].text();
      if (!$window.confirm(window.env.t('hatchAPot', {potion: potName, egg: eggName}))) return;
      user.ops.hatch({params:{egg:egg.key, hatchingPotion:potion.key}});
      $scope.hatchModal.hide();
    }

    $scope.questInit = function(){
      $rootScope.party.$questAccept({key:$scope.selectedQuest.key}, function(){
        $rootScope.party.$get();
      });
    }
  }
]);
