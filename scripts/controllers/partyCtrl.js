'use strict';

habitrpg.controller('PartyCtrl',
  ['$scope', '$rootScope', 'Quests', 'User',
  function($scope, $rootScope, Quests, User) {
    $scope.group = $rootScope.party;


    $scope.canEditQuest = function(party) {
      var isQuestLeader = party.quest && party.quest.leader === User.user._id;

      return isQuestLeader;
    };

    $scope.questCancel = function(){
      if (!confirm(window.env.t('sureCancel'))) return;

      Quests.sendAction('questCancel')
        .then(function(quest) {
          $scope.group.quest = quest;
        });
    }

    $scope.questAbort = function(){
      if (!confirm(window.env.t('sureAbort'))) return;
      if (!confirm(window.env.t('doubleSureAbort'))) return;

      Quests.sendAction('questAbort')
        .then(function(quest) {
          $scope.group.quest = quest;
        });
    }

    $scope.questLeave = function(){
      if (!confirm(window.env.t('sureLeave'))) return;

      Quests.sendAction('questLeave')
        .then(function(quest) {
          $scope.group.quest = quest;
        });
    }

    $scope.questAccept = function(){
      Quests.sendAction('questAccept')
        .then(function(quest) {
          $scope.group.quest = quest;
          User.user.party.quest.RSVPNeeded = false;
        });
    };

    $scope.questReject = function(){
      Quests.sendAction('questReject')
        .then(function(quest) {
          $scope.group.quest = quest;
          User.user.party.quest.RSVPNeeded = false;
        });
    };
  }
]);
