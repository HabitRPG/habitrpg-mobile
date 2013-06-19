'use strict';


habitrpg.controller('NotificationCtrl', function ($scope, $location, filterFilter, Notification) {
    $scope.delta = Notification.get();

    $('#notification').bind('touchend.swipe', function (event) {
        Notification.clearTimer();
        Notification.hide();
    });


});
