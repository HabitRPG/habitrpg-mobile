angular.module('habitrpg')
.directive('taskList', [function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      var isDaily = attrs.taskList == 'daily';
      var isTodo = attrs.taskList == 'todo';

      var CHECKED_CLASS = 'icon ion-checkmark-circled';
      var UNCHECKED_CLASS = 'checkbox-icon';

      function changeIonItemColor(task, ionItem){
        var removeColorClass = undefined;
        var classList = ionItem.className.split(' ');

        for (var i in classList) {
          var className = classList[i];

          if (className.indexOf("color-") != -1) {
            removeColorClass = className;
            break;
          }
        }

        if (removeColorClass != undefined)
          ionItem.classList.remove(removeColorClass);

        // add new / changed classes

        var newColorClass = scope.getClass(task.value).trim();

        ionItem.classList.add(newColorClass);
      }

      scope.changeColor = function (task, $event) {
        var btn = $event.target;

        // yes this looks ugly, but jqLite doesn't support selectors :/
        var ionItem = btn.parentNode.parentNode.parentNode.parentNode;

        changeIonItemColor(task, ionItem);
      };

      if(!isDaily && !isTodo) {
        return;
      }

      scope.changeCheck = function(task, $event){
        var btn = $event.target;

        // yes this looks ugly, but jqLite doesn't support selectors :/
        var ionItem = btn.parentNode.parentNode.parentNode;
        var btnIcon = angular.element(btn).find('i')[0];

        // default changeCheck behavior
        if ($event) $event.stopPropagation();
        task.completed = !task.completed;
        if (task.completed) {
          scope.score(task, 'up')
        } else {
          scope.score(task, 'down')
        }

        ionItem.classList.remove("completed");

        // find the "current" color class & remove it
        changeIonItemColor(task, ionItem);

        // add new / changed classes
        if(task.completed || scope.notDue(task))
        {
          ionItem.classList.add("completed");
        }

        var newIconClass = task.completed ? CHECKED_CLASS : UNCHECKED_CLASS;

        btnIcon.className = newIconClass;
      };
    }
  }
}]);