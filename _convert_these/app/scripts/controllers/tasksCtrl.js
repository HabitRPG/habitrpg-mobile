'use strict';

habitrpg.controller('TasksCtrl',
  ['$scope', '$rootScope', '$location', 'filterFilter', 'User', 'Notification', '$state',
  function($scope, $rootScope, $location, filterFilter, User, Notification, $state) {

    $scope.taskType = function () {
        return $location.path().split('/')[1]
    };

    $scope.tasks = function () {
        //return task array based on our location i.e. /habit will return user.habits[]
        return User.user[$scope.taskType() + 's'];
    };

    $scope.showedTasks = []

    $scope.taskFilter = function (task) {
      return $state.is('todo') ? !task.completed :
        $state.is('todo.completed') ? task.completed : true;
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
      if (task.type == 'daily') {
        return !$rootScope.Shared.shouldDo(+new Date, task.repeat, {dayStart: User.user.preferences.dayStart});
      } else {
        return false
      }
    }

    $scope.getClass = function(value) {

        var out = ''
        if (value < -20)
            out += ' color-worst'
        else if (value < -10)
            out += ' color-worse'
        else if (value < -1)
            out += ' color-bad'
        else if (value < 1)
            out += ' color-neutral'
        else if (value < 5)
            out += ' color-good'
        else if (value < 10)
            out += ' color-better'
        else
            out += ' color-best'
        return out
    }

    $scope.addTask = function () {
      if (!$scope.newTask.length) return;
      var newTask = User.user.ops.addTask({body:{text: $scope.newTask, type: $scope.taskType()}});
      $scope.showedTasks.unshift(newTask); // ???
      $scope.newTask = '';
    };

    $scope.clearDoneTodos = function () {
        //We can't alter $scope.user.tasks here. We have to invoke API call.
        //To be implemented
    };

    $scope.selectTask = function (task) {
        $rootScope.selectedTask = task;
        $location.path('/tasks/' + (task.id ? task.id : 'reward'));
    }

    $scope.changeCheck = function (task) {
        // This is calculated post-change, so task.completed=true if they just checked it
        if (task.completed) {
            $scope.score(task, 'up')
        } else {
            $scope.score(task, 'down')
        }
    }

    $('.taskWell').css('height', $(window).height() - 76)

    var counter = 0;


    /**
     * ------------------------
     * Items
     * ------------------------
     */

    $scope.$watch('user.items.gear.equipped', function(){
      $scope.itemStore = $rootScope.Shared.updateStore(User.user);
    }, true);


    $scope.buy = function(key) {
      User.user.ops.buy({params:{key:key}});
    };
   
    /*
    $scope.loadMore = function() {

        var length = $scope.showedTasks.length
        if (typeof $scope.tasks() != 'undefined') {
            for (var i = length; i < length+7; i++) {
                if (typeof $scope.tasks()[i] != 'undefined') {
                    $scope.showedTasks.push($scope.tasks()[i]);
                }
            }
        }


    };

    $scope.loadMore()

    */

  }
]);
