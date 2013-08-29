'use strict';

// Make user and settings available for everyone through root scope.
habitrpg.controller('SettingsCtrl',
  ['$scope', 'User', '$location', 'API_URL',
  function($scope, User, $location, apiUrl) {
    $scope.resetApp = function () {
        localStorage.clear();
        location.reload();
    };
    $scope.apiEndpoint = apiUrl;
    $scope.setApiEndpoint = function (newEndpoint) {
      habitrpg.constant('API_URL', newEndpoint);
    };

    $scope.auth = function (id, token) {
        User.authenticate(id, token, function (err) {
            if (!err) {
                alert('Login successful!');
                $location.path("/habit");
            }
        });
    };

  }
]);
