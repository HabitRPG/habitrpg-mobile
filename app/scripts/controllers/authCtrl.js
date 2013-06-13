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
//authenticate user

     var uuid = '4a94db89-d825-4bbf-9c6c-4de0f7e65cc8',
         apiToken = 'd188cd17-dc9a-45f8-bdfa-66a358b0f597';
     User.authenticate(uuid, apiToken);

});
