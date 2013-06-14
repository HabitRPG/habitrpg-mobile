'use strict';

/*

Statz controller

- Retrieves statz from localStorage.
- Exposes the model to the template and provides event handlers


*/


habitrpg.controller( 'StatsCtrl', function StatsCtrl( $scope, $location, filterFilter, User ) {
        $scope.settings=User.settings;
        $scope.stats = User.user.stats;

});