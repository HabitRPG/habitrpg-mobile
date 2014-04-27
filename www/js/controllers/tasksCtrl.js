'use strict';

habitrpg
  .controller('TaskViewCtrl', ['$scope', 'User', '$state', function($scope, User, $state) {
    $scope.task = User.user.tasks[$state.params.tid];
  }])
  .controller('TaskEditCtrl', ['$scope', 'User', '$state', function($scope, User, $state) {
    $scope.task = _.cloneDeep(User.user.tasks[$state.params.tid]);
    $scope.save = function (keepOpen) {
      User.user.ops.updateTask({params:{id:$scope.task.id},body:$scope.task});
      if (!keepOpen) $state.go('app.'+$scope.task.type);
    };

    $scope.cancel = function () {
      $state.go('app.'+$scope.task.type);
    };

    $scope.delete = function () {
      if (!window.confirm("Delete this task?")) return;
      User.user.ops.deleteTask({params:{id:$scope.task.id}});
      $state.go('app.'+$scope.task.type);
    };

  }])

  .controller('TasksCtrl',
  ['$scope', '$rootScope', 'filterFilter', 'User', 'Notification', '$state',
  function($scope, $rootScope, filterFilter, User, Notification, $state) {

    $scope.showedTasks = []

    $scope.taskFilter = function (task) {
      return $state.is('app.todo') ? !task.completed :
        $state.is('app.todo.completed') ? task.completed : true;
    };

    $scope.score = function (task, direction) {
      //save current stats to compute the difference after scoring.
      var statsDiff = {};
      var oldStats = _.clone(User.user.stats);
      User.user.ops.score({params:{id:task.id,direction:direction}});

      //compute the stats change.
      _.each(oldStats, function (value, key) {
          var newValue = User.user.stats[key];
          if (newValue !== value) {
              statsDiff[key] = newValue - value;
          }
      });
      //notify user if there are changes in stats.
      if (Object.keys(statsDiff).length > 0) {
        Notification.push({type: 'stats', stats: statsDiff});
      }
    };

    $scope.notDue = function(task) {
      if (task.type == 'daily')
        return !$rootScope.Shared.shouldDo(+new Date, task.repeat, {dayStart: User.user.preferences.dayStart});
      return false;
    }

    $scope.getClass = function(value) {
      // Fixme DRY up habitrpg-shared/index.coffee#taskClasses so we can get rid of this function
      switch(true) {
        case (value < -20): return ' color-worst';
        case (value < -10): return ' color-worse';
        case (value < -1): return ' color-bad';
        case (value < 1): return ' color-neutral';
        case (value < 5): return ' color-good';
        case (value < 10): return ' color-better';
        default: return  ' color-best';
      }
    }

    $scope.addTask = function (newTask, type) {
      if (!newTask.length) return;
      newTask = User.user.ops.addTask({body:{text: newTask, type: type}});
      $scope.showedTasks.unshift(newTask); // ???
      $scope._newTask = '';
    };

    $scope.clearDoneTodos = function () {
        //We can't alter $scope.user.tasks here. We have to invoke API call.
        //To be implemented
    };

    $scope.changeCheck = function (task) {
        // This is calculated post-change, so task.completed=true if they just checked it
        if (task.completed) {
            $scope.score(task, 'up')
        } else {
            $scope.score(task, 'down')
        }
    }


    /**
     * ------------------------
     * Items
     * ------------------------
     */

    $scope.$watch('user.items.gear.equipped', function(){
      $scope.itemStore = $rootScope.Shared.updateStore(User.user);
    }, true);

  }
]);
