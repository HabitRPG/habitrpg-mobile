'use strict';

/**
 * The nav controller:
 * - sets the menu options, should we do it dynamic so it generates the menu like: width = 1/elements * 100 ?
 * - exposes the model to the template and provides event handlers
 */

habitrpg.controller( 'NotificationCtrl', function WrapperCtrl( $scope, $location, filterFilter, Notification ) {

	Notification.get(function(delta) {

		$scope.delta = delta

		$scope.$watch('delta', function() {
			$scope.delta = delta

		})

	})

	var active 		  = false;
	var pos 		  = 0;
	var startX 		  = 0;
	var notification  = $('#notification')
	var treshold 	  = 0;
	var move_treshold = 0;

	notification.bind('touchmove.swipe', function(event) {

		move_treshold = event.originalEvent.target.offsetLeft;

		if (active == false) {
			active = true;
			startX = event.originalEvent.targetTouches[0].pageX - event.originalEvent.target.offsetLeft;
		}
		
		Notification.clearTimer()
		
		if (notification.position().left >= 0) {
			pos = event.originalEvent.targetTouches[0].pageX
			notification.css('left', parseInt(pos - startX))
		}


	})

	/*notification.bind('touchend.swipe', function(event) {

		treshold = $('#notification').offset().left

		console.log(treshold)
		console.log(move_treshold)

		if (move_treshold < treshold) {

			notification.transition({
				x: notification.width()
			}, 
			1000,
			'ease-out')

			setTimeout(function() {
				notification.css('top', '-60px')
				notification.css('left', '0px')
				notification.css('webkit-transform', 'none')
			}, 1000)

			Notification.clearDelta()

		}else{

			notification.transition({
				x:'-' + this.offsetLeft
			})

			setTimeout(function() {
				notification.css('left', '0px')
				notification.css('webkit-transform', 'none')
			}, 2000);

			Notification.init()

		}

		active = false;

	})*/

	notification.bind('touchend.swipe', function(event) {
		Notification.clearTimer()
		Notification.hide()
	});


});
