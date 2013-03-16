'use strict';

/**
 * The authentication controller (login & facebook)
 *
 */

habitrpg.controller( 'AuthCtrl', function AuthCtrl( $scope, Facebook, LocalAuth ) {

    $scope.Facebook = Facebook;
    $scope.Local = LocalAuth;

});
