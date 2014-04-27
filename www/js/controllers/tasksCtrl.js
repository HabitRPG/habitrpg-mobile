'use strict';

habitrpg
  .controller('HabitsCtrl',['$scope', function($scope){
    $scope.nav = {name:'Habits',type:'habit',singular:'Habit'};
  }])
  .controller('DailysCtrl',['$scope', function($scope){
    $scope.nav = {name:'Dailies',type:'daily',singular:'Daily'};
  }])
  .controller('TodosCtrl',['$scope', function($scope){
    $scope.nav = {name:'To-Dos',type:'todo',singular:'To-Do'};
  }])
  .controller('RewardsCtrl',['$scope', function($scope){
    $scope.nav = {name:'Rewards',type:'reward',singular:'Reward'};
  }])

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

    $scope.addTask = function (newTask) {
      if (!newTask.length) return;
      newTask = User.user.ops.addTask({body:{text: newTask, type: $scope.nav.type}});
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

    //$('.taskWell').css('height', $(window).height() - 76)

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
   
  }
]);
