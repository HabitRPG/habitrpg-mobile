'use strict';

/**
 * Services that persists and retrieves user from localStorage.
 */
habitrpg.run(function($rootScope, Facebook)
{
	$rootScope.Facebook=Facebook;

});

habitrpg.factory('Facebook', function()
{
	var self = this;
	this.auth = null;

	return {
		getAuth: function() {
			return self.auth;
		},

		login: function() {

			FB.login(function(response) {
				if (response.authResponse) {
					self.auth =response.authResponse;
				} else {
					console.log('Facebook login failed', response);
				}
			})
		},

		logout: function() {
			FB.logout(function(response) {
				if(response) {
					self.auth = null;
				} else {
					console.log('Facebook logout failed.', response);
				}
			})
		}
	}
})