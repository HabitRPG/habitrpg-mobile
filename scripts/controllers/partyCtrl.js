'use strict';

habitrpg.controller('PartyCtrl',
  ['$scope', '$rootScope',
  function($scope, $rootScope) {
    $scope.group = $rootScope.party;

    $scope.questAbort = function(){
      if(!confirm(window.env.t('sureAbort'))) return;
      if(!confirm(window.env.t('doubleSureAbort'))) return;
      $rootScope.party.$questAbort();
    }
  }
]);
