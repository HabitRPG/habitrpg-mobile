angular.module('notificationServices', []).
    factory('Notification', function () {

        var delta = { delta: 0 };
        var active = false;
        var timer = null;

        return {

            hide: function () {
                $('#notification').fadeOut(function () {
                    $('#notification').css('top', '-60px').css('webkit-transform', 'none').show().css('left', '0px');
                });

                active = false;
                timer = null;
                delta.delta = 0;
            },

            animate: function () {

                if (timer) {
                    clearTimeout(timer);
                    timer = setTimeout(this.hide, 2000)
                }

                if (active == false) {
                    active = true;

                    $('#notification').transition({ y: 60, x: 0 });
                    timer = setTimeout(this.hide, 2000);
                }

            },

            push: function (newDelta) {
                delta.delta += newDelta;
                this.animate()
            },

            get: function () {
                return delta;
            },

            clearTimer: function () {
                clearTimeout(timer);
                timer = null;
                active = false;
            },

            clearDelta: function () {
                delta.delta = 0;
            },

            init: function () {
                timer = setTimeout(this.hide, 2000);
            }

        }

    });