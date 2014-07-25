'use strict';

var taskTypeToListMap = {
  habit: 'habits',
  daily: 'dailies',
  todo: 'todos',
  reward: 'rewards'
};

habitrpg
  .controller('TaskViewCtrl', ['$scope', 'User', '$state', function($scope, User, $state) {
    $scope.task = User.user.tasks[$state.params.tid];
    $scope._editing=false;
    var snapshot;

    $scope.edit = function(task){
      $scope._editing=true;
      snapshot = _.cloneDeep(task);
    }

    $scope.cancel = function (task) {
      $scope._editing = false;
      $scope.task = snapshot;
    };

    $scope.delete = function (task) {
      if (!window.confirm("Delete this task?")) return;
      User.user.ops.deleteTask({params: {id: task.id}});
      $state.go('app.tasks.' + taskTypeToListMap[task.type]);
    }

    function focusChecklist(index) {
      window.setTimeout(function(){
        document.querySelectorAll('.checklist-item')[index].focus();
      });
    }

    $scope.addChecklist = function(task) {
      task.checklist = [{completed:false,text:""}];
      focusChecklist(0);
    }

    $scope.addChecklistItem = function(task) {
      // prevent adding new item when there is a empty one
      if(task.checklist[task.checklist.length - 1].text !== ''){
        //User.user.ops.updateTask({params:{id:task.id},body:task}); // don't preen the new empty item
        task.checklist.push({completed:false,text:''});
        focusChecklist(task.checklist.length-1);
      }
    }

  }])

  .controller('TasksCtrl',
  ['$scope', '$rootScope', 'filterFilter', 'User', 'Notification', '$state', '$ionicActionSheet',
  function($scope, $rootScope, filterFilter, User, Notification, $state, $ionicActionSheet) {

    $scope.newTask = {};

    $scope.save = function (task,keepOpen) {
      if (task.checklist) task.checklist = _.filter(task.checklist,function(i){return !!i.text});
      User.user.ops.updateTask({params:{id:task.id},body:task});
//      if (!keepOpen) $state.go('app.'+task.type);
      if (!keepOpen) $state.go('app.tasks.' + taskTypeToListMap[task.type]);
    };

    $scope.taskFilter = function (task) {
      return task.type != 'todo' ? true :
        $state.is('app.tasks.todos') ? !task.completed :
        $state.is('app.tasks.todos.completed') ? task.completed : true;
    };

    $scope.moveItem = function(task, fromIndex, toIndex) {
      User.user.ops.sortTask({params:{id:task.id},query:{from:fromIndex, to:toIndex}});
    };

    $scope.score = function (task, direction, e) {
      if (e) e.stopPropagation();
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
      var text = newTask.text
      if (!text.length) return;
      User.user.ops.addTask({body:{text:text, type:type}});
      $scope.newTask.text = '';
    };

    $scope.clearDoneTodos = function () {
        //We can't alter $scope.user.tasks here. We have to invoke API call.
        //To be implemented
    };

    $scope.changeCheck = function (task, e) {
        // This is calculated post-change, so task.completed=true if they just checked it
        if (e) e.stopPropagation();
        task.completed = !task.completed;
        if (task.completed) {
            $scope.score(task, 'up')
        } else {
            $scope.score(task, 'down')
        }
    }

    $scope.actionSheet = function(task) {
      $ionicActionSheet.show({
        buttons: [{text: 'View/Edit'}],
        destructiveText: 'Delete',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          $state.go('app.task',{tid:task.id});
          return true;
        },
        destructiveButtonClicked: function(){
          if (!window.confirm("Delete this task?")) return;
          User.user.ops.deleteTask({params: {id: task.id}});
          return true;
        }
      });
    };

    $scope.viewTask = function(task, e) {
      $state.go('app.task',{tid:task.id});
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
