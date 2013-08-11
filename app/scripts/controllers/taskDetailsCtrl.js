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
        User.log(log);
        $rootScope.selectedTask = null;
        $location.path('/' + $scope.task.type);
        $scope.editing = false;
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
        var task = $scope.task;
        var tasks = User.user[task.type+'s'];
        User.log({op: 'delTask', data: task});
        $scope.goBack();
        delete tasks.splice(tasks.indexOf(task),1);
    };
  }
]);
