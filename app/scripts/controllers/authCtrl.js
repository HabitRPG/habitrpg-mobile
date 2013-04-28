'use strict';

/**
 * The authentication controller (login & facebook)
 *
 */

habitrpg.controller( 'AuthCtrl', function AuthCtrl( $scope, Facebook, LocalAuth, User) {

    $scope.Facebook = Facebook;
    $scope.Local = LocalAuth;

    $scope.apiLogin = function(){
        var uuid = $('#apiLoginForm #uuid').val(),
            apiToken = $('#apiLoginForm #apiToken').val();
        User.authenticate(uuid, apiToken);
    }

});
