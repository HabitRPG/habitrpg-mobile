angular.module('notificationServices', []).
    factory('Notification', ['$filter','$rootScope', function ($filter,$rootScope) {
        $rootScope.notification = null;
        var active = false;
        var timer = null;
        var notifyheight = 113;
        var goldFilter = $filter('gold');
        var silverFilter = $filter('silver');

        return {

            hide: function () {
                $rootScope.$apply(function(){
                  $rootScope.notification = null;
                })
                active = false;
                timer = null;
            },

            animate: function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = setTimeout(this.hide, 2000)
                }
                if (active == false) {
                    active = true;
                    timer = setTimeout(this.hide, 2000);
                }
            },

            push: function (message) {
                $rootScope.notification = '';
                switch(message.type) {
                    case 'stats':
                        /* might want to eventually move this into a view or template of some kind,
                        as it gets more complex? */
                        var silverAmt = silverFilter(message.stats.gp) + '<span class="shop_silver">Silver:</span> ';
                        var rewards = goldFilter(message.stats.gp) < 1 && goldFilter(message.stats.gp) > 0 ? '<p>'+silverAmt+'</p>' :
                            '<p>' + goldFilter(message.stats.gp) +
                                '<span class="shop_gold">Gold</span> '
                                + silverAmt +
                            '</p>';

                        if (message.stats.exp != null && message.stats.gp != null)
                            $rootScope.notification = '<strong>Experience:</strong> ' + message.stats.exp + rewards
                        if (message.stats.hp)
                            $rootScope.notification = '<strong>HP:</strong> ' + message.stats.hp.toFixed(2)
                        if (message.stats.gp && message.stats.exp == null)
                            $rootScope.notification = rewards
                    break;
                    case 'text':
                        $rootScope.notification = message.text
                    break;
                }

                this.animate()
            },

            get: function () {
                return data;
            },

            clearTimer: function () {
                clearTimeout(timer);
                timer = null;
                active = false;
            },

            init: function () {
                timer = setTimeout(this.hide, 2000);
            }

        }

    }]);