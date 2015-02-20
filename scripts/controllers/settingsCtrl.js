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

    function setTimeAsString(time){
      if(time && time != ''){
        $scope.remindTimeOfDayString = moment(time).format('HH:mm');
      }
      else{
        $scope.remindTimeOfDayString = 'No time-to-remind set';
      }
    }

    setTimeAsString(setTime);

    $scope.onRemindTimeTapped = function(){
      var options = {
        date: $scope.remindTimeOfDay || new Date(),
        mode: 'time'
      };
      
      datePicker.show(options, function(date){
        $scope.$apply(function(){
          setTimeAsString(date);
        });
        
        if(date)
        {
          localStorage.setItem('REMINDER_TIME', date+'');
        }
        else
        {
          localStorage.setItem('REMINDER_TIME', '');
        }
     
        $scope.resetLocalNotifications();
      });
    }

    // copy to clipboard
    $scope.copy = function(type, text) {
      cordova.plugins.clipboard.copy(text);
      Notification.push({type: 'text', text: type + ' copied to clipboard'});
    }
  }
]);
