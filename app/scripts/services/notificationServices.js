angular.module('notificationServices', []).
    factory('Notification', function () {
        var data = {message:''};
        var active = false;
        var timer = null;
        var notifyheight = 113;

        return {

            hide: function () {
                $('#notification').fadeOut(function () {
                    $('#notification').css({
                        'webkit-transform': 'none',
                        'top': '-'+notifyheight+'px',
                        'left': '0px'
                });

                    setTimeout(function() {
                        $('#notification').show()
                    }, 190)
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

                    $('#notification').transition({ y: notifyheight, x: 0 });
                    timer = setTimeout(this.hide, 2000);
                }

            },

            push: function (message) {
                data.message = ''
                switch(message.type) {
                    case 'stats':
                        if (message.stats.exp != null && message.stats.gp != null)
                            data.message = '<strong>Experience:</strong> ' + message.stats.exp + '<br /><strong>GP</strong>: ' +  message.stats.gp.toFixed(2)
                        if (message.stats.hp)
                            data.message = '<strong>HP:</strong> ' + message.stats.hp.toFixed(2)
                        if (message.stats.gp && message.stats.exp == null)
                            data.message = '<br /><strong>GP:</strong> ' +  message.stats.gp.toFixed(2)
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