'use strict';

/**
 * The menu controller:
 * - sets the menu options, should we do it dynamic so it generates the menu like: width = 1/elements * 100 ?
 * - exposes the model to the template and provides event handlers
 */

habitrpg.controller('MenuCtrl',
  ['$scope', '$rootScope', '$location', 'User', '$state',
  function($scope, $rootScope, $location, User, $state) {

  $scope.swiperight = function(){
    $scope.menuopen = true;
  }

  $scope.swipeleft = function(){
    $scope.menuopen = false;
  }

  $scope.menuClick = function(state) {
    $scope.menuopen = false;
    $state.go(state);
  }


  $scope.refreshing = function () {
    return User.settings.fetching ? "spin" : ""
  };

  $scope.queueLength = function () {
    return User.settings.sync.queue.length || User.settings.sync.sent.length
  };

  $scope.stats = User.user.stats;

  $('#main_nav').css('height', $(window).height())
  $('#wrapper').css('height', $(window).height())

  }
]);
