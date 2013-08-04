'use strict';

/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
 */
habitrpg.directive('taskFocus', function( $timeout ) {
  return function( scope, elem, attrs ) {
    scope.$watch(attrs.taskFocus, function( newval ) {
      if ( newval ) {
        $timeout(function() {
          elem[0].focus();
        }, 0, false);
      }
    });
  };
});

/**
 * Directive that executes an expression when the element it is applied to loses focus.
 */
habitrpg.directive('taskBlur', function() {
  return function( scope, elem, attrs ) {
    elem.bind('blur', function() {
      scope.$apply(attrs.taskBlur);
    });
  };
});

/**
 * Add sortable
 */
habitrpg.directive('sort', function (User) {
  return function ($scope, $rootScope, element, attrs, ngModel) {
    $(element).sortable({
      axis: "y",
      start: function (event, ui) {
        ui.item.data('startIndex', ui.item.index());
      },
      stop: function (event, ui) {
        var taskType = $rootScope.taskContext.type;
        var startIndex = ui.item.data('startIndex');
        var task = User.user[taskType][startIndex];
        User.log({op: 'sortTask', task: task, from: startIndex, to: ui.item.index()});
      }
    });
  }
});