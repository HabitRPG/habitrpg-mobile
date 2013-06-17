'use strict';

habitrpg.controller('TasksCtrl', function TasksCtrl($scope, $rootScope, $location, filterFilter, User, Algos, Helpers, Notification) {

    $scope.user = User.user;

    $scope.taskTypeTitle = function () {
//        show title according to the location
        switch ($location.path().split('/')[1]) {
            case 'habit':
                return 'Habits';
            case 'daily':
                return 'Dailies';
            case 'todo':
                return 'Todos';
            case 'reward':
                return 'Rewards';
            default :
                return "";
        }
    };

    $scope.taskType = function () {
        return $location.path().split('/')[1]
    };

    $scope.tasks = function () {
        //return task array based on our location i.e. /habit will return user.habits[]
        return User.user[$scope.taskType() + 's'];
    };

    $scope.taskFilter = function (task) {
        //this applies only to todos
        return ($location.path() == '/todo/active') ? !task.completed :
            ($location.path() == '/todo/completed') ? task.completed :
                true;
    };

    $scope.score = function (task, direction) {
        User.log({op: 'score', task: task, dir: direction});
    };

    $scope.addTask = function () {
        if (!$scope.newTask.length) {
            return;
        }

        var defaults = {
                text: $scope.newTask,
                type: $scope.taskType(),
                value: $scope.taskType() == 'reward' ? 20 : 0
            },
            extra = {};

        switch ($scope.taskType()) {
            case 'habit':
                extra = {up: true, down: true}
                break;
            case 'daily':
            case 'todo':
                extra = {completed: false}
                break;
        }


        var newTask = _.defaults(extra, defaults);
        newTask.id = Helpers.uuid();
        User.log({op: 'addTask', task: newTask});
        $scope.tasks().unshift(newTask);
        $scope.newTask = '';
        //Add the new task to the actions log

    };

    $scope.clearDoneTodos = function () {
        //We can't alter $scope.user.tasks here. We have to invoke API call.
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
