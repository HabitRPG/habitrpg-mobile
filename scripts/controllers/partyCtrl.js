'use strict';

habitrpg.controller('PartyCtrl',
  ['$scope', '$rootScope',
  function($scope, $rootScope) {
    $scope.group = $rootScope.party;

    $scope.questAccept = function(party) {
      party.$questAccept();
    }

    $scope.questReject = function(party) {
      party.$questReject();
    }

    $scope.questAbort = function(){
      if(!confirm(window.env.t('sureAbort'))) return;
      if(!confirm(window.env.t('doubleSureAbort'))) return;
      $rootScope.party.$questAbort();
    }
  }
]);
