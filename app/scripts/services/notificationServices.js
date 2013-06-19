angular.module('notificationServices', []).
    factory('Notification', function () {
        var data = {message:{}};
        var active = false;
        var timer = null;

        return {

            hide: function () {
                $('#notification').fadeOut(function () {
                    $('#notification').css('top', '-60px').css('webkit-transform', 'none').show().css('left', '0px');
                });

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

                    $('#notification').transition({ y: 60, x: 0 });
                    timer = setTimeout(this.hide, 2000);
                }

            },

            push: function (message) {
                data.message=message;
//                TODO implement message growl type notifications instead.
                console.log(message);
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

    });