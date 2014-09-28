angular.module('notificationServices', []).
    factory('Notification', ['$filter','$rootScope', '$timeout', function ($filter,$rootScope, $timeout) {

        $rootScope.notifications = [];
        var goldFilter = $filter('gold');
        var silverFilter = $filter('silver');
        var sign = function(number){
            return number?number<0?'-':'+':'+';
        };
        var round = function(number){
            return Math.abs(number.toFixed(1));
        };

        return {

            push: function (message) {
                console.log('push:', message)
                var notif = {data: {}};
                notif.type = message.type;

                switch(message.type) {
                  case 'stats':
                    if (message.stats.gp) {
                      notif.data.gp = goldFilter(message.stats.gp);
                      notif.data.silver = silverFilter(message.stats.gp);
                    }
                    if (message.stats.exp)
                      notif.data.exp = sign(message.stats.exp) + round(message.stats.exp);
                    if (message.stats.hp)
                      notif.data.hp = sign(message.stats.hp) + round(message.stats.hp);
                    if (message.stats.mp)
                      notif.data.mp = sign(message.stats.hp) + round(message.stats.mp)
                    break;
                  case 'text':
                    notif.data = message.text;
                    break;
                }

                $rootScope.notifications.push(notif);

                $timeout(function(){
                    $rootScope.notifications.shift();
                }, 2500);
            }

        }

    }]);
