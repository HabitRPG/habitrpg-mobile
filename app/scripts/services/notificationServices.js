angular.module('notificationServices', []).
    factory('Notification', function () {
        var data = {message:''};
        var active = false;
        var timer = null;

        return {

            hide: function () {
                $('#notification').fadeOut(function () {
                    $('#notification').css('webkit-transform', 'none').css('top', '-63px').show().css('left', '0px');
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

                    $('#notification').transition({ y: 63, x: 0 });
                    timer = setTimeout(this.hide, 2000);
                }

            },

            push: function (message) {
                data.message = ''
                switch(message.type) {
                    case 'stats':
                        if (message.stats.exp != null && message.stats.gp != null)
                            data.message = 'Experience: ' + message.stats.exp + '<br />GP: ' +  message.stats.gp.toFixed(2)
                        if (message.stats.hp)
                            data.message = 'HP: ' + message.stats.hp
                    break;
                    case 'text':
                        data.message = message.text
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

    });