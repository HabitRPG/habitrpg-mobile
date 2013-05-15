angular.module('notificationServices', []).
	factory('Notification', function() {

		var delta  = { delta:0 };
		var active = false
		var timer = null

		return {

			hide:function() {

				$('#notification').fadeOut(function() {
				$('#notification').css('top','-60px');
				$('#notification').css('webkit-transform', 'none')
				$('#notification').show()
				$('#notification').css('left', '0px')
				});
					
				active		 = false;
				timer 		 = null
				delta.delta  = 0;

			},

			animate:function() {

				var that = this


				if (timer) {
					clearTimeout(timer);
					timer = setTimeout(this.hide, 2000)
				}

				if (active == false) {
					active = true;

					$('#notification').transition({ y: 60, x:0 })
					timer = setTimeout(this.hide, 2000)

				}

			},

			push:function(new_delta) {

				delta.delta += new_delta
				this.animate()

			},

			get:function(back) {

				return back(delta)

			},

			clearTimer:function() {

				clearTimeout(timer);
				timer = null;
				active = false;

			},

			clearDelta:function() {

				delta.delta = 0;

			},

			init:function() {

				timer = setTimeout(this.hide, 2000)

			}

		}

	});