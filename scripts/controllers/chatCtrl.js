'use strict';

habitrpg.controller('ChatCtrl',
  ['$rootScope','$scope', 'User', '$resource', 'API_URL', '$state', '$http',
    function($rootScope, $scope, User, $resource, API_URL, $state, $http) {
      if (!$state.current.data.gid) {
        $state.current.data.gid = $state.params.gid;
      }
      $scope._message = {text:undefined};
      $scope.Chat = $resource(API_URL + "/api/v2/groups/:gid/chat",
        {gid:'@_id'}, {
          //send: {url: API_URL + '/api/v2/groups/:gid/chat', method: 'POST'/*, isArray:true*/}
        }
      );
      $scope.chat = [];
      var startSyncing = function(){
        $rootScope.chatSyncing = true;
      }
      var doneSyncing = function(){
        $rootScope.chatSyncing = false;
      }

      $scope.postChat = function(_message) {
        // FIXME setup the server for proper ngResource-handling
        startSyncing();
        $http.post(API_URL + '/api/v2/groups/' + $state.current.data.gid + '/chat', {}, {params:{message:_message.text}})
          .success(function(){
            $scope.query();
            _message.text = undefined;
            doneSyncing();
          })
      }
      $scope.query = function(){
        startSyncing();
        $scope._chat = $scope.Chat.query({gid:$state.current.data.gid}, function(){
          doneSyncing();
          if (!$scope.chat.length) {
            $scope.loadMore(8);
          } else {
            $scope.loadMore(0);
          }
        })
      }

      $scope.loadMore = function(amount) {
        $scope.chat = $scope._chat.slice(0, $scope.chat.length+amount);
        if ($scope._chat.length === $scope.chat.length) {
          $scope.noMoreMessages = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
      $scope.query();
    }
  ]);
