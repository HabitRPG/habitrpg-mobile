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

    var setTime = localStorage.getItem('REMINDER_TIME');

    if(setTime){
        $scope.remindTimeOfDay = moment(setTime).toDate();
    }

    $scope.timeChanged = function(){
        var date = moment($scope.remindTimeOfDay).toJSON();

        localStorage.setItem('REMINDER_TIME', date);

        $scope.resetLocalNotifications();
    };

    // copy to clipboard
    $scope.copy = function(type, text) {
      cordova.plugins.clipboard.copy(text);
      Notification.push({type: 'text', text: type + ' copied to clipboard'});
    }
  }
]);
