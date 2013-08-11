'use strict';

habitrpg.controller('TaskDetailsCtrl',
  ['$scope', '$rootScope', '$location', 'User',
  function($scope, $rootScope, $location, User) {

    $scope.task = $rootScope.selectedTask;
    $scope.editing = false;
    $scope.editedTask = null;

    $scope.goBack = function () {
        $rootScope.selectedTask = null;
        $location.path('/' + $scope.task.type);
    };

    $scope.edit = function () {
        $scope.originalTask = _.clone($scope.task); // TODO deep clone?;
        $scope.editedTask = $scope.task;
        $scope.editing = true;
    };

    $scope.save = function () {
        var task = $scope.task;
        var log = [{op: 'set', data:{}}, {op: 'set', data: {}}];

        log[0].data["tasks." + task.id + ".text"] = task.text;
        log[1].data["tasks." + task.id + ".notes"] = task.notes;
        log[2].data["tasks." + task.id + ".up"] = task.up;
        log[3].data["tasks." + task.id + ".down"] = task.down;
        log[4].data["tasks." + task.id + ".priority"] = task.priority;
        log[5].data["tasks." + task.id + ".date"] = task.date;
        log[1].data["tasks." + task.id + ".price"] = task.price;

        _.each(task.repeat, function(el, key, list) {
            log.push({op: 'set', path: "tasks." + task.id + ".repeat." + key, value: el})
        })

        User.log(log);
        $rootScope.selectedTask = null;
        $location.path('/' + $scope.task.type);
        $scope.editing = false;


        //////////////////////////////////////////////////
        
        /*
        var ops = ([
            {op: 'set', path: "tasks." + task.id + ".text", value: task.text},
            {op: 'set', path: "tasks." + task.id + ".notes", value: task.notes},
            {op: 'set', path: "tasks." + task.id + ".up", value: task.up},
            {op: 'set', path: "tasks." + task.id + ".down", value: task.down},
            {op: 'set', path: "tasks." + task.id + ".priority", value: task.priority},
            {op: 'set', path: "tasks." + task.id + ".date", value: task.date},
            {op: 'set', path: "tasks." + task.id + ".price", value: task.price},
        ])

        */

        /*
        _.each(task.tags, function(el, key, list) {
            ops.push({op: 'set', path: "tasks." + task.id + ".tags." + key, value: el})
        })

        _.each(task.repeat, function(el, key, list) {
            ops.push({op: 'set', path: "tasks." + task.id + ".repeat." + key, value: el})
        })
        */

        //User.log(ops)

        ///////////////////////////////////////////////////
    };

    $scope.cancel = function () {
        // reset $scope.task to $scope.originalTask
        for (var key in $scope.task) {
            $scope.task[key] = $scope.originalTask[key];
        }
        $scope.originalTask = null;
        $scope.editedTask = null;
        $scope.editing = false;
    };

    $scope.delete = function () {
      var confirmed = window.confirm("Delete this task?");
      if (confirmed !== true) return;
      var task = $scope.task;
      var tasks = User.user[task.type+'s'];
      User.log({op: 'delTask', data: task});
      $scope.goBack();
      delete tasks.splice(tasks.indexOf(task),1);
    };
  }
]);
