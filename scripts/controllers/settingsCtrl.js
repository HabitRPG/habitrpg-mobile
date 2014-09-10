'use strict';

// Make user and settings available for everyone through root scope.
habitrpg.controller('SettingsCtrl',
  ['$scope', 'User', '$location', 'Notification',
  function($scope, User, $location, Notification) {
    $scope.resetApp = function () {
        localStorage.clear();
        location.reload();
    };
    $scope.auth = function (id, token) {
        User.authenticate(id, token, function (err) {
            if (!err) {
                alert('Login successful!');
                $location.path("/habit");
            }
        });
    };

    // copy to clipboard
    $scope.copy = function(type, text) {
      cordova.plugins.clipboard.copy(text);
      Notification.push({type: 'text', text: type + ' copied to clipboard'});
    }

  }
]);
