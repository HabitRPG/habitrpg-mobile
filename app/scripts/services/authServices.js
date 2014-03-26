'use strict';

/**
 * Services that persists and retrieves user from localStorage.
 */

angular.module('authServices', ['userServices']).
factory('Facebook', ['$http', '$location', 'User', 'API_URL',
    function($http, $location, User, API_URL) {
      //TODO FB.init({appId: '${section.parameters['facebook.app.id']}', status: true, cookie: true, xfbml: true});

      document.addEventListener('deviceready', function () {
        try {
          FB.init({
            //appId: '128307497299777', //production
            appId: '439694562721556', //development
            //nativeInterface: CDV.FB, // FIXME re-enable this on deploy
            useCachedDialogs: false
          });
          //document.getElementById('data').innerHTML = "";
        } catch (e) {
          console.log(e);
        }
      }, false);

      FB.Event.subscribe('auth.login', function(response) {
        alert('auth.login event');
      })
      FB.Event.subscribe('auth.logout', function(response) {
        alert('auth.logout event');
      });

      var auth, user = User.user;

      return {

          authUser: function() {
            FB.Event.subscribe('auth.statusChange', function(session) {
              if (session.authResponse) {

                FB.api('/me', {
                  fields: 'name, picture, email'
                }, function(response) {
                  console.log(response.error)
                  if (!response.error) {

                    var data = {
                      name: response.name,
                      facebook_id: response.id,
                      email: response.email
                    }

                    $http.post(API_URL + '/api/v2/user/auth/facebook', data).success(function(data, status, headers, config) {
                      User.authenticate(data.id, data.token, function(err) {
                        if (!err) {
                          alert('Login successful!');
                          $location.path("/habit");
                        }
                      });
                    }).error(function(response) {
                        console.log('error')
                      })

                  } else {
                    alert('napaka')
                  }
                  //clearAction();
                });
              } else {
                document.body.className = 'not_connected';
                //clearAction();
              }
            });
          },

          getAuth: function() {
              return auth;
          },

          login: function() {
              FB.login(null, {
                  scope: 'email'
              });
          },

          logout: function() {
              FB.logout(function(response) {
                  window.location.reload();
              });
          }
      }

  }
])

.factory('LocalAuth',
    ['$http', 'User',
    function($http, User) {
      var auth,
        user = User.user;

      return {
          getAuth: function() {
              return auth;
          },

          login: function() {
              user.id = '';
              user.apiToken = '';
              User.authenticate();
              return;

          },

          logout: function() {}
      }

  }
]);
