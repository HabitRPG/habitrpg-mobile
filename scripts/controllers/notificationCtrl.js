'use strict';

habitrpg.controller('NotificationCtrl',
  ['$scope', '$rootScope', 'User', 'Notification',
  function ($scope, $rootScope, User, Notification) {

    var alreadyNotified = {
      hp: null,
      gp: null,
      exp: null,
      mp: null
    };

    $rootScope.$watchGroup([
        'user.stats.hp',
        'user.stats.exp',
        'user.stats.gp',
        'user.stats.mp'
      ], function(nv, ov){
        var stats = {hp: null, exp: null, gp: null, mp: null};

        if(nv[0] !== ov[0] && User.user.stats.lvl != 0 && alreadyNotified.hp != nv[0]){
          stats.hp = (nv[0] - ov[0]);
          alreadyNotified.hp = nv[0];
        }

        if(nv[1] !== ov[1] && User.user.stats.lvl != 0 && alreadyNotified.exp != nv[1]){
          stats.exp = (nv[1] - ov[1]);
          alreadyNotified.exp = nv[1];
        }

        if(nv[2] !== ov[2] && alreadyNotified.gp != nv[2]){
          stats.gp = (nv[2] - ov[2]);
          alreadyNotified.gp = nv[2];
        }

        if(nv[3] !== ov[3] && User.user.flags.classSelected && !User.user.preferences.disableClasses && alreadyNotified.mp != nv[3]){
          stats.mp = (nv[3] - ov[3]);
          alreadyNotified.mp = nv[3];
        }

        if(stats.hp || stats.exp || stats.gp || stats.mp) Notification.push({type: 'stats', stats: stats});
      });

    // TODO bonus
    /*$rootScope.$watch('user.stats.gp', function(after, before) {
      if (after == before) return;
      if (User.user.stats.lvl == 0) return;
      var money = after - before;
      var bonus = User.user._tmp.streakBonus;
      //Notification.gp(money, bonus || 0);
      Notification.push({type: 'text', text: ('money now: ' + (money) + ' ' + bonus)});

      //Append Bonus

      if ((money > 0) && !!bonus) {
        if (bonus < 0.01) bonus = 0.01;
        Notification.push({type: 'text', text: ('bonus: ' + (bonus))});
        //Notification.text("+ " + Notification.coins(bonus) + ' ' + window.env.t('streakCoins'));
        delete User.user._tmp.streakBonus;
      }
    });*/
    
    $rootScope.$watch('user._tmp.crit', function(after, before){
       if (after == before || !after) return;
       var amount = User.user._tmp.crit * 100 - 100;
       // reset the crit counter
       User.user._tmp.crit = undefined;
       // Website use icon glyphicon-certificate, slightly different
       Notification.push({type: 'text', text: '<i class="ion-load-b"></i>&nbsp;' + env.t('critBonus') + Math.round(amount) + '%'});
    });

    // TODO: text and icon glyphicon-gift
    $rootScope.$watch('user._tmp.drop', function(after, before){
      if (after == before || !after) return;
      if (after.type !== 'gear') {
        var type = (after.type == 'Food') ? 'food' :
          (after.type == 'HatchingPotion') ? 'hatchingPotions' : // can we use camelcase and remove this line?
          (after.type.toLowerCase() + 's');
        if(!User.user.items[type][after.key]){
          User.user.items[type][after.key] = 0;
        }
        User.user.items[type][after.key]++;
      }

      if(after.type === 'HatchingPotion'){
        var text = $rootScope.Content.hatchingPotions[after.key].text();
        var notes = $rootScope.Content.hatchingPotions[after.key].notes();
        Notification.push({type: 'text', text: '<i class="ion-cube"></i>&nbsp;' + env.t('messageDropPotion', {dropText: text, dropNotes: notes})});
      }else if(after.type === 'Egg'){
        var text = $rootScope.Content.eggs[after.key].text();
        var notes = $rootScope.Content.eggs[after.key].notes();
        Notification.push({type: 'text', text: '<i class="ion-cube"></i>&nbsp;' + env.t('messageDropEgg', {dropText: text, dropNotes: notes})});
      }else if(after.type === 'Food'){
        var text = $rootScope.Content.food[after.key].text();
        var notes = $rootScope.Content.food[after.key].notes();
        Notification.push({type: 'text', text: '<i class="ion-cube"></i>&nbsp;' + env.t('messageDropFood', {dropArticle: after.article, dropText: text, dropNotes: notes})});
      }else{
        // Keep support for another type of drops that might be added
        Notification.push({type: 'text', text: '<i class="ion-cube"></i>&nbsp;' + User.user._tmp.drop.dialog});
      }
    });

    $rootScope.$watch('user.achievements.streak', function(after, before){
      if(before == undefined || after == before || after < before) return;
      Notification.push({type: 'text', text: '<i class="ion-refresh"></i>&nbsp;' + env.t('streakName') + ': ' + after});
      // TODO see below
      /*if (User.user.achievements.streak > 1) {
        Notification.push(type: 'text', text: 'streak achievement');
        Notification.streak(User.user.achievements.streak);
      }
      else {
        //$rootScope.openModal('achievements/streak');
      }*/
    });

    $rootScope.$watch('user.stats.lvl', function(after, before) {
      if (after == before) return;
      if (after > before) {
        Notification.push({type: 'text', text: '<i class="ion-chevron-up"></i>&nbsp;' + env.t('levelUp')});
      }
    });

    // TODO icon?
    $rootScope.$on('responseError', function(ev, error){
      Notification.push({type: 'text', text: '<i class="ion-alert"></i>&nbsp;' + error});
      //Notification.error(error);
    });
    
    // TODO icon?
    $rootScope.$on('responseText', function(ev, error){
      Notification.push({type: 'text', text: '<i class="ion-alert"></i>&nbsp;' + error});
    });

}]);
