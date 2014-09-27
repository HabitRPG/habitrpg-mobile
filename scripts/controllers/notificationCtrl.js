'use strict';

habitrpg.controller('NotificationCtrl',
  ['$scope', '$rootScope', 'User', 'Notification',
  function ($scope, $rootScope, User, Notification) {
    $rootScope.$watchGroup([
        'user.stats.hp',
        'user.stats.exp',
        'user.stats.gp',
        'user.stats.mp'
      ], function(nv, ov){
        var text = '';
        var changed = {hp: false, exp: false, gp: false, mp: false};
        if(nv[0] !== ov[0] && User.user.stats.lvl != 0) text+=('hp: ' + (nv[0] - ov[0]));
        if(nv[1] !== ov[1] && User.user.stats.lvl != 0) text+=('exp: ' + (nv[1] - ov[1]));
        if(nv[2] !== ov[2]) text+=('gp: ' + (nv[2] - ov[2])); 
        if(nv[3] !== ov[3] && User.user.flags.classSelected && !User.user.preferences.disableClasses) text+=('mp: ' + (nv[3] - ov[3]));

        if(text !== '') Notification.push({type: 'text', text: text});
      });

    $rootScope.$watch('user.stats.gp', function(after, before) {
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
    });

    $rootScope.$watch('user._tmp.crit', function(after, before){
       if (after == before || !after) return;
       var amount = User.user._tmp.crit * 100 - 100;
       // reset the crit counter
       User.user._tmp.crit = undefined;
       Notification.push({type: 'text', text: 'crit: ' + amount});
       //Notification.crit(amount);
    });

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
        var text = Content.hatchingPotions[after.key].text();
        var notes = Content.hatchingPotions[after.key].notes();
        Notification.push({type: 'text', text: 'drop: ' + text});
        //Notification.drop(env.t('messageDropPotion', {dropText: text, dropNotes: notes}));
      }else if(after.type === 'Egg'){
        var text = Content.eggs[after.key].text();
        var notes = Content.eggs[after.key].notes();
        Notification.push({type: 'text', text: 'drop: ' + text});
        //Notification.drop(env.t('messageDropEgg', {dropText: text, dropNotes: notes}));
      }else if(after.type === 'Food'){
        var text = Content.food[after.key].text();
        var notes = Content.food[after.key].notes();
        Notification.push({type: 'text', text: 'drop: ' + text});
        //Notification.drop(env.t('messageDropFood', {dropArticle: after.article, dropText: text, dropNotes: notes}));
      }else{
        // Keep support for another type of drops that might be added
        Notification.push({type: 'text', text: 'drop: ' + User.user._tmp.drop.dialog});
        //Notification.drop(User.user._tmp.drop.dialog);
      }
    });

    $rootScope.$watch('user.achievements.streak', function(after, before){
      if(before == undefined || after == before || after < before) return;
      Notification.push({type: 'text', text: 'streak achievement'});
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
        Notification.push({type: 'text', text: 'level up'});
        //Notification.lvl();
      }
    });

    $rootScope.$on('responseError', function(ev, error){
      Notification.push({type: 'text', text: 'error'});
      //Notification.error(error);
    });

    $rootScope.$on('responseText', function(ev, error){
      Notification.push({type: 'text', text: 'response'});
      //Notification.text(error);
    });

}]);
