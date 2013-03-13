'use strict';

/**
 * The character controller:
 *
 */

habitrpg.controller( 'CharacterCtrl', function CharacterCtrl( $scope, $location, filterFilter, User ) {

    User.get(function(user){
        $scope.user = user;
    })

});
