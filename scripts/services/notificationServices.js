angular.module('notificationServices', []).
    factory('Notification', ['$filter','$rootScope', '$timeout', function ($filter,$rootScope, $timeout) {

        $rootScope.notifications = [];
        var active = false;
        var timer = null;
        var goldFilter = $filter('gold');
        var silverFilter = $filter('silver');

        return {

            push: function (message) {
                console.log('push:', message)
                var notif = {data: {}};
                notif.type = message.type;
                switch(message.type) {
                  case 'stats':
                    if (message.stats.gp) {
                      notif.data.gp = (message.stats.exp>0 ? '+':'')+ goldFilter(message.stats.gp);
                      notif.data.silver = silverFilter(message.stats.gp);
                    }
                    if (message.stats.exp)
                      notif.data.exp = (message.stats.exp>0 ? '+':'')+ message.stats.exp;
                    if (message.stats.hp)
                      notif.data.hp = message.stats.hp.toFixed(2)
                    break;
                  case 'text':
                    notif.data = message.text;
                    break;
                }

                $rootScope.notifications.push(notif);

                $timeout(function(){
                    $rootScope.notifications.shift();
                }, 2000);
            }

        }

    }]);
