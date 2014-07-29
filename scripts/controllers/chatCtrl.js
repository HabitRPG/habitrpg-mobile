'use strict';

habitrpg.controller('ChatCtrl',
  ['$rootScope','$scope', 'User', '$resource', 'API_URL', '$state', '$http',
    function($rootScope, $scope, User, $resource, API_URL, $state, $http) {
      $scope._message = {text:undefined};
      $scope.Chat = $resource(API_URL + "/api/v2/groups/:gid/chat",
        {gid:'@_id'}, {
          //send: {url: API_URL + '/api/v2/groups/:gid/chat', method: 'POST'/*, isArray:true*/}
        }
      );
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
        $rootScope.$broadcast('scroll.refreshComplete');
        $scope.chat = $scope.Chat.query({gid:$state.current.data.gid}, function(){
          doneSyncing();
        });
      }
    }
  ]);
