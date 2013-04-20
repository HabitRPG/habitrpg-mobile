'use strict';

/**
 * The nav controller:
 * - sets the menu options, should we do it dynamic so it generates the menu like: width = 1/elements * 100 ?
 * - exposes the model to the template and provides event handlers
 */

habitrpg.controller( 'WrapperCtrl', function WrapperCtrl( $scope, $location, filterFilter, Facebook ) {

$scope.menuclose = true;
$scope.menuopen  = false;

$scope.toggleMenu = function(hash) {

	if ($scope.menuopen) {

		$scope.menuclose = true;
  		$scope.menuopen  = false;

	}else{

		$scope.menuclose = false;
  		$scope.menuopen  = true;

	}

	$location.hash(hash)


}


});
