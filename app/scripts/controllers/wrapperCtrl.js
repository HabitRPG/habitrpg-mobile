'use strict';

/**
 * The nav controller:
 * - sets the menu options, should we do it dynamic so it generates the menu like: width = 1/elements * 100 ?
 * - exposes the model to the template and provides event handlers
 */

habitrpg.controller( 'WrapperCtrl', function WrapperCtrl( $scope, $location, filterFilter, Facebook ) {

$scope.menuclose = true;
$scope.menuopen  = false;

$scope.toggleMenu = function() {

	if ($scope.menuopen) {

		$scope.menuclose = true;
  		$scope.menuopen  = false;

	}else{

		$scope.menuclose = false;
  		$scope.menuopen  = true;

	}

}

$scope.mousedown = function($event) {

	$scope.dragging = true
	$scope.startX = $event.offsetX
	$scope.startY = $event.offsetY

}

$scope.mouseup = function() {

	angular.element($scope.targeted).css('position', 'relative')
	angular.element($scope.targeted).css('z-index', '0')
	angular.element($scope.targeted).css('top', '0px')
	angular.element($scope.targeted).css('left', '0px')

	$scope.dragging = null;
	$scope.X = null;
	$scope.Y = null;
	$scope.startX = null;
	$scope.startY = null;

	if($scope.current != 'false') {
		$($scope.targeted).insertAfter($($scope.current))
	}else{
		$($scope.targeted).parent().append($($scope.targeted))	
		console.log('asdasd')
	}


	$('#whitespace').remove()

	$scope.targeted = null
	$scope.current  = null

}

var m;

$scope.mousemove = function($event) {

	if ($scope.dragging) {

	if (!$scope.targeted) {

		m = 0;

		$scope.targeted = $event.target;
		$scope.X = $event.pageX;
		$scope.Y = $event.pageY;
		angular.element($scope.targeted).css('z-index', '9999')
		angular.element($scope.targeted).css('position', 'absolute')
		$('<div id="whitespace" style="width:' + $($scope.targeted).width() + 'px; height:' + $($scope.targeted).outerHeight() + 'px"></div>').insertBefore($($scope.targeted));

	}


	angular.element($scope.targeted).css('left', parseInt($event.pageX - $scope.startX) + 'px')
	angular.element($scope.targeted).css('top', parseInt($event.pageY - 80) + 'px')

	if (!$scope.current) {

		$scope.current = $scope.targeted;

	}


	
	console.log($scope.current)

	if ($event.pageY < m) {

	if ($($scope.current).prev().width() != null) {
	if ($event.pageY <= $($scope.current).prev().offset().top - 30) {

		$('#whitespace').remove()
		$('<div id="whitespace" style="width:' + $($scope.current).width() + 'px; height:' + $($scope.current).outerHeight() + 'px"></div>').insertBefore($($scope.current).prev());
		if ($($scope.current).prev().width() != null) {
			$scope.current = $($scope.current).prev().prev()
		
		}

	}
	}else{

		$scope.current = 'false';

	}


	}else{

		console.log('down')

		if ($($scope.current).next().width() != null) {
	if ($event.pageY >= $($scope.current).next().offset().top + 30) {

		$('#whitespace').remove()
		$('<div id="whitespace" style="width:' + $($scope.current).width() + 'px; height:' + $($scope.current).outerHeight() + 'px"></div>').insertAfter($($scope.current).next());
		if ($($scope.current).next().width() != null) {
			$scope.current = $($scope.current).next().next()
		
		}

	}
	}else{

		$scope.current = 'false';

	}

	}



	m = $event.pageY

	}

	}


});
