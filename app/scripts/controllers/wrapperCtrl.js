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

	/*if ($scope.direction == 'down') {
	if($scope.current != 'false') {
		$($scope.targeted).insertAfter($($scope.current))
	}else{
		$($scope.targeted).parent().append($($scope.targeted))	
	}
	}else{

	if($scope.current != 'false') {
		$($scope.targeted).insertBefore($($scope.current))
	}else{
		$($scope.targeted).parent().prepend($($scope.targeted))	
	}	

	}*/



	$scope.direction = null


	$('#whitespace').remove()

	$scope.targeted = null
	$scope.current  = null

}

var m;
var i;
var placeholder;

$scope.mousemove = function($event) {

	if ($scope.dragging) {

	if (!$scope.targeted) {
		m = 0;

		$scope.targeted = $event.target;
		$scope.current = $scope.targeted;
		$scope.X = $event.pageX;
		$scope.Y = $event.pageY;
		angular.element($scope.targeted).css('z-index', '9999')
		angular.element($scope.targeted).css('position', 'absolute')

		$scope.current.offset = {
			top: $($scope.current).offset().top,
			left: $($scope.current).offset().left
		};

		$.extend($scope.current.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - $scope.current.offset.left,
				top: event.pageY - $scope.current.offset.top
			},
			parent: $($scope.current).prev(),
		});

		//Generate the original position
		//$scope.current.originalPosition = this.position = this._generatePosition(event);

		placeholder = $('<div id="whitespace" style="width:' + $($scope.targeted).width() + 'px; height:' + $($scope.targeted).outerHeight() + 'px"></div>')
		placeholder.insertBefore($($scope.targeted));

	}


	angular.element($scope.targeted).css('top', parseInt($event.pageY - 80) + 'px')

	if (!$scope.current) {
		//$scope.current = $scope.targeted;
	}




	if ($event.pageY < m) {

		$scope.direction = 'up';

		if ($scope.current.offset.parent.width() != null) {

			if ($event.pageY <= $scope.current.offset.parent.offset().top) {


				$scope.current = $scope.current.offset.parent;

				$scope.current.offset = {
				top: $($scope.current).offset().top,
				left: $($scope.current).offset().left
				};


				$.extend($scope.current.offset, {
					click: { //Where the click happened, relative to the element
						left: event.pageX - $scope.current.offset.left,
						top: event.pageY - $scope.current.offset.top
					},
					parent: $($scope.current).prev(),
				});


				$('#whitespace').remove()
				placeholder.insertBefore($scope.current);

			}



		}

	}else{

		$scope.direction = 'down';

		console.log($event.pageY)

		if ($($scope.current).next().width() != null)
			console.log($($scope.current))


	if ($scope.current.offset.parent.width() != null) {

		if ($event.pageY >= $scope.current.offset.parent.offset().top + 30) {


			$scope.current = $scope.current.offset.parent;

			$scope.current.offset = {
			top: $($scope.current).offset().top,
			left: $($scope.current).offset().left
			};


			$.extend($scope.current.offset, {
				click: { //Where the click happened, relative to the element
					left: event.pageX - $scope.current.offset.left,
					top: event.pageY - $scope.current.offset.top
				},
				parent: $($scope.current).next(),
			});


			$('#whitespace').remove()
			placeholder.insertAfter($scope.current);

		}



		}

		}



	m = $event.pageY

	}

	}


});
