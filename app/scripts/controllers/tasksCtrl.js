'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */

habitrpg.controller('TasksCtrl', function TasksCtrl($scope, $rootScope, $location, filterFilter, User, Algos, Notification) {
    $scope.newTask = "";
    $rootScope.selectedTask = null; // FIXME is there a way to pass an object into another controller without rootScope?

    $scope.user = User.user;

    // FIXME optimize this watch
    $scope.$watch('tasks', function () {
        $scope.remainingCount = filterFilter($scope.user.tasks, {completed: false}).length;
        $scope.doneCount = $scope.user.tasks.length - $scope.remainingCount;
        $scope.allChecked = !$scope.remainingCount
    }, true);

    if ($location.path() === '') $location.path('/');
    $scope.location = $location;

    $scope.$watch('location.path()', function (path) {
        var type = $scope.taskType = path.split('/')[1];
        var filter = function (task) {
            return task.type === type && !task.del;
        };
        $scope.taskFilter = filter;
        $scope.taskTypeTitle =
            (type == 'habit') ? 'Habits' :
                (type == 'daily') ? 'Dailies' :
                    (type == 'todo') ? 'Todos' :
                        (type == 'reward') ? 'Rewards' : null;

        if (type == 'todo') {
            $scope.taskFilter = function (task) {
                var display = (path == '/todo/active') ? !task.completed :
                    (path == '/todo/completed') ? task.completed :
                        true;
                return filter(task) && display;
            }
        }
    });

    $scope.score = function (task, direction) {

//        var delta = Algos.score(user, task.id, direction);
//        Notification.push(delta);
        User.log({op: 'score', task: task.id, dir: direction});
    };

    $scope.addTask = function () {
        if (!$scope.newTask.length) {
            return;
        }

        var defaults = {
                text: $scope.newTask,
                type: $scope.taskType,
                value: $scope.taskType == 'reward' ? 20 : 0
            },
            extra = {};

        switch ($scope.taskType) {
            case 'habit':
                extra = {up: true, down: true}
                break;
            case 'daily':
            case 'todo':
                extra = {completed: false}
                break;
        }


        var newTask = _.defaults(extra, defaults);
        $scope.user.tasks.push(newTask);
        $scope.newTask = '';
        //Add the new task to the actions log
        User.log({op: 'create_task', task: newTask});
    };

    $scope.clearDoneTodos = function () {
        //We can't alter $scope.user.tasks her. We have to invoke API call.
        //To be implemented
    };

    $scope.selectTask = function (task) {
        $rootScope.selectedTask = task;
        $location.path('/tasks/' + task.id)
    }

    $scope.changeCheck = function (task) {
        // This is calculated post-change, so task.completed=true if they just checked it
        if (task.completed) {
            $scope.score(task, 'up')
        } else {
            $scope.score(task, 'down')
        }
    }


});
