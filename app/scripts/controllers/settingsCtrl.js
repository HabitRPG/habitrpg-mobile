'use strict';
// Make user and settings available for everyone through root scope.
habitrpg.controller( 'SettingsCtrl', function ( $scope, User, $location) {
    $scope.auth = function (id,token) {
        User.authenticate(id,token,function (err) {
            if (!err) {
                alert ('Login succesfull!');
                $location.path("/habit");
            }
        });
    }

});
