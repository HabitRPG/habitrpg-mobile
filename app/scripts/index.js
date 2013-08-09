/* Possibly necessary stuff for Angular + Cordova. See:
 * 1) https://github.com/hollyschinsky/MyAngularPhoneGapProject/tree/master/www
 * 2) http://stackoverflow.com/questions/15105910/angular-ng-view-routing-not-working-in-phonegap
 * They differ, so we may need dto consolidate some stuff?
 */

var app = {
  initialize: function() {
    this.bindEvents();
  },
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, true);
  },

  onDeviceReady: function() {
    angular.element(document).ready(function() {
      angular.bootstrap(document);
    });
  }
};