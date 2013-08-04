'use strict';

/**
 * The authentication controller (login & facebook)
 *
 */

habitrpg.controller('AuthCtrl', function AuthCtrl($scope, $rootScope, Facebook, LocalAuth, User, $http, $location) {
    $scope.Facebook = Facebook;
    $scope.Local = LocalAuth;

    //localStorage.clear()

    document.addEventListener('deviceready', function() {

        FB.init({
            appId: '374812825970494',
            nativeInterface: CDV.FB,
            useCachedDialogs: false
        });

        //Facebook.authUser();
        //updateAuthElements();
    }, false);

    $scope.auth = function() {
        var username = $('#username').val()
        var password = $('#password').val()

        var data = {
            username: username,
            password: password
        }

        $.post('http://127.0.0.1:3000/api/v1/user/auth/local', data).success(function(data, status, headers, config) {
            User.authenticate(data.id, data.token, function(err) {
              alert('Login succesfull!');
              $location.path("/habit");
            });
        }).error(function(data, status, headers, config) {
            alert(status)
        })
    }
});