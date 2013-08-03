'use strict';

/**
 * The menu controller:
 * - sets the menu options, should we do it dynamic so it generates the menu like: width = 1/elements * 100 ?
 * - exposes the model to the template and provides event handlers
 */

habitrpg.controller('MenuCtrl', function($scope, $location) {

  $scope.clickLink = function(link){
    $scope.currentTitle = link.name;
    $scope.menuopen = false;
    $location.path(link.link);
  }

  $scope.nav = [
    { link:'/habit',     name:'Habits'  },
    { link:'/daily',     name:'Dailies' },
    { link:'/todo',      name:'Todos'   },
    { link:'/reward',    name:'Rewards' },
    { link:'/profile',   name:'Profile' },
    { link:'/settings',  name:'Settings'}
  ]

});
