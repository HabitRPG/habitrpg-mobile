'use strict';

/**
 * The authentication controller (login & facebook)
 *
 */

habitrpg.controller( 'AuthCtrl', function AuthCtrl( $scope, Facebook ) {

    $scope.Facebook = Facebook;

    $scope.Local = { //fixme
        login:function(){},
        logout: function(){}
    };

});
