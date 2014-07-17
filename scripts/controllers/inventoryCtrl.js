'use strict'

habitrpg.controller("InventoryCtrl", ['$rootScope', '$scope', '$window', 'User', '$ionicActionSheet', '$ionicModal', '$ionicPopup',
  function($rootScope, $scope, $window, User, $ionicActionSheet, $ionicModal, $ionicPopup) {

    var user = User.user;
    var Content = $rootScope.Content;

    $ionicModal.fromTemplateUrl('views/app.modals.hatch.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.hatchModal = modal;
    });

    $scope.$watch('user.items.gear', function(gear){
      $scope.gear = {};
      _.each(gear.owned, function(v,key){
        if (v === false) return;
        var item = Content.gear.flat[key];
        if (!$scope.gear[item.klass]) $scope.gear[item.klass] = [];
        $scope.gear[item.klass].push(item);
      })
    }, true);

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

    $scope.purchase = function(type, item){
      var gems = user.balance * 4;

      // FIXME if(gems < item.value) return $rootScope.openModal('buyGems');
      if(gems < item.value) return alert(window.env.t('notEnoughGems'));
      var string = (type == 'hatchingPotions') ? window.env.t('hatchingPotion') : (type == 'eggs') ? window.env.t('eggSingular') : (type == 'quests') ? window.env.t('quest') : (item.key == 'Saddle') ? window.env.t('foodSaddleText').toLowerCase() : (type == 'special') ? item.key : type; // this is ugly but temporary, once the purchase modal is done this will be removed
      var message = window.env.t('buyThis', {text: string, price: item.value, gems: gems})

      if($window.confirm(message)){
        User.user.ops.purchase({params:{type:type,key:item.key}});
        alert('Item purchased!'); //FIXME
      }
    }

    $scope.reroll = function(){
      $ionicModal.fromTemplateUrl('views/app.modals.reroll.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.rerollModal = modal;
        $scope.rerollModal.show();
      });
    }

    $scope.rebirth = function(){
      $ionicModal.fromTemplateUrl('views/app.modals.rebirth.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.rebirthModal = modal;
        $scope.rebirthModal.show();
      });
    }

    $scope.buyQuest = function(quest) {
      var item = Content.quests[quest];
      if (item.lvl && item.lvl > user.stats.lvl)
          return alert(window.env.t('mustLvlQuest', {level: item.lvl}));
      var completedPrevious = !item.previous || (user.achievements.quests && user.achievements.quests[item.previous]);
      if (!completedPrevious)
        return $scope.purchase("quests", item);
      // FIXME it looks like template directives are compiled when
      // modal is loaded not when shown, so quest rewards doesn't work
      $scope.selectedItem = item;
      $ionicModal.fromTemplateUrl('views/app.modals.buyQuest.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.buyQuestModal = modal;
        $scope.buyQuestModal.show();
      });
    }

    // FIXME catch http errors with interceptor
    $scope.questInit = function(){
      $rootScope.party.$questAccept({key:$scope.selectedItem.key}, function(){
        $rootScope.party.$get();
        $scope.showQuestModal.hide();
        // FIXME force sync otherwise quest won't disappear
        $rootScope.sync();
      }, function(error){
        alert("Error: " + error.data.err);
      });
    }

    $scope.gearDetails = function(item){
      $ionicPopup.alert({
        title: item.text(),
        template: item.notes()
      });
    }
  }
]);
